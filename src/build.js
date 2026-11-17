// Statik site üretici. Bağımlılık yok.
// Kullanım: node src/build.js  →  index.html (TR), en/index.html (EN), 404.html, sitemap.xml
// Görsel dil: bir oyun ve yazılım dergisinin sayısı; içerik gerçek dergi sayfalarına bölünür (bkz. DESIGN.md)
const fs = require("fs");
const path = require("path");
const C = require("./content.js");
const { icon } = require("./icons.js");
const drawArt = require("./art.js");
// Projeler panelden düzenlenir: data/projects.json
const PROJECTS = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "projects.json"), "utf8")).projects;

const ROOT = path.join(__dirname, "..");
const BUILD = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Marka ikonları (simple-icons, CC0): yalnızca path verisi alınır
const brand = (name) => {
  const svg = fs.readFileSync(path.join(ROOT, "assets", "icons", `${name}.svg`), "utf8");
  const d = /<path d="([^"]+)"/.exec(svg)[1];
  return `<svg class="brand-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
};

// Dekoratif barkod: sayı numarasından türetilen sabit çizgiler
function barcode(seed) {
  let x = 0, out = "", n = seed * 7919;
  for (let i = 0; i < 38; i++) {
    n = (n * 1103515245 + 12345) % 2147483648;
    const w = 1 + (n % 3), gap = 1 + ((n >> 3) % 2);
    out += `<rect x="${x}" y="0" width="${w}" height="40"/>`;
    x += w + gap;
  }
  return `<svg class="barcode-bars" viewBox="0 0 ${x} 40" preserveAspectRatio="none" aria-hidden="true">${out}</svg>`;
}

function page(lang) {
  const other = lang === "tr" ? "en" : "tr";
  // { tr, en } nesnesini ya da düz metni çöz
  const L = (v) => (v && typeof v === "object" && !Array.isArray(v) && ("tr" in v || "en" in v) ? v[lang] : v);
  const T = (k) => esc(L(C.ui[k]));
  const split = (s) => (s.includes("|") ? s.split("|")[lang === "tr" ? 0 : 1] : s);
  const art = drawArt(lang, esc);

  const home = lang === "tr" ? "/" : "/en/";
  const otherHome = lang === "tr" ? "/en/" : "/";
  const url = C.links.site.replace(/\/$/, "") + home;
  const ext = `<span class="sr">${T("externalHint")}</span>`;
  const extLink = (href, inner, cls = "") =>
    `<a${cls ? ` class="${cls}"` : ""} href="${esc(href)}" target="_blank" rel="noopener">${inner}${icon("ext", "px px--ext")}${ext}</a>`;
  // Tek parça uzun adlar (MyEverythingList) büyük harfte sütuna sığmaz: daha küçük dizilir
  const longWord = (t) => t.split(/\s+/).some((w) => w.length > 11);
  // Büyük harfe çevirmede "i" → "İ" yalnızca Türkçe adlarda olsun
  const titleLang = (t) => (/[çğıöşüÇĞİÖŞÜ]|Parsel/.test(t) ? "tr" : "en");

  const visible = PROJECTS.filter((p) => !p.hidden);
  const games = visible.filter((p) => p.track === "game");
  const code = visible.filter((p) => p.track === "code");

  // ---------- Küçük parçalar ----------

  const img = (im, cls = "") =>
    `<img${cls ? ` class="${cls}"` : ""} src="/assets/img/${esc(im.src)}" width="${im.w}" height="${im.h}" alt="${esc(L(im.alt))}" loading="lazy" decoding="async">`;
  const media = (p) => (p.image ? img(p.image) : `<div class="rv-art">${art[p.art] || ""}</div>`);
  const titleCls = (p, base) => `${base}${longWord(p.title) ? ` ${base}--long` : ""}`;
  const title = (p, tag, base) => {
    const sub = L(p.subtitle);
    return `<${tag} class="${titleCls(p, base)}" translate="no" lang="${titleLang(p.title)}">${esc(p.title)}${sub ? `<span class="rv-sub" lang="${titleLang(sub)}">${esc(sub)}</span>` : ""}</${tag}>`;
  };
  const body = (p) => {
    const points = L(p.points) || [];
    if (!points.length) return "";
    const nocap = /^[IİlJ1]/.test(points[0]) ? " rv-body--nocap" : "";
    return `<div class="rv-body${nocap}">${points.map((x) => `<p>${esc(x)}</p>`).join("")}</div>`;
  };
  const spec = (p) => {
    const stats = p.stats || [];
    return `
          <aside class="spec" aria-label="${T("specTitle")}: ${esc(p.title)}">
            <p class="spec-h">${T("specTitle")}</p>
            <dl class="spec-list">
              <div><dt>${T("specKind")}</dt><dd>${esc(L(p.kind))}</dd></div>
              ${L(p.date) ? `<div><dt>${T("specDate")}</dt><dd>${esc(L(p.date))}</dd></div>` : ""}
              <div><dt>${T("specTech")}</dt><dd>${p.tech.map(esc).join(", ")}</dd></div>
            </dl>
            ${stats.length ? `<p class="spec-h">${T("numbersTitle")}</p>
            <dl class="spec-nums">${stats.map((s) => `<div><dt>${esc(L(s.k))}</dt><dd>${esc(L(s.v))}</dd></div>`).join("")}</dl>` : ""}
          </aside>`;
  };
  const actions = (p) => p.links.length ? `
          <p class="rv-links">${p.links.map((l, i) => extLink(l.href, esc(L(C.ui.links[l.label])), i === 0 ? "btn btn--solid" : "btn")).join("")}</p>` : "";

  // ---------- Sayfa blokları ----------
  // Her blok bir ya da iki sayfadır. "even": blok çift sayfadan (açılımın solundan) başlamalı.
  const blocks = [];
  const add = (b) => blocks.push(b);

  // İçindekiler + Editörden (s. 2-3)
  add({ even: true, pages: [
    { id: "icindekiler", cls: "page--contents sec--ink", label: T("tocTitle"), render: () => contentsPage() },
    { id: "editor", cls: "page--editor sec--game", label: T("editorTitle"), render: () => editorPage() },
  ] });

  const sectionBlocks = (items, track, id, secTitle, secDeck, briefsTitle) => {
    const full = items.filter((p) => p.tier !== "compact");
    const briefs = items.filter((p) => p.tier === "compact");
    add({ pages: [
      { id, cls: `page--opener sec--${track}`, label: secTitle, render: () => openerPage(secTitle, secDeck, full, briefs.length ? `${id}-kisa` : null, briefsTitle) },
    ] });
    let single = 0;
    full.forEach((p) => {
      if (p.tier === "featured") {
        const lead = track === "code";
        add({ even: true, pages: [
          { id: p.id, cls: `page--${lead ? "lead-a" : "feature-a"} sec--${track}`, label: esc(p.title), render: () => (lead ? leadA(p) : featureA(p)) },
          { id: `${p.id}-2`, cls: `page--${lead ? "lead-b" : "feature-b"} sec--${track}`, label: `${esc(p.title)} (2)`, render: () => (lead ? leadB(p) : featureB(p)) },
        ] });
      } else {
        const variant = single++ % 2 === 0 ? "a" : "b";
        add({ pages: [
          { id: p.id, cls: `page--review page--review-${variant} sec--${track}${p.image ? "" : " has-art"}`, label: esc(p.title), render: () => reviewPage(p, variant) },
        ] });
      }
    });
    if (briefs.length) {
      add({ pages: [{ id: `${id}-kisa`, cls: `page--briefs sec--${track}`, label: briefsTitle, render: () => briefsPage(briefsTitle, briefs) }] });
    }
  };
  sectionBlocks(games, "game", "oyun", T("secGame"), T("secGameDeck"), T("briefsGame"));
  sectionBlocks(code, "code", "yazilim", T("secCode"), T("secCodeDeck"), T("briefsCode"));

  const half = Math.ceil(C.quests.length / 2);
  add({ even: true, pages: [
    { id: "yolculuk", cls: "page--journey sec--ink", label: T("journeyTitle"), render: () => journeyPage(C.quests.slice(0, half), true) },
    { id: "yolculuk-2", cls: "page--journey sec--ink", label: `${T("journeyTitle")} (2)`, render: () => journeyPage(C.quests.slice(half), false) },
  ] });
  add({ pages: [{ id: "rozetler", cls: "page--awards sec--game", label: T("awardsTitle"), render: () => awardsPage() }] });
  add({ pages: [{ id: "rehber", cls: "page--guide sec--code", label: T("guideTitle"), render: () => guidePage() }] });
  add({ pages: [{ id: "mektup", cls: "page--letters sec--game", label: T("lettersTitle"), render: () => lettersPage() }] });
  add({ pages: [{ id: "kunye", cls: "page--imprint sec--ink", label: T("imprintTitle"), render: () => imprintPage() }] });

  // ---------- Sayfalama: açılımlar çift sayfadan başlar, arka kapak tek ve çift numaralı kalır ----------
  const pages = [{ id: "kapak", cls: "page--cover", label: T("coverPage"), render: () => coverPage(), foot: false }];
  let adIndex = 0;
  const adPage = () => {
    const ad = C.ui.ads[adIndex++ % C.ui.ads.length];
    return { id: `reklam-${ad.id}`, cls: "page--ad", label: `${T("adWord")}: ${esc(L(ad.title))}`, render: () => adPageHtml(ad) };
  };
  for (const b of blocks) {
    if (b.even && (pages.length + 1) % 2 === 1) pages.push(adPage());
    pages.push(...b.pages);
  }
  // Arka kapak çift sayfa olmalı (açılımın solu): gerekiyorsa bir reklam daha
  if ((pages.length + 1) % 2 === 1) pages.push(adPage());
  pages.push({ id: "arka-kapak", cls: "page--back", label: T("backCover"), render: () => backPage(), foot: false });
  const total = pages.length;
  const pageOf = {};
  pages.forEach((p, i) => { pageOf[p.id] = i + 1; });
  const pn = (id) => pageOf[id];

  // ---------- Sayfa şablonları ----------

  function coverPage() {
    return `
      <img class="cover-art" src="/assets/img/kralin-sozu-gate_view.webp" width="1200" height="675" alt="${T("coverAlt")}" fetchpriority="high">
      <div class="cover-inner">
        <p class="cover-issue"><span>${T("issue")}</span><span>${T("issueDate")}</span><span>${T("issueTag")}</span></p>
        <h1 class="masthead"><span class="masthead-word" lang="tr" translate="no" aria-hidden="true">YAZITAŞ</span><span class="cover-name"><span lang="tr">Salih Yazıtaş</span>, ${lang === "tr" ? "oyun ve yazılım geliştirici" : "game & software developer"}</span></h1>
        <a class="cover-story" href="#kralin-sozu">
          <span class="cover-title">${T("coverTitle")}</span>
          <span class="cover-deck">${T("coverDeck")}</span>
        </a>
        <ul class="cover-lines">${C.coverLines.map((c) => `
          <li><a href="${c.href}"><span class="cl-big">${esc(L(c.big))}</span><span class="cl-text">${esc(L(c.text))}</span></a></li>`).join("")}
        </ul>
        <a class="sticker" href="/cv/Salih_Yazitas_CV_${lang === "tr" ? "TR" : "EN"}.pdf" download><span class="sticker-top">${T("stickerTop")}</span><span class="sticker-main">${T("stickerMain")}</span></a>
        <div class="barcode" aria-hidden="true">${barcode(26)}<span>${T("issue")}</span></div>
      </div>`;
  }

  function contentsPage() {
    const group = (secTitle, sid, items) => {
      const full = items.filter((p) => p.tier !== "compact");
      return `
          <li class="toc-group">
            <a class="toc-sec" href="#${sid}"><span>${secTitle}</span><span class="toc-pg">${pn(sid)}</span></a>
            <ul>${full.map((p) => `
              <li><a href="#${esc(p.id)}"><span lang="${titleLang(p.title)}">${esc(p.title)}</span><span class="toc-pg">${pn(p.id)}</span></a></li>`).join("")}
              ${items.some((p) => p.tier === "compact") ? `<li><a href="#${sid}-kisa"><span>${lang === "tr" ? "Kısa kısa" : "In brief"}</span><span class="toc-pg">${pn(sid + "-kisa")}</span></a></li>` : ""}
            </ul>
          </li>`;
    };
    return `
      <h2 class="toc-title">${T("tocTitle")}</h2>
      <ol class="toc-list">
        ${group(T("secGame"), "oyun", games)}
        ${group(T("secCode"), "yazilim", code)}
        <li class="toc-group toc-group--misc"><ul>
          <li><a href="#yolculuk"><span>${T("journeyTitle")}</span><span class="toc-pg">${pn("yolculuk")}</span></a></li>
          <li><a href="#rozetler"><span>${T("awardsTitle")}</span><span class="toc-pg">${pn("rozetler")}</span></a></li>
          <li><a href="#rehber"><span>${T("guideTitle")}</span><span class="toc-pg">${pn("rehber")}</span></a></li>
          <li><a href="#mektup"><span>${T("lettersTitle")}</span><span class="toc-pg">${pn("mektup")}</span></a></li>
          <li><a href="#kunye"><span>${T("imprintTitle")}</span><span class="toc-pg">${pn("kunye")}</span></a></li>
        </ul></li>
      </ol>`;
  }

  function editorPage() {
    return `
      <img class="editor-photo" src="/assets/img/salih.webp" width="480" height="480" alt="${T("photoAlt")}" loading="lazy" decoding="async">
      <h2 class="editor-title">${T("editorTitle")}</h2>
      <div class="editor-text">${L(C.ui.editorLetter).map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      <p class="editor-sign">${T("editorSign")}</p>
      <p class="editor-cv">
        <a class="btn btn--solid" href="/cv/Salih_Yazitas_CV_${lang === "tr" ? "TR" : "EN"}.pdf" download>${icon("download")}<span>${T(lang === "tr" ? "cvTr" : "cvEn")}</span></a>
      </p>`;
  }

  function openerPage(secTitle, deck, full, briefsId, briefsTitle) {
    return `
      <h2 class="opener-title">${secTitle}</h2>
      <p class="opener-deck">${deck}</p>
      <div class="opener-list">
        <p class="opener-list-h">${T("inSection")}</p>
        <ul>${full.map((p) => `<li><a href="#${esc(p.id)}"><span lang="${titleLang(p.title)}" translate="no">${esc(p.title)}</span><span class="toc-pg">${pn(p.id)}</span></a></li>`).join("")}
          ${briefsId ? `<li><a href="#${briefsId}"><span>${briefsTitle}</span><span class="toc-pg">${pn(briefsId)}</span></a></li>` : ""}
        </ul>
      </div>`;
  }

  // Yayılım (oyun): sol sayfa tam görsel ve başlık, sağ sayfa metin ve künye
  function featureA(p) {
    return `
      <div class="fa-art">${media(p)}</div>
      <div class="fa-head">${title(p, "h3", "rv-title")}<p class="rv-deck">${esc(L(p.pitch))}</p></div>
      ${p.gallery && p.gallery.length ? `<ul class="rv-gallery">${p.gallery.map((g) => `<li>${img({ ...g, w: g.w || 1200, h: g.h || 675 })}</li>`).join("")}</ul>` : ""}`;
  }
  function featureB(p) {
    return `${body(p)}${spec(p)}${actions(p)}`;
  }
  // Lead (yazılım): sol sayfa büyük başlık ve görsel, sağ sayfa metin ve künye
  function leadA(p) {
    return `${title(p, "h3", "rv-title")}<p class="rv-deck">${esc(L(p.pitch))}</p><div class="rv-frame">${media(p)}</div>`;
  }
  function leadB(p) {
    return `${body(p)}${spec(p)}${actions(p)}`;
  }
  // Tek sayfa inceleme: iki varyant (a: görsel üstte, b: başlık üstte, görsel ortada)
  function reviewPage(p, variant) {
    const frame = `<div class="rv-frame">${media(p)}</div>`;
    const head = `${title(p, "h3", "rv-title")}<p class="rv-deck">${esc(L(p.pitch))}</p>`;
    return variant === "a"
      ? `${frame}${head}<div class="rv-cols">${body(p)}${spec(p)}</div>${actions(p)}`
      : `${head}${frame}<div class="rv-cols">${body(p)}${spec(p)}</div>${actions(p)}`;
  }

  function briefsPage(briefsTitle, briefs) {
    return `
      <h3 class="briefs-title">${briefsTitle}</h3>
      <ul class="brief-list">${briefs.map((p) => {
        const sub = L(p.subtitle);
        return `
        <li class="brief" id="${esc(p.id)}">
          <div class="brief-frame">${media(p)}</div>
          <h4 class="${titleCls(p, "brief-title")}" translate="no" lang="${titleLang(p.title)}">${esc(p.title)}</h4>
          ${sub ? `<p class="brief-sub" lang="${titleLang(sub)}">${esc(sub)}</p>` : ""}
          <p class="brief-meta">${esc(L(p.kind))}${L(p.date) ? `, ${esc(L(p.date))}` : ""}</p>
          <p class="brief-pitch">${esc(L(p.pitch))}</p>
          ${p.links.length ? `<p class="brief-links">${p.links.map((l) => extLink(l.href, esc(L(C.ui.links[l.label])))).join("")}</p>` : ""}
        </li>`;
      }).join("")}
      </ul>`;
  }

  const statusIcon = { active: "flag", done: "check", locked: "lock" };
  function journeyPage(list, first) {
    const entry = (q) => {
      if (q.status === "locked") {
        return `<li class="entry entry--locked"><p class="entry-date">${esc(L(C.ui.status.locked))}</p><div class="entry-body"><h3 class="entry-title">${T("lockedTitle")}</h3><p class="entry-org">${T("lockedText")}</p></div></li>`;
      }
      const goals = L(q.goals) || [];
      return `
        <li class="entry entry--${q.status}">
          <p class="entry-date">${esc(L(q.date)) || "&nbsp;"}<span class="entry-status">${icon(statusIcon[q.status])}${esc(L(C.ui.status[q.status]))}</span></p>
          <div class="entry-body">
            <h3 class="entry-title">${esc(L(q.title))}</h3>
            <p class="entry-org">${esc(L(q.org))}</p>
            ${goals.length ? `<ul class="entry-goals">${goals.map((g) => `<li>${esc(g)}</li>`).join("")}</ul>` : ""}
          </div>
        </li>`;
    };
    return `
      ${first ? `<h2 class="feature-title">${T("journeyTitle")}</h2><p class="feature-deck">${T("journeyDeck")}</p>` : ""}
      <ol class="timeline">${list.map(entry).join("")}</ol>`;
  }

  function awardsPage() {
    return `
      <h2 class="feature-title">${T("awardsTitle")}</h2>
      <p class="feature-deck">${T("awardsDeck")}</p>
      <ul class="seals">${C.achievements.map((a) => `
        <li class="seal"><span class="seal-disc">${icon(a.icon)}</span><span class="seal-name">${esc(L(a.name))}</span><span class="seal-how">${esc(L(a.how))}</span></li>`).join("")}
        <li class="seal seal--locked" id="secret-badge"><span class="seal-disc">${icon("lock")}</span><span class="seal-name">${T("secretName")}</span><span class="seal-how">${T("secretHint")}</span></li>
      </ul>`;
  }

  function guidePage() {
    return `
      <h2 class="feature-title">${T("guideTitle")}</h2>
      <p class="feature-deck">${T("guideDeck")}</p>
      <table class="guide">
        <thead><tr><th scope="col">${T("guideCat")}</th><th scope="col">${T("guideTools")}</th><th scope="col">${T("guideUsed")}</th></tr></thead>
        <tbody>
          <tr><th scope="row">${T("guideLangs")}</th><td data-label="${T("guideTools")}">${C.languages.map(esc).join(", ")}</td><td data-label="${T("guideUsed")}">${lang === "tr" ? "Bütün projeler" : "Every project"}</td></tr>
          ${C.skills.map((s) => `<tr><th scope="row">${esc(L(s.branch))}</th><td data-label="${T("guideTools")}">${s.items.map((i) => esc(split(i))).join(", ")}</td><td data-label="${T("guideUsed")}">${esc(L(s.used))}</td></tr>`).join("\n          ")}
        </tbody>
      </table>`;
  }

  function lettersPage() {
    const cv = (which, cls) => `<a class="${cls}" href="/cv/Salih_Yazitas_CV_${which}.pdf" download>${icon("download")}<span>${T(which === "TR" ? "cvTr" : "cvEn")}</span></a>`;
    const first = lang === "tr" ? "TR" : "EN", second = lang === "tr" ? "EN" : "TR";
    return `
      <h2 class="feature-title">${T("lettersTitle")}</h2>
      <p class="feature-deck">${T("lettersDeck")}</p>
      <p class="mail"><a class="mail-link" href="mailto:${C.links.email}">${C.links.email}</a></p>
      <p class="letters-actions">
        <button type="button" class="btn" data-copy="${C.links.email}" data-ok="${T("copied")}" data-fail="${T("copyFailed")}">${icon("copy")}<span>${T("copyEmail")}</span></button>
        ${cv(first, "btn btn--solid")}
        ${cv(second, "btn")}
      </p>
      <ul class="socials">
        <li>${extLink(C.links.github, `${brand("github")}<span>GitHub</span>`)}</li>
        <li>${extLink(C.links.linkedin, `${brand("linkedin")}<span>LinkedIn</span>`)}</li>
        <li>${extLink(C.links.itch, `${brand("itchdotio")}<span>itch.io</span>`)}</li>
        <li>${extLink(C.links.volpen, `${icon("crown", "brand-icon")}<span>Volpen</span>`)}</li>
      </ul>`;
  }

  function imprintPage() {
    return `
      <h2 class="feature-title">${T("imprintTitle")}</h2>
      <dl class="imprint">${C.ui.imprint.map((r) => `<div><dt>${esc(L(r.k))}</dt><dd>${esc(L(r.v))}</dd></div>`).join("")}</dl>
      <p class="imprint-note">${T("footer")}</p>
      <p class="imprint-hint">${T("footerHint")}</p>
      <p class="imprint-lang"><a href="${otherHome}" hreflang="${other}" lang="${other}">${T("langSwitch")}</a></p>`;
  }

  function adPageHtml(ad) {
    const cv = ad.cv ? `/cv/Salih_Yazitas_CV_${lang === "tr" ? "TR" : "EN"}.pdf` : null;
    const cta = cv
      ? `<a class="btn btn--ad" href="${cv}" download>${icon("download")}<span>${esc(L(ad.cta))}</span></a>`
      : extLink(ad.href, esc(L(ad.cta)), "btn btn--ad");
    return `
      <p class="ad-tag">${T("adWord")}</p>
      ${ad.image ? `<div class="ad-art"><img src="/assets/img/${ad.image}" width="1200" height="675" alt="" loading="lazy" decoding="async"></div>` : ""}
      <p class="ad-title" translate="no">${esc(L(ad.title))}</p>
      <p class="ad-line">${esc(L(ad.line))}</p>
      <p class="ad-small">${esc(L(ad.small))}</p>
      <p class="ad-cta">${cta}</p>`;
  }

  function backPage() {
    return `
      <p class="back-mast" lang="tr" translate="no">YAZITAŞ</p>
      <h2 class="back-title">${T("nextTitle")}</h2>
      <ul class="back-next">${L(C.ui.next).map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
      <p class="back-line">${T("backLine")}</p>
      <div class="back-bottom">
        <p class="back-price">${T("price")}</p>
        <div class="barcode barcode--back" aria-hidden="true">${barcode(26)}<span>${T("issue")} · ${T("issueDate")}</span></div>
      </div>`;
  }

  // ---------- Sayfaları sar ----------
  const html = pages.map((pg, i) => {
    const n = i + 1;
    const side = n % 2 === 0 ? "left" : "right";
    const foot = pg.foot === false ? "" : `
    <footer class="page-foot" aria-hidden="true"><span class="page-run" translate="no">YAZITAŞ · ${T("issueDate")}</span><span class="page-no">${n}</span></footer>`;
    return `
  <section class="page ${pg.cls} page--${side}" id="${pg.id}" data-page="${n}" aria-label="${T("pageWord")} ${n}: ${pg.label}">
    <div class="page-inner">${pg.render()}</div>${foot}
  </section>`;
  }).join("");

  const navItems = [
    ["icindekiler", T("tocTitle")], ["oyun", T("secGame")], ["yazilim", T("secCode")],
    ["yolculuk", lang === "tr" ? "Yolculuk" : "Journey"], ["mektup", T("lettersTitle")],
  ];

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Salih Yazıtaş",
    url,
    image: C.links.site + "assets/img/salih.webp",
    jobTitle: lang === "tr" ? "Oyun ve yazılım geliştirici" : "Game & software developer",
    email: "mailto:" + C.links.email,
    address: { "@type": "PostalAddress", addressLocality: "Çanakkale", addressCountry: "TR" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Çanakkale Onsekiz Mart Üniversitesi" },
    founder: { "@type": "Organization", name: "Volpen", url: C.links.volpen },
    sameAs: [C.links.github, C.links.linkedin, C.links.itch],
    knowsAbout: ["Unity", "C#", "TypeScript", "React", "Python", "FastAPI", "Supabase", "Electron", "Tauri", "Go"],
  };

  return `<!doctype html>
<html lang="${lang}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(L(C.meta.title))}</title>
<meta name="description" content="${esc(L(C.meta.description))}">
<meta name="author" content="Salih Yazıtaş">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="tr" href="${C.links.site}">
<link rel="alternate" hreflang="en" href="${C.links.site}en/">
<link rel="alternate" hreflang="x-default" href="${C.links.site}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#d9d8d2" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0e0f11" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="Salih Yazıtaş">
<meta property="og:title" content="${esc(L(C.meta.title))}">
<meta property="og:description" content="${esc(L(C.meta.description))}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${lang === "tr" ? "tr_TR" : "en_US"}">
<meta property="og:locale:alternate" content="${lang === "tr" ? "en_US" : "tr_TR"}">
<meta property="og:image" content="${C.links.site}assets/og/og-${lang}.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(L(C.meta.ogAlt))}">
<meta property="profile:first_name" content="Salih">
<meta property="profile:last_name" content="Yazıtaş">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/archivo-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/img/kralin-sozu-gate_view.webp" as="image" type="image/webp">
<link rel="stylesheet" href="/assets/css/fonts.css">
<link rel="stylesheet" href="/assets/css/site.css">
<script>
  // Boyamadan önce temayı uygula; JS varsa dergi okuyucusu açılır
  (function () {
    var d = document.documentElement, t = null;
    try { t = localStorage.getItem("theme"); } catch (e) {}
    if (t !== "light" && t !== "dark") t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    d.dataset.theme = t;
    d.classList.add("reader");
  })();
</script>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<a class="skip" href="#icindekiler">${T("skip")}</a>

<header class="topbar">
  <a class="mini-mast" href="#kapak" aria-label="${T("coverPage")}: Salih Yazıtaş" translate="no"><span lang="tr">YAZITAŞ</span></a>
  <nav class="topnav" aria-label="${T("navLabel")}">
    <ul>${navItems.map(([id, label]) => `<li><a href="#${id}" data-nav="${id}">${label}</a></li>`).join("")}</ul>
  </nav>
  <div class="tools">
    <a class="tool" href="${otherHome}" hreflang="${other}" lang="${other}" aria-label="${T("langSwitch")}">${T("langSwitchShort")}</a>
    <button type="button" class="tool" data-theme-toggle aria-label="${T("themeToggle")}">${icon("sun", "px only-dark")}${icon("moon", "px only-light")}</button>
  </div>
</header>

<main id="main" class="book" aria-label="${T("readerLabel")}" data-total="${total}">${html}
</main>

<nav class="pager" aria-label="${T("readerLabel")}">
  <button type="button" class="pager-btn" data-prev aria-label="${T("prevPage")}" aria-keyshortcuts="ArrowLeft">${icon("arrowL", "px")}</button>
  <label class="pager-jump"><span class="sr">${T("jumpTo")}</span>
    <select data-jump>${pages.map((pg, i) => `<option value="${i + 1}">${i + 1}. ${pg.label}</option>`).join("")}</select>
  </label>
  <button type="button" class="pager-btn" data-next aria-label="${T("nextPage")}" aria-keyshortcuts="ArrowRight">${icon("arrowR", "px")}</button>
  <p class="sr" aria-live="polite" data-status></p>
</nav>

<div class="toast" role="status" aria-live="polite" hidden></div>
<template id="icon-star">${icon("star")}</template>
<script id="i18n" type="application/json">${JSON.stringify({
    secretName: lang === "tr" ? "Hile kodu" : "Cheat code",
    secretHow: lang === "tr" ? "↑ ↑ ↓ ↓ ← → ← → B A tuşlarına bastın" : "You pressed ↑ ↑ ↓ ↓ ← → ← → B A",
    toastSecret: L(C.ui.toastSecret),
    page: L(C.ui.pageWord), of: L(C.ui.ofWord),
  })}</script>
<script src="/assets/js/site.js" defer></script>
</body>
</html>
`;
}

function notFound() {
  return `<!doctype html>
<html lang="tr" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 · Salih Yazıtaş</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/css/fonts.css">
<link rel="stylesheet" href="/assets/css/site.css">
<script>(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.dataset.theme=t;})();</script>
</head>
<body class="lost-body">
<main class="lost">
  <p class="lost-code">404</p>
  <h1 class="lost-title">Bu sayfa baskıdan çıkmamış</h1>
  <p class="lost-text">Aradığın sayfa bu sayıda yok. İçindekilere dönüp oradan devam edebilirsin.</p>
  <p class="lost-text" lang="en">This page didn't make it into the issue. Head back to the contents.</p>
  <p class="rv-links"><a class="btn btn--solid" href="/#icindekiler">İçindekilere dön</a> <a class="btn" href="/en/#icindekiler" lang="en">Contents (English)</a></p>
</main>
</body>
</html>
`;
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${["", "en/"].map((p) => `  <url>
    <loc>${C.links.site}${p}</loc>
    <lastmod>${BUILD}</lastmod>
    <xhtml:link rel="alternate" hreflang="tr" href="${C.links.site}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${C.links.site}en/"/>
  </url>`).join("\n")}
</urlset>
`;

fs.mkdirSync(path.join(ROOT, "en"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "index.html"), page("tr"));
fs.writeFileSync(path.join(ROOT, "en", "index.html"), page("en"));
fs.writeFileSync(path.join(ROOT, "404.html"), notFound());
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
console.log("Oluşturuldu: index.html, en/index.html, 404.html, sitemap.xml");
