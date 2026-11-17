// Statik site üretici. Bağımlılık yok.
// Kullanım: node src/build.js
//   index.html, en/index.html         → masa: üç sayının durduğu giriş
//   ben/, oyun/, yazilim/ (+ en/about/, en/games/, en/software/) → sayılar, sayfa çevirmeli okuyucu
//   404.html, sitemap.xml
// Görsel dil: bir oyun ve yazılım dergisinin üç sayısı (bkz. DESIGN.md)
const fs = require("fs");
const path = require("path");
const C = require("./content.js");
const { icon } = require("./icons.js");
const drawArt = require("./art.js");
// Projeler panelden düzenlenir: data/projects.json
const PROJECTS = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "projects.json"), "utf8")).projects;

const ROOT = path.join(__dirname, "..");
const BUILD = new Date().toISOString().slice(0, 10);
const SITE = C.links.site.replace(/\/$/, "");

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

// Adresler: TR kökte, EN /en/ altında
const home = (lang) => (lang === "tr" ? "/" : "/en/");
const issueOf = (key) => C.issues.find((i) => i.key === key);
const issueUrl = (lang, key) => `${home(lang)}${issueOf(key).slug[lang]}/`;
// Bir proje hangi sayıda: oyunlar Oyun'da, yazılımlar Yazılım'da
const issueForTrack = { game: "oyun", code: "yazilim" };

// Önce her sayının sayfa planı çıkar (başka sayılardaki sayfa numaraları için), sonra sayfalar dizilir
function site(lang) {
  const other = lang === "tr" ? "en" : "tr";
  // { tr, en } nesnesini ya da düz metni çöz
  const L = (v) => (v && typeof v === "object" && !Array.isArray(v) && ("tr" in v || "en" in v) ? v[lang] : v);
  const T = (k) => esc(L(C.ui[k]));
  const D = (k) => esc(L(C.desk[k]));
  const split = (s) => (s.includes("|") ? s.split("|")[lang === "tr" ? 0 : 1] : s);
  const art = drawArt(lang, esc);
  const cvHref = `/cv/Salih_Yazitas_CV_${lang === "tr" ? "TR" : "EN"}.pdf`;

  const ext = `<span class="sr">${T("externalHint")}</span>`;
  const extLink = (href, inner, cls = "") =>
    `<a${cls ? ` class="${cls}"` : ""} href="${esc(href)}" target="_blank" rel="noopener">${inner}${icon("ext", "px px--ext")}${ext}</a>`;
  // Tek parça uzun adlar (MyEverythingList) büyük harfte sütuna sığmaz: daha küçük dizilir
  const longWord = (t) => t.split(/\s+/).some((w) => w.length > 11);
  // Büyük harfe çevirmede "i" → "İ" yalnızca Türkçe adlarda olsun
  const titleLang = (t) => (/[çğıöşüÇĞİÖŞÜ]|Parsel/.test(t) ? "tr" : "en");

  const visible = PROJECTS.filter((p) => !p.hidden);

  // ---------- Küçük parçalar ----------

  // Görselin odak noktası (focus) ve sığdırma biçimi (fit: "contain") projects.json'dan gelir
  const img = (im, cls = "", eager = false) => {
    const c = [cls, im.fit === "contain" ? "is-contain" : ""].filter(Boolean).join(" ");
    return `<img${c ? ` class="${c}"` : ""} src="/assets/img/${esc(im.src)}" width="${im.w || 1200}" height="${im.h || 675}" alt="${esc(L(im.alt))}"${im.focus ? ` style="object-position:${esc(im.focus)}"` : ""}${eager ? "" : ' loading="lazy"'} decoding="async">`;
  };
  const media = (p) => (p.image ? img(p.image) : `<div class="rv-art">${art[p.art] || ""}</div>`);
  // İç harfi büyük adlar (MyEverythingList, NeRoBoT) kendi yazımıyla kalır, büyük harfe çevrilmez
  const keepCase = (t) => /[a-zçğıöşü][A-ZÇĞİÖŞÜ]/.test(t);
  const titleCls = (p, base) => `${base}${longWord(p.title) ? ` ${base}--long` : ""}${keepCase(p.title) ? ` ${base}--keep` : ""}`;
  const title = (p, tag, base, id) => {
    const sub = L(p.subtitle);
    return `<${tag} class="${titleCls(p, base)}"${id ? ` id="${id}"` : ""} translate="no" lang="${titleLang(p.title)}">${esc(p.title)}${sub ? `<span class="rv-sub" lang="${titleLang(sub)}">${esc(sub)}</span>` : ""}</${tag}>`;
  };
  // Gövde: öne çıkanlarda damla harf, diğerlerinde ilk sözcükler kalın (run-in)
  const body = (p, mode = "cap") => {
    const points = L(p.points) || [];
    if (!points.length) return "";
    const ps = points.map((x, i) => {
      if (mode === "runin" && i === 0) {
        const w = x.split(" ");
        return `<p><b class="runin">${esc(w.slice(0, 4).join(" "))}</b> ${esc(w.slice(4).join(" "))}</p>`;
      }
      return `<p>${esc(x)}</p>`;
    }).join("");
    const nocap = mode !== "cap" || /^[IİlJ1]/.test(points[0]) ? " rv-body--nocap" : "";
    return `<div class="rv-body${nocap}">${ps}</div>`;
  };
  const caption = (im, n) => im ? `<p class="fig">${lang === "tr" ? "Görsel" : "Fig."} ${n}. ${esc(L(im.alt))}</p>` : "";
  const quote = (p) => L(p.quote) ? `<blockquote class="pull"><p>${esc(L(p.quote))}</p>${L(p.quoteSource) ? `<cite>${esc(L(p.quoteSource))}</cite>` : ""}</blockquote>` : "";

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

  // ---------- Sayfa planı ----------
  // Her blok bir ya da birkaç sayfadır. "even": blok çift sayfadan (açılımın solundan) başlamalı.
  // Sayfa nesnesi: { id, cls, label, run, anchors, toc, render(ctx) }
  function plan(issue) {
    const key = issue.key;
    const run = `${D("issueWord")} ${issue.n} · ${esc(L(issue.name))}`;
    const blocks = [];
    const add = (b) => blocks.push(b);
    add({ even: true, pages: [
      { id: "icindekiler", cls: "page--contents sec--ink", label: T("tocTitle"), run, render: (x) => contentsPage(x) },
      { id: "editor", cls: `page--editor sec--${key === "yazilim" ? "code" : "game"}`, label: esc(L(issue.editor.title)), run, anchors: key === "ben" ? ["kunye"] : [], toc: { title: esc(L(issue.editor.title)) }, render: () => editorPage(issue) },
    ] });

    if (key === "ben") {
      add({ even: true, pages: [
        { id: "is", cls: "page--work sec--ink", label: lang === "tr" ? "Dosya: İş" : "File: Work", run, toc: { title: lang === "tr" ? "Dosya: İş" : "File: Work", sub: "Petra Cafe, Stoneograph, Volpen" }, render: (x) => workPage(C.work.slice(0, 1), true, x) },
        { id: "is-2", cls: "page--work sec--ink", label: lang === "tr" ? "Dosya: İş (2)" : "File: Work (2)", run, render: (x) => workPage(C.work.slice(1), false, x) },
      ] });
      add({ even: true, pages: [
        { id: "yolculuk", cls: "page--journey sec--ink", label: lang === "tr" ? "Okul ve topluluk" : "School and community", run, toc: { title: lang === "tr" ? "Okul ve topluluk" : "School and community", sub: lang === "tr" ? "ÇOMÜ, kulüp, jamler" : "ÇOMÜ, the club, jams" }, render: () => journeyPage(C.school) },
        { id: "rozetler", cls: "page--awards sec--game", label: T("awardsTitle"), run, toc: { title: T("awardsTitle"), sub: T("awardsDeck") }, render: () => awardsPage() },
      ] });
      add({ even: true, pages: [
        { id: "rehber", cls: "page--guide sec--code", label: T("guideTitle"), run, toc: { title: T("guideTitle") }, render: () => guidePage() },
        { id: "mektup", cls: "page--letters sec--game", label: T("lettersTitle"), run, toc: { title: T("lettersTitle"), sub: lang === "tr" ? "E-posta, CV ve okur kuponu" : "Email, CV and the reader coupon" }, render: () => lettersPage() },
      ] });
    } else {
      const track = key === "oyun" ? "game" : "code";
      const items = visible.filter((p) => p.track === track);
      const band = { id: key, title: esc(L(issue.name)), deck: T(track === "game" ? "secGameDeck" : "secCodeDeck") };
      const tocOf = (p) => ({ title: `<span translate="no" lang="${titleLang(p.title)}">${esc(p.title)}</span>`, sub: esc(L(p.kind)) });
      // Projenin ek sayfaları (nasıl oynanır, yapım notları)
      const extra = (p) => (p.pages || []).map((pg) => ({
        id: pg.id, cls: `page--notes sec--${track}`, label: `${esc(p.title)}: ${esc(L(pg.title))}`, run,
        toc: { title: esc(L(pg.title)), sub: `<span translate="no">${esc(p.title)}</span>`, sub2: true }, render: () => notesPage(p, pg),
      }));
      let bandUsed = false;
      items.filter((p) => p.tier === "featured").forEach((p) => {
        const lead = track === "code";
        const b = bandUsed ? null : band; bandUsed = true;
        add({ even: true, pages: [
          { id: p.id, cls: `page--${lead ? "lead-a" : "feature-a"} sec--${track}`, label: esc(p.title), run, anchors: b ? [key] : [], toc: { ...tocOf(p), cover: true }, render: () => (lead ? leadA(p, b) : featureA(p, b)) },
          { id: `${p.id}-2`, cls: `page--${lead ? "lead-b" : "feature-b"} sec--${track}`, label: `${esc(p.title)} (2)`, run, render: () => (lead ? leadB(p) : featureB(p)) },
        ] });
        if ((p.pages || []).length) add({ pages: extra(p) });
      });
      // Kartlar: her biri kendi sayfasında; "half" işaretliler ikişer ikişer aynı sayfada
      const cards = items.filter((p) => p.tier === "card");
      for (let i = 0; i < cards.length; i++) {
        const p = cards[i];
        if (p.half) {
          const pair = cards[i + 1] && cards[i + 1].half ? [p, cards[++i]] : [p];
          add({ pages: [{
            id: pair.map((q) => q.id).join("-ve-"), cls: `page--duo sec--${track}`, label: pair.map((q) => esc(q.title)).join(", "), run,
            anchors: pair.map((q) => q.id), toc: { title: pair.map((q) => `<span translate="no">${esc(q.title)}</span>`).join(lang === "tr" ? " ve " : " and "), sub: esc(L(pair[0].kind)) },
            render: () => duoPage(pair),
          }] });
        } else {
          const pages = [{ id: p.id, cls: `page--solo sec--${track}`, label: esc(p.title), run, toc: tocOf(p), render: () => soloPage(p) }].concat(extra(p));
          add({ even: pages.length > 1, pages });
        }
      }
      const briefs = items.filter((p) => p.tier === "compact");
      const briefsTitle = T(track === "game" ? "briefsGame" : "briefsCode");
      if (briefs.length) add({ pages: [{ id: `${key}-kisa`, cls: `page--briefs sec--${track}`, label: briefsTitle, run, anchors: briefs.map((p) => p.id), toc: { title: briefsTitle, briefs: briefs.map((p) => p.title) }, render: () => briefsPage(briefsTitle, briefs) }] });
      if (key === "oyun") add({ pages: [{ id: "topluluk", cls: "page--community sec--game", label: esc(L(C.community.title)), run, toc: { title: esc(L(C.community.title)), sub: lang === "tr" ? "Oyun Tasarımı Kulübü ve jamler" : "The Game Design Club and jams" }, render: (x) => communityPage(x) }] });
    }

    // Sayfalama: açılımlar çift sayfadan başlar, arka kapak çift numaralı (açılımın solu) kalır
    const pages = [{ id: "kapak", cls: `page--cover cover--${key}`, label: T("coverPage"), render: () => coverPage(issue), foot: false }];
    let adIndex = 0;
    const adPage = () => {
      const ad = C.ui.ads[adIndex++ % C.ui.ads.length];
      return { id: `reklam-${ad.id}`, cls: "page--ad", label: `${T("adWord")}: ${esc(L(ad.title))}`, run, render: () => adPageHtml(ad) };
    };
    for (const b of blocks) {
      if (b.even && (pages.length + 1) % 2 === 1) pages.push(adPage());
      pages.push(...b.pages);
    }
    if ((pages.length + 1) % 2 === 1) pages.push(adPage());
    pages.push({ id: "arka-kapak", cls: `page--back back--${key}`, label: T("backCover"), render: () => backPage(issue), foot: false });
    const pageOf = {};
    pages.forEach((p, i) => { pageOf[p.id] = i + 1; (p.anchors || []).forEach((x) => { pageOf[x] = i + 1; }); });
    return { issue, pages, pageOf };
  }

  const plans = Object.fromEntries(C.issues.map((i) => [i.key, plan(i)]));
  // Başka sayıdaki bir sayfaya bağlantı: aynı sayıdaysa yalnızca #id
  let current = null;
  const xref = (key, id) => (key === current ? `#${id}` : `${issueUrl(lang, key)}#${id}`);
  const pnIn = (key, id) => plans[key].pageOf[id];
  const pn = (id) => pnIn(current, id);
  const pageWord = lang === "tr" ? "s." : "p.";

  // ---------- Sayfa şablonları ----------

  // Kapak: masada da aynısı durur (static: bağlantısız, iç içe <a> olmasın)
  function coverPage(issue, isStatic = false) {
    const c = issue.cover;
    const A = (href, cls, inner, extra = "") => isStatic ? `<span class="${cls}">${inner}</span>` : `<a class="${cls}" href="${esc(href)}"${extra}>${inner}</a>`;
    const Mast = isStatic ? "p" : "h1";
    const sticker = c.sticker.cv
      ? A(cvHref, "sticker", `<span class="sticker-top">${esc(L(c.sticker.top))}</span><span class="sticker-main">${esc(L(c.sticker.main))}</span>`, " download")
      : /^https?:/.test(c.sticker.href)
        ? (isStatic ? A("", "sticker", `<span class="sticker-top">${esc(L(c.sticker.top))}</span><span class="sticker-main">${esc(L(c.sticker.main))}</span>`)
          : extLink(c.sticker.href, `<span class="sticker-top">${esc(L(c.sticker.top))}</span><span class="sticker-main">${esc(L(c.sticker.main))}</span>`, "sticker"))
        : A(c.sticker.href, "sticker", `<span class="sticker-top">${esc(L(c.sticker.top))}</span><span class="sticker-main">${esc(L(c.sticker.main))}</span>`);
    const art = {
      ben: `<span class="cover-photo"><img src="/assets/img/salih.webp" width="480" height="480" alt="${isStatic ? "" : T("photoAlt")}" fetchpriority="high"><span class="cover-tape" aria-hidden="true"></span><span class="cover-photo-cap" aria-hidden="true">Çanakkale, 2026</span></span>`,
      oyun: `<img class="cover-art" src="/assets/img/kralin-sozu-gate_view.webp" width="1200" height="675" alt="${isStatic ? "" : T("coverAlt")}" fetchpriority="high">`,
      yazilim: `<span class="cover-screen"><img src="/assets/img/myeverythinglist.webp" width="2000" height="1125" alt="${isStatic ? "" : esc(lang === "tr" ? "MyEverythingList'in ana sayfası" : "MyEverythingList's home page")}" fetchpriority="high"></span>`,
    }[issue.key];
    const storyHref = { ben: "#editor", oyun: "#kralin-sozu", yazilim: "#myeverythinglist" }[issue.key];
    return `
      ${art}
      <div class="cover-inner">
        <p class="cover-issue"><span>${D("issueWord")} ${issue.n}</span><span>${T("issueDate")}</span><span class="cover-issue-name">${esc(L(issue.name))}</span></p>
        <${Mast} class="masthead"><span class="masthead-word" lang="tr" translate="no" aria-hidden="true">YAZITAŞ</span><span class="cover-name"><span lang="tr">Salih Yazıtaş</span>, ${lang === "tr" ? "oyun ve yazılım geliştirici" : "game & software developer"}<span class="sr"> · ${D("issueWord")} ${issue.n}: ${esc(L(issue.name))}</span></span></${Mast}>
        ${A(storyHref, "cover-story", `<span class="cover-kicker">${esc(L(c.kicker))}</span><span class="cover-title"${issue.key === "yazilim" ? ' translate="no" lang="en"' : ""}>${esc(L(c.title))}</span><span class="cover-deck">${esc(L(c.deck))}</span>`)}
        <ul class="cover-lines">${c.lines.map((l) => `
          <li>${A(l.href, "cover-line", `<span class="cl-big">${esc(L(l.big))}</span><span class="cl-text">${esc(L(l.text))}</span>`)}</li>`).join("")}
        </ul>
        ${sticker}
        <div class="barcode" aria-hidden="true">${barcode(26 + issue.n)}<span>${D("issueWord")} ${issue.n}</span></div>
      </div>`;
  }

  // Masadaki diğer sayılar: içindekilerde ve arka kapakta
  function shelf(issue, cls) {
    return `<ul class="${cls}">${C.issues.filter((i) => i.key !== issue.key).map((i) => `
        <li><a class="shelf-card shelf--${i.key}" href="${issueUrl(lang, i.key)}"><span class="shelf-n">${D("issueWord")} ${i.n}</span><span class="shelf-name">${esc(L(i.name))}</span><span class="shelf-deck">${esc(L(i.deck))}</span></a></li>`).join("")}
      </ul>`;
  }

  function contentsPage(x) {
    const rows = x.pages.filter((pg) => pg.toc).map((pg) => {
      const t = pg.toc;
      const sub = t.briefs ? `<span class="toc-sub" translate="no">${t.briefs.map(esc).join(", ")}</span>` : t.sub ? `<span class="toc-sub">${t.sub}</span>` : "";
      return `
          <li${t.cover ? ' class="toc-cover-row"' : ""}><a href="#${pg.id}"><span class="toc-pg">${pn(pg.id)}</span><span class="toc-t">${t.cover ? `<span class="toc-k">${lang === "tr" ? "Kapak konusu" : "Cover story"}</span>` : ""}<span class="toc-name">${t.title}</span>${sub}</span></a></li>`;
    }).join("");
    return `
      <h2 class="toc-title">${T("tocTitle")}</h2>
      <ol class="toc-rows">${rows}
      </ol>
      <section class="toc-shelf" aria-labelledby="toc-shelf-h">
        <h3 class="toc-shelf-h" id="toc-shelf-h">${D("shelf")}</h3>
        ${shelf(x.issue, "shelf")}
      </section>`;
  }

  function editorPage(issue) {
    const e = issue.editor;
    const nums = e.numbers ? `
      <dl class="editor-nums">${e.numbers.map((n) => `<div><dt>${esc(L(n.k))}</dt><dd>${esc(L(n.v))}</dd></div>`).join("")}</dl>` : "";
    const ben = issue.key === "ben";
    return `
      <img class="editor-photo" src="/assets/img/salih.webp" width="480" height="480" alt="${T("photoAlt")}" loading="lazy" decoding="async">
      <h2 class="editor-title">${esc(L(e.title))}</h2>
      <div class="editor-text">${L(e.letter).map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      <p class="editor-sign">${T("editorSign")}</p>
      ${ben ? `<p class="editor-cv">
        <a class="btn btn--solid" href="${cvHref}" download>${icon("download")}<span>${T(lang === "tr" ? "cvTr" : "cvEn")}</span></a>
      </p>
      <section class="imprint-box" aria-labelledby="kunye-h">
        <h3 class="imprint-title" id="kunye-h">${T("imprintTitle")}</h3>
        <dl class="imprint">${C.ui.imprint.map((r) => `<div><dt>${esc(L(r.k))}</dt><dd>${esc(L(r.v))}</dd></div>`).join("")}</dl>
        <p class="imprint-hint">${T("footer")} ${T("footerHint")}</p>
      </section>` : nums}`;
  }

  // Bölüm bandı: sayının ilk proje sayfasının üstünde, sayının renginde
  const bandHtml = (b) => b ? `<header class="sec-band" id="${b.id}"><p class="sec-band-title">${b.title}</p><p class="sec-band-deck">${b.deck}</p></header>` : "";

  // Ekip, künye ve rakamlar: tek sayfalık proje ile ikili sayfada ortak
  const statsList = (p) => (p.stats || []).length ? `<ul class="duo-stats" aria-label="${T("numbersTitle")}">${p.stats.map((s) => `<li><b>${esc(L(s.v))}</b> ${esc(L(s.k))}</li>`).join("")}</ul>` : "";

  // İkili sayfa: iki proje aynı sayfada
  function duoPage(pair) {
    const half = (p) => `
      <article class="duo" id="${esc(p.id)}" aria-labelledby="${esc(p.id)}-h">
        <div class="rv-frame duo-frame">${media(p)}</div>
        <div class="duo-text">
          <h3 class="${titleCls(p, "rv-title")}" id="${esc(p.id)}-h" translate="no" lang="${titleLang(p.title)}">${esc(p.title)}</h3>
          <p class="duo-meta">${esc(L(p.kind))}${L(p.date) ? `, ${esc(L(p.date))}` : ""}${L(p.team) ? ` · ${esc(L(p.team))}` : ""}</p>
          <p class="rv-deck">${esc(L(p.pitch))}</p>
          ${body(p, "runin")}
          ${statsList(p)}
          <p class="duo-tech">${p.tech.map(esc).join(", ")}</p>
          ${actions(p)}
        </div>
      </article>`;
    return pair.map(half).join("");
  }

  // Tek sayfalık proje: görsel, başlık, metin ve yan sütunda künye
  function soloPage(p) {
    return `
      <p class="solo-kicker">${esc(L(p.kind))}${L(p.date) ? ` · ${esc(L(p.date))}` : ""}</p>
      ${title(p, "h2", "rv-title", `${esc(p.id)}-h`)}
      <p class="rv-deck">${esc(L(p.pitch))}</p>
      <figure class="rv-frame solo-frame">${media(p)}</figure>
      <div class="solo-cols">
        ${body(p, "runin")}
        <aside class="solo-side" aria-label="${T("specTitle")}: ${esc(p.title)}">
          ${statsList(p)}
          ${L(p.team) ? `<p class="solo-team">${esc(L(p.team))}</p>` : ""}
          <p class="duo-tech">${p.tech.map(esc).join(", ")}</p>
          ${actions(p)}
        </aside>
      </div>`;
  }

  // Ek sayfa: nasıl oynanır ya da yapım notları (projects.json → pages)
  function notesPage(p, pg) {
    const nums = (pg.numbers || []).length ? `
      <dl class="notes-nums">${pg.numbers.map((n) => `<div><dt>${esc(L(n.k))}</dt><dd>${esc(L(n.v))}</dd></div>`).join("")}</dl>` : "";
    const table = pg.table ? `
      <table class="notes-table">
        <caption>${esc(L(pg.table.title))}</caption>
        <tbody>${pg.table.rows.map((r) => `<tr><th scope="row">${esc(L(r[0]))}</th><td>${esc(L(r[1]))}</td></tr>`).join("")}</tbody>
      </table>` : "";
    const figs = (pg.images || []).length ? `
      <div class="notes-figs notes-figs--${pg.images.length}">${pg.images.map((im) => `<figure>${img(im)}<figcaption class="fig">${esc(L(im.alt))}</figcaption></figure>`).join("")}</div>` : "";
    const q = L(pg.quote) ? `<blockquote class="pull"><p>${esc(L(pg.quote))}</p><cite>Salih Yazıtaş</cite></blockquote>` : "";
    return `
      <p class="notes-kicker" translate="no" lang="${titleLang(p.title)}">${esc(p.title)}</p>
      <h2 class="feature-title">${esc(L(pg.title))}</h2>
      <p class="feature-deck">${esc(L(pg.deck))}</p>
      ${nums}
      <ol class="notes-list notes-list--${pg.type}">${pg.items.map((it) => `
        <li><h3 class="notes-h">${esc(L(it.h))}</h3><p>${esc(L(it.t))}</p></li>`).join("")}
      </ol>
      ${table}${q}${figs}`;
  }

  // Yayılım (oyun): sol sayfa tam görsel ve başlık, sağ sayfa metin ve künye
  function featureA(p, band) {
    return `
      ${bandHtml(band)}
      <figure class="fa-art">${media(p)}</figure>
      ${caption(p.image, 1)}
      <div class="fa-head">${title(p, "h2", "rv-title")}<p class="rv-deck">${esc(L(p.pitch))}</p></div>`;
  }
  // Sağ sayfa: oyunun kendi metninden alıntı, iki sütun metin, galeri, künye
  function featureB(p) {
    return `${quote(p)}${body(p)}
      ${p.gallery && p.gallery.length ? `<ul class="rv-gallery">${p.gallery.map((g) => `<li>${img({ ...g, w: g.w || 1200, h: g.h || 675 })}</li>`).join("")}</ul>` : ""}
      ${spec(p)}${actions(p)}`;
  }
  // Lead (yazılım): sol sayfa büyük başlık ve görsel, sağ sayfa metin ve künye
  function leadA(p, band) {
    return `${bandHtml(band)}${title(p, "h2", "rv-title")}<p class="rv-deck">${esc(L(p.pitch))}</p><figure class="rv-frame lead-frame">${media(p)}</figure>${caption(p.image, 1)}`;
  }
  function leadB(p) {
    return `${quote(p)}${body(p)}${spec(p)}${actions(p)}`;
  }

  function briefItem(p) {
    const sub = L(p.subtitle);
    return `
        <li class="brief" id="${esc(p.id)}">
          <div class="brief-frame">${media(p)}</div>
          <div class="brief-text">
            <h3 class="${titleCls(p, "brief-title")}" translate="no" lang="${titleLang(p.title)}">${esc(p.title)}</h3>
            ${sub ? `<p class="brief-sub" lang="${titleLang(sub)}">${esc(sub)}</p>` : ""}
            <p class="brief-meta">${esc(L(p.kind))}${L(p.date) ? `, ${esc(L(p.date))}` : ""}</p>
            <p class="brief-pitch">${esc(L(p.pitch))}</p>
            ${p.links.length ? `<p class="brief-links">${p.links.map((l) => extLink(l.href, esc(L(C.ui.links[l.label])))).join("")}</p>` : ""}
          </div>
        </li>`;
  }
  function briefsPage(briefsTitle, briefs) {
    return `
      <h2 class="briefs-title">${briefsTitle}</h2>
      <ul class="brief-list brief-list--${briefs.length > 4 ? "six" : "four"}">${briefs.map((p) => briefItem(p)).join("")}
      </ul>`;
  }

  // Ben: iş deneyimi. Her kaydın altında başka sayıdaki ilgili sayfaya bağlantı
  function workPage(list, first) {
    const job = (j) => {
      const l = j.link, target = l && visible.find((p) => p.id === l.id);
      const more = target ? `<p class="job-more"><a href="${xref(l.issue, l.id)}">${lang === "tr" ? `${esc(L(issueOf(l.issue).name))} sayısında` : `In the ${esc(L(issueOf(l.issue).name))} issue`}: <span translate="no">${esc(target.title)}</span>, ${pageWord} ${pnIn(l.issue, l.id)} →</a></p>` : "";
      return `
      <article class="job">
        <p class="job-date">${esc(L(j.date))}</p>
        <h3 class="job-title">${esc(L(j.title))}</h3>
        <p class="job-org">${esc(L(j.org))}</p>
        <ul class="job-list">${L(j.bullets).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        <p class="job-meta">${esc(L(j.meta))}</p>
        ${j.numbers ? `<dl class="editor-nums job-nums">${j.numbers.map((n) => `<div><dt>${esc(L(n.k))}</dt><dd>${esc(L(n.v))}</dd></div>`).join("")}</dl>` : ""}
        ${more}
      </article>`;
    };
    return `
      ${first ? `<h2 class="feature-title">${lang === "tr" ? "Dosya: İş" : "File: Work"}</h2><p class="feature-deck">${lang === "tr" ? "Serbest danışmanlık, staj ve kurduğum ekip. En yenisi en üstte." : "Freelance consulting, an internship and the studio I founded. Newest first."}</p>` : ""}
      ${list.map(job).join("")}`;
  }

  const statusIcon = { active: "flag", done: "check", locked: "lock" };
  function journeyPage(list) {
    const entry = (q) => {
      const goals = L(q.goals) || [];
      return `
        <li class="entry entry--${q.status}">
          <p class="entry-date">${esc(L(q.date)) || "&nbsp;"}<span class="entry-status">${icon(statusIcon[q.status])}${esc(L(C.ui.status[q.status]))}</span></p>
          <div class="entry-body">
            <h3 class="entry-title">${esc(L(q.title))}</h3>
            <p class="entry-org">${esc(L(q.org))}</p>
            ${goals.length ? `<p class="entry-goals">${goals.map((g) => esc(g)).join('<span class="entry-sep" aria-hidden="true"> · </span>')}</p>` : ""}
          </div>
        </li>`;
    };
    return `
      <h2 class="feature-title">${lang === "tr" ? "Okul ve topluluk" : "School and community"}</h2>
      <p class="feature-deck">${lang === "tr" ? "Okul, kulüp, jamler ve ilk işler. En yenisi en üstte." : "School, the club, jams and early roles. Newest first."}</p>
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
    const tile = (which) => `<a class="cv-tile" href="/cv/Salih_Yazitas_CV_${which}.pdf" download><span class="cv-tile-lang">${which}</span><span class="cv-tile-text">${T(which === "TR" ? "cvTr" : "cvEn")}</span>${icon("download", "px cv-tile-icon")}</a>`;
    const [user, domain] = C.links.email.split("@");
    return `
      <h2 class="feature-title">${T("lettersTitle")}</h2>
      <p class="feature-deck">${T("lettersDeck")}</p>
      <p class="mail"><a class="mail-link" href="mailto:${C.links.email}">${user}<wbr>@${domain}</a></p>
      <p class="letters-actions">
        <button type="button" class="btn" data-copy="${C.links.email}" data-ok="${T("copied")}" data-fail="${T("copyFailed")}">${icon("copy")}<span>${T("copyEmail")}</span></button>
      </p>
      <div class="cv-tiles">${tile(lang === "tr" ? "TR" : "EN")}${tile(lang === "tr" ? "EN" : "TR")}</div>
      <div class="coupon">
        <p class="coupon-h">${lang === "tr" ? "Okur kuponu: konunu seç, mektup hazır gelsin" : "Reader coupon: pick a subject, the letter starts itself"}</p>
        <ul class="coupon-list">${(lang === "tr"
          ? [["Staj teklifi", "Staj teklifi"], ["Ekip ya da jam", "Ekip / jam daveti"], ["Proje konuşalım", "Proje hakkında"]]
          : [["Internship offer", "Internship offer"], ["Team or jam", "Team / jam invite"], ["Let's talk projects", "About a project"]])
          .map(([label, subject]) => `<li><a href="mailto:${C.links.email}?subject=${encodeURIComponent(subject)}"><span class="coupon-box" aria-hidden="true"></span>${label}</a></li>`).join("")}</ul>
      </div>
      <ul class="socials">
        <li>${extLink(C.links.github, `${brand("github")}<span>GitHub</span>`)}</li>
        <li>${extLink(C.links.linkedin, `${brand("linkedin")}<span>LinkedIn</span>`)}</li>
        <li>${extLink(C.links.itch, `${brand("itchdotio")}<span>itch.io</span>`)}</li>
        <li>${extLink(C.links.volpen, `${icon("crown", "brand-icon")}<span>Volpen</span>`)}</li>
      </ul>`;
  }

  // Oyun: kulüp ve jamler
  function communityPage() {
    const c = C.community;
    return `
      <h2 class="feature-title">${esc(L(c.title))}</h2>
      <p class="feature-deck">${esc(L(c.deck))}</p>
      <ul class="crew">${c.entries.map((e) => {
        const target = e.link && visible.find((p) => p.id === e.link.id);
        return `
        <li class="crew-item">
          <p class="crew-big" aria-hidden="true">${esc(L(e.big))}</p>
          <h3 class="crew-title">${esc(L(e.title))}</h3>
          <p class="crew-role">${esc(L(e.role))}</p>
          <p class="crew-text">${esc(L(e.text))}</p>
          ${target ? `<p class="crew-more"><a href="${xref(e.link.issue, e.link.id)}"><span translate="no">${esc(target.title)}</span>, ${e.link.issue === current ? "" : `${esc(L(issueOf(e.link.issue).name))} · `}${pageWord} ${pnIn(e.link.issue, e.link.id)} →</a></p>` : ""}
        </li>`;
      }).join("")}
      </ul>`;
  }

  function adPageHtml(ad) {
    const cta = ad.cv
      ? `<a class="btn btn--ad" href="${cvHref}" download>${icon("download")}<span>${esc(L(ad.cta))}</span></a>`
      : extLink(ad.href, esc(L(ad.cta)), "btn btn--ad");
    return `
      <p class="ad-tag">${T("adWord")}</p>
      ${ad.image ? `<div class="ad-art"><img src="/assets/img/${ad.image}" width="1200" height="675" alt="" loading="lazy" decoding="async"></div>` : ""}
      <p class="ad-title" translate="no">${esc(L(ad.title))}</p>
      <p class="ad-line">${esc(L(ad.line))}</p>
      <p class="ad-small">${esc(L(ad.small))}</p>
      <p class="ad-cta">${cta}</p>`;
  }

  function backPage(issue) {
    const b = issue.back || {};
    const next = b.next ? L(b.next) : [];
    return `
      ${b.image ? `<div class="back-art"><img src="/assets/img/${b.image}" width="960" height="600" alt="" loading="lazy" decoding="async"></div>` : ""}
      ${b.image ? "" : `<p class="back-num" aria-hidden="true">${issue.n}</p>`}
      <p class="back-mast" lang="tr" translate="no">YAZITAŞ</p>
      ${next.length ? `<h2 class="back-title">${T("nextTitle")}</h2>
      <ul class="back-next">${next.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}
      <h2 class="back-shelf-h">${D("shelf")}</h2>
      ${shelf(issue, "shelf shelf--back")}
      <p class="back-line"><a class="back-desk" href="${home(lang)}" data-desk>${icon("arrowL", "px")}<span>${lang === "tr" ? "Masaya dön" : "Back to the desk"}</span></a></p>
      <div class="back-bottom">
        <p class="back-price">${T("price")}</p>
        <div class="barcode barcode--back" aria-hidden="true">${barcode(26 + issue.n)}<span>${D("issueWord")} ${issue.n} · ${T("issueDate")}</span></div>
      </div>`;
  }

  // ---------- Ortak baş: tema ve görünüm boyamadan önce ----------
  const headCommon = (title, description, url, alternates, ogImage, ogAlt) => `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="Salih Yazıtaş">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="tr" href="${alternates.tr}">
<link rel="alternate" hreflang="en" href="${alternates.en}">
<link rel="alternate" hreflang="x-default" href="${alternates.tr}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#d9d8d2" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0e0f11" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="Salih Yazıtaş">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${lang === "tr" ? "tr_TR" : "en_US"}">
<meta property="og:locale:alternate" content="${lang === "tr" ? "en_US" : "tr_TR"}">
<meta property="og:image" content="${SITE}/assets/og/${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(ogAlt)}">
<meta property="profile:first_name" content="Salih">
<meta property="profile:last_name" content="Yazıtaş">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/archivo-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/fonts.css">
<link rel="stylesheet" href="/assets/css/site.css">
<script>
  // Boyamadan önce temayı ve görünümü uygula (okuyucu ve masa aynı eşiği kullanır)
  (function () {
    var d = document.documentElement, t = null;
    try { t = localStorage.getItem("theme"); } catch (e) {}
    if (t !== "light" && t !== "dark") t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    d.dataset.theme = t;
    d.classList.add("reader", innerWidth < 720 || innerHeight < 512 ? "app" : "print");
  })();
</script>`;

  const coverImage = { ben: "salih.webp", oyun: "kralin-sozu-gate_view.webp", yazilim: "myeverythinglist.webp" };

  // ---------- Sayı: sayfa çevirmeli okuyucu ----------
  function issueHtml(key) {
    current = key;
    const x = plans[key], issue = x.issue, pages = x.pages, total = pages.length;
    const url = SITE + issueUrl(lang, key);
    const html = pages.map((pg, i) => {
      const n = i + 1;
      const side = n % 2 === 0 ? "left" : "right";
      const foot = pg.foot === false ? "" : `
    <footer class="page-foot" aria-hidden="true"><span class="page-run"><span translate="no">YAZITAŞ</span> · ${pg.run || T("issueDate")}</span><span class="page-no">${n}</span></footer>`;
      return `
  <section class="page ${pg.cls} page--${side}" id="${pg.id}" data-page="${n}" role="group" aria-roledescription="${lang === "tr" ? "sayfa" : "page"}" aria-label="${pg.label}, ${n} ${T("ofWord")} ${total}">
    <div class="page-inner">${pg.render(x)}</div>${foot}
  </section>`;
    }).join("");

    return `<!doctype html>
<html lang="${lang}" data-theme="light" data-issue="${key}">
<head>
${headCommon(L(issue.meta.title), L(issue.meta.description), url, { tr: SITE + issueUrl("tr", key), en: SITE + issueUrl("en", key) }, `og-${key}-${lang}.jpg`, `${lang === "tr" ? "YAZITAŞ dergisinin" : "YAZITAŞ magazine,"} ${D("issueWord")} ${issue.n}: ${L(issue.name)}`)}
<link rel="preload" href="/assets/img/${coverImage[key]}" as="image" type="image/webp">
</head>
<body>
<a class="skip" href="#icindekiler">${T("skip")}</a>

<header class="topbar">
  <a class="desk-link" href="${home(lang)}" data-desk aria-label="${D("backLabel")}">${icon("arrowL", "px")}<span>${D("back")}</span></a>
  <nav class="topnav issues-nav" aria-label="${lang === "tr" ? "Sayılar" : "Issues"}">
    <ul>${C.issues.map((i) => `<li><a href="${issueUrl(lang, i.key)}"${i.key === key ? ' aria-current="page"' : ""}><span class="in-n" aria-hidden="true">${i.n}</span><span class="in-name">${esc(L(i.name))}</span></a></li>`).join("")}</ul>
  </nav>
  <nav class="pager" aria-label="${T("readerLabel")}">
    <button type="button" class="pager-btn" data-prev aria-label="${T("prevPage")}" aria-keyshortcuts="ArrowLeft">${icon("arrowL", "px")}</button>
    <label class="pager-jump"><span class="sr">${T("jumpTo")}</span>
      <select data-jump>${pages.map((pg, i) => `<option value="${i + 1}">${i + 1}. ${pg.label}</option>`).join("")}</select>
    </label>
    <button type="button" class="pager-btn" data-next aria-label="${T("nextPage")}" aria-keyshortcuts="ArrowRight">${icon("arrowR", "px")}</button>
    <p class="sr" aria-live="polite" data-status></p>
  </nav>
  <div class="tools">
    <a class="tool" href="${issueUrl(other, key)}" hreflang="${other}" lang="${other}" aria-label="${T("langSwitch")}">${T("langSwitchShort")}</a>
    <button type="button" class="tool" data-theme-toggle aria-label="${T("themeToggle")}">${icon("sun", "px only-dark")}${icon("moon", "px only-light")}</button>
  </div>
</header>

<main id="main" class="book" aria-label="${T("readerLabel")}" data-total="${total}"><div class="world">${html}
</div></main>

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

  // ---------- Masa: üç sayı masada durur, tıklanan sayıya kamera yaklaşır ----------
  function deskHtml() {
    current = null;
    const url = SITE + home(lang);
    const jsonld = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Salih Yazıtaş",
      url,
      image: SITE + "/assets/img/salih.webp",
      jobTitle: lang === "tr" ? "Oyun ve yazılım geliştirici" : "Game & software developer",
      email: "mailto:" + C.links.email,
      address: { "@type": "PostalAddress", addressLocality: "Çanakkale", addressCountry: "TR" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Çanakkale Onsekiz Mart Üniversitesi" },
      founder: { "@type": "Organization", name: "Volpen", url: C.links.volpen },
      sameAs: [C.links.github, C.links.linkedin, C.links.itch],
      knowsAbout: ["Unity", "C#", "TypeScript", "React", "Python", "FastAPI", "Supabase", "Electron", "Tauri", "Go"],
    };
    // Eski tek dergi adresleri (#kralin-sozu, #mektup...) ilgili sayıya yönlenir
    const legacy = {};
    for (const i of C.issues) for (const id of Object.keys(plans[i.key].pageOf)) if (!(id in legacy) && !["kapak", "arka-kapak", "icindekiler", "editor"].includes(id)) legacy[id] = issueUrl(lang, i.key);
    legacy.icindekiler = issueUrl(lang, "ben"); legacy.editor = issueUrl(lang, "ben"); legacy.kunye = issueUrl(lang, "ben");
    legacy.oyun = issueUrl(lang, "oyun"); legacy.yazilim = issueUrl(lang, "yazilim");
    // Başlangıç yerleşimi (JS kapalıyken de masa dağınık dursun; JS ekrana göre yeniden hesaplar)
    const spots = [{ x: -330, y: 20, r: -7 }, { x: 0, y: -28, r: 2.5 }, { x: 330, y: 28, r: 8 }];
    const mags = C.issues.map((i, n) => `
        <li class="slot" data-i="${n}" style="--x:${spots[n].x}px;--y:${spots[n].y}px;--r:${spots[n].r}deg">
          <div class="thing shade"></div>
          <a class="thing mag" href="${issueUrl(lang, i.key)}" data-issue="${i.key}">
            <span class="edge edge--r" aria-hidden="true"></span><span class="edge edge--b" aria-hidden="true"></span>
            <span class="sr">${D("issueWord")} ${i.n}, ${esc(L(i.name))}: ${esc(L(i.deck))}</span>
            <div class="page page--cover cover--${i.key}" aria-hidden="true"><div class="page-inner">${coverPage(i, true)}</div></div>
          </a>
        </li>`).join("");

    return `<!doctype html>
<html lang="${lang}" data-theme="light" class="is-desk">
<head>
${headCommon(L(C.meta.title), L(C.meta.description), url, { tr: SITE + "/", en: SITE + "/en/" }, `og-${lang}.jpg`, lang === "tr" ? "Ahşap bir masada YAZITAŞ dergisinin üç sayısı: Ben, Oyun ve Yazılım" : "Three issues of YAZITAŞ magazine on a wooden desk: About me, Games and Software")}
<link rel="stylesheet" href="/assets/css/desk.css">
<script type="speculationrules">${JSON.stringify({ prerender: [{ source: "document", where: { selector_matches: ".mag" }, eagerness: "moderate" }] })}</script>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body class="desk-body">
<main class="scene" id="scene">
  <h1 class="sr">${D("heading")}</h1>
  <div class="viewport" id="viewport">
    <div class="camera" id="camera">
      <div class="desk">
        <div class="thing mug" data-prop="mug" aria-hidden="true"><div class="mug-floor"></div><div class="mug-body"></div><div class="mug-top"></div></div>
        <div class="thing pencil" data-prop="pencil" aria-hidden="true"></div>
        <div class="thing note" data-prop="note" aria-hidden="true">${D("note")}<small>${D("noteSmall")}</small></div>
        <a class="thing cv-sheet" data-prop="cv" href="${cvHref}" download aria-label="${D("cvLabel")}">
          <span class="cv-sheet-h">Salih Yazıtaş</span><span class="cv-sheet-k">${D("cv")}</span>
          <span class="cv-sheet-lines" aria-hidden="true"></span><span class="cv-sheet-tag">PDF ${icon("download", "px")}</span>
        </a>
        <ul class="mags" aria-label="${lang === "tr" ? "Sayılar" : "Issues"}">${mags}
        </ul>
      </div>
    </div>
  </div>
  <div class="light" aria-hidden="true"></div>
  <div class="dim" id="dim" aria-hidden="true"></div>
  <p class="hint" aria-hidden="true"><span class="only-hover">${D("hint")}</span><span class="only-touch">${D("hintTouch")}</span></p>
  <a class="desk-lang" href="${home(other)}" hreflang="${other}" lang="${other}" aria-label="${T("langSwitch")}">${T("langSwitchShort")}</a>
</main>
<script id="desk-data" type="application/json">${JSON.stringify({ legacy })}</script>
<script src="/assets/js/desk.js"></script>
</body>
</html>
`;
  }

  return { issueHtml, deskHtml, plans };
}

function notFound() {
  const links = C.issues.map((i) => `<a class="btn" href="${issueUrl("tr", i.key)}">Sayı ${i.n}: ${L2(i.name, "tr")}</a>`).join(" ");
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
  <p class="lost-text">Aradığın sayfa masadaki sayıların hiçbirinde yok. Masaya dönüp oradan devam edebilirsin.</p>
  <p class="lost-text" lang="en">This page didn't make it into any issue. Head back to the desk.</p>
  <p class="rv-links"><a class="btn btn--solid" href="/">Masaya dön</a> <a class="btn" href="/en/" lang="en">The desk (English)</a></p>
  <p class="rv-links">${links}</p>
</main>
</body>
</html>
`;
}
const L2 = (v, lang) => (v && typeof v === "object" ? v[lang] : v);

// ---------- Yaz ----------
const urls = [];
for (const lang of ["tr", "en"]) {
  const s = site(lang);
  const dir = path.join(ROOT, lang === "tr" ? "" : "en");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), s.deskHtml());
  for (const i of C.issues) {
    const d = path.join(ROOT, issueUrl(lang, i.key));
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, "index.html"), s.issueHtml(i.key));
    console.log(`${issueUrl(lang, i.key)}: ${s.plans[i.key].pages.length} sayfa`);
  }
}
for (const key of [null, ...C.issues.map((i) => i.key)]) {
  const tr = key ? issueUrl("tr", key) : "/", en = key ? issueUrl("en", key) : "/en/";
  urls.push({ tr, en });
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.flatMap((u) => [u.tr, u.en].map((loc) => `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${BUILD}</lastmod>
    <xhtml:link rel="alternate" hreflang="tr" href="${SITE}${u.tr}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${u.en}"/>
  </url>`)).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "404.html"), notFound());
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
console.log("Oluşturuldu: masa (index.html, en/index.html), 3 sayı × 2 dil, 404.html, sitemap.xml");
