// Statik site üretici. Bağımlılık yok.
// Kullanım: node src/build.js  →  index.html (TR), en/index.html (EN), 404.html, sitemap.xml
// Görsel dil: bir oyun ve yazılım dergisinin sayısı (bkz. DESIGN.md)
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
  // Büyük harfe çevirmede "i" → "İ" yalnızca Türkçe adlarda olsun
  // Tek parça uzun adlar (MyEverythingList) büyük harfte sütuna sığmaz: daha küçük dizilir
  const longWord = (t) => t.split(/\s+/).some((w) => w.length > 11);
  const titleLang = (t) => (/[çğıöşüÇĞİÖŞÜ]|Parsel/.test(t) ? "tr" : "en");

  const visible = PROJECTS.filter((p) => !p.hidden);
  const games = visible.filter((p) => p.track === "game");
  const code = visible.filter((p) => p.track === "code");

  // Sayfa düzeni: öne çıkanlar yayılır, uzun incelemeler tam satır (görsel sırayla sağa-sola),
  // kısa olanlar ikişer yan yana. Böylece ardışık sayfalar aynı kalıbı tekrar etmez.
  const bodyLength = (p) => (L(p.points) || []).join(" ").length;
  const layoutOf = (p, sectionIndex) => {
    if (p.tier === "featured") return sectionIndex % 2 === 0 ? "feature" : "lead";
    return bodyLength(p) > 210 ? "row" : "pair";
  };


  // Bir bölümün incelemelerini görünen sırayla dizer: ikili sayfalar yan yana gelir, tek kalan
  // ikili tam satıra çıkar. İçindekiler, sayfa numaraları ve sayfa aynı sırayı kullanır.
  const arrange = (items, sectionIndex) => {
    const full = items.filter((p) => p.tier !== "compact");
    const layouts = full.map((p) => layoutOf(p, sectionIndex));
    const pairs = layouts.map((l, i) => (l === "pair" ? i : -1)).filter((i) => i >= 0);
    if (pairs.length % 2 === 1) {
      const longest = pairs.reduce((a, b) => (bodyLength(full[b]) > bodyLength(full[a]) ? b : a));
      layouts[longest] = "row";
    }
    const out = [];
    let pending = null, rows = 0;
    full.forEach((p, i) => {
      const layout = layouts[i];
      if (layout === "pair") {
        if (pending) { out.push(pending, { p, layout }); pending = null; } else pending = { p, layout };
        return;
      }
      out.push({ p, layout, flip: layout === "row" && rows++ % 2 === 1 });
    });
    if (pending) out.push(pending);
    return out;
  };

  // ---------- Sayfa numaraları (dergi kurgusu: içindekiler bunlara bağlanır) ----------
  const folio = {};
  let pageNo = 4;
  const paginate = (items, sectionId, sectionIndex) => {
    folio[sectionId] = pageNo; pageNo += 1;
    arrange(items, sectionIndex).forEach(({ p }) => { folio[p.id] = pageNo; pageNo += p.tier === "featured" ? 2 : 1; });
    if (items.some((p) => p.tier === "compact")) { folio[sectionId + "-kisa"] = pageNo; pageNo += 1; }
  };
  paginate(games, "oyun", 0);
  paginate(code, "yazilim", 1);
  for (const id of ["yolculuk", "rozetler", "rehber", "mektup"]) { folio[id] = pageNo; pageNo += 2; }
  const pg = (id) => `${T("page")} ${folio[id]}`;

  // ---------- Parçalar ----------

  const img = (im, cls = "") =>
    `<img${cls ? ` class="${cls}"` : ""} src="/assets/img/${esc(im.src)}" width="${im.w}" height="${im.h}" alt="${esc(L(im.alt))}" loading="lazy" decoding="async">`;

  const media = (p) => p.image ? img(p.image) : `<div class="rv-art">${art[p.art] || ""}</div>`;

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

  const review = (p, layout, flip) => {
    const sub = L(p.subtitle);
    const points = L(p.points) || [];
    const feature = layout === "feature" || layout === "lead";
    const gallery = feature && p.gallery && p.gallery.length ? `
          <ul class="rv-gallery">${p.gallery.map((g) => `<li>${img({ ...g, w: g.w || 1200, h: g.h || 675 })}</li>`).join("")}</ul>` : "";
    const cls = ["review", `review--${layout}`, flip ? "review--flip" : "", p.image ? "" : "review--art", feature ? "review--feature" : ""].filter(Boolean).join(" ");
    return `
      <article class="${cls}" id="${esc(p.id)}" aria-labelledby="${esc(p.id)}-h">
        <div class="rv-media">
          <div class="rv-frame">${media(p)}</div>${gallery}
        </div>
        <div class="rv-text">
          <h3 translate="no" class="rv-title${longWord(p.title) ? " rv-title--long" : ""}" id="${esc(p.id)}-h" lang="${titleLang(p.title)}">${esc(p.title)}${sub ? `<span class="rv-sub" lang="${titleLang(sub)}">${esc(sub)}</span>` : ""}</h3>
          <p class="rv-deck">${esc(L(p.pitch))}</p>
          ${points.length ? `<div class="rv-body${bodyLength(p) > 260 ? " rv-body--cols" : ""}${/^[IİlJ1]/.test(points[0]) ? " rv-body--nocap" : ""}">${points.map((x) => `<p>${esc(x)}</p>`).join("")}</div>` : ""}
          ${spec(p)}
          ${actions(p)}
        </div>
        <p class="folio rv-folio" aria-hidden="true">${pg(p.id)}</p>
      </article>`;
  };

  const brief = (p) => {
    const sub = L(p.subtitle);
    return `
          <li class="brief" id="${esc(p.id)}">
            <div class="brief-frame">${media(p)}</div>
            <div class="brief-text">
              <h4 class="brief-title${longWord(p.title) ? " brief-title--long" : ""}" translate="no" lang="${titleLang(p.title)}">${esc(p.title)}</h4>
              ${sub ? `<p class="brief-sub" lang="${titleLang(sub)}">${esc(sub)}</p>` : ""}
              <p class="brief-meta">${esc(L(p.kind))}${L(p.date) ? `, ${esc(L(p.date))}` : ""}</p>
              <p class="brief-pitch">${esc(L(p.pitch))}</p>
              <p class="brief-tech">${p.tech.map(esc).join(", ")}</p>
              ${p.links.length ? `<p class="brief-links">${p.links.map((l) => extLink(l.href, esc(L(C.ui.links[l.label])))).join("")}</p>` : ""}
            </div>
          </li>`;
  };

  const section = (id, cls, title, deck, items, briefsTitle, sectionIndex) => {
    const full = items.filter((p) => p.tier !== "compact");
    const reviews = arrange(items, sectionIndex).map(({ p, layout, flip }) => review(p, layout, flip)).join("");
    const briefs = items.filter((p) => p.tier === "compact");
    return `
  <section class="section ${cls}" id="${id}" aria-labelledby="${id}-h">
    <span class="thumb-tab" aria-hidden="true">${title}</span>
    <header class="opener">
      <div class="wrap opener-inner">
        <h2 class="opener-title" id="${id}-h">${title}</h2>
        <p class="opener-deck">${deck}</p>
        <p class="folio folio--light" aria-hidden="true">${pg(id)}</p>
      </div>
    </header>
    <div class="wrap">
      <div class="reviews">${reviews}
      </div>
      ${briefs.length ? `
      <section class="briefs" aria-labelledby="${id}-kisa-h">
        <h3 class="briefs-title" id="${id}-kisa-h">${briefsTitle}<span class="folio" aria-hidden="true">${pg(id + "-kisa")}</span></h3>
        <ul class="brief-list">${briefs.map(brief).join("")}
        </ul>
      </section>` : ""}
    </div>
  </section>`;
  };

  const statusIcon = { active: "flag", done: "check", locked: "lock" };
  const entry = (q) => {
    if (q.status === "locked") {
      return `
        <li class="entry entry--locked">
          <p class="entry-date">${esc(L(C.ui.status.locked))}</p>
          <div class="entry-body"><h3 class="entry-title">${T("lockedTitle")}</h3><p class="entry-org">${T("lockedText")}</p></div>
        </li>`;
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

  const seal = (a) => `
        <li class="seal">
          <span class="seal-disc">${icon(a.icon)}</span>
          <span class="seal-name">${esc(L(a.name))}</span>
          <span class="seal-how">${esc(L(a.how))}</span>
        </li>`;

  const tocGroup = (title, sid, items, sectionIndex) => `
          <li class="toc-group">
            <a class="toc-sec" href="#${sid}"><span>${title}</span><span class="toc-pg">${folio[sid]}</span></a>
            <ul>${arrange(items, sectionIndex).map(({ p }) => `
              <li><a href="#${esc(p.id)}"><span lang="${titleLang(p.title)}">${esc(p.title)}</span><span class="toc-pg">${folio[p.id]}</span></a></li>`).join("")}
              ${items.some((p) => p.tier === "compact") ? `<li><a href="#${sid}-kisa-h"><span>${lang === "tr" ? "Kısa kısa" : "In brief"}</span><span class="toc-pg">${folio[sid + "-kisa"]}</span></a></li>` : ""}
            </ul>
          </li>`;

  const cvLink = (which, cls) => `<a class="${cls}" href="/cv/Salih_Yazitas_CV_${which}.pdf" download>${icon("download")}<span>${T(which === "TR" ? "cvTr" : "cvEn")}</span></a>`;
  const cvFirst = lang === "tr" ? "TR" : "EN";
  const cvSecond = lang === "tr" ? "EN" : "TR";

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
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(L(C.meta.title))}</title>
<meta name="description" content="${esc(L(C.meta.description))}">
<meta name="author" content="Salih Yazıtaş">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="tr" href="${C.links.site}">
<link rel="alternate" hreflang="en" href="${C.links.site}en/">
<link rel="alternate" hreflang="x-default" href="${C.links.site}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#fbfbf9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#16171a" media="(prefers-color-scheme: dark)">
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
  // Boyamadan önce temayı uygula (yanıp sönme olmasın)
  (function () {
    var d = document.documentElement, t = null;
    try { t = localStorage.getItem("theme"); } catch (e) {}
    if (t !== "light" && t !== "dark") t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    d.dataset.theme = t;
  })();
</script>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<a class="skip" href="#main">${T("skip")}</a>

<header class="topbar">
  <div class="wrap topbar-inner">
    <a class="mini-mast" href="${home}" aria-label="Salih Yazıtaş" translate="no"><span lang="tr">YAZITAŞ</span></a>
    <nav class="topnav" aria-label="${T("navLabel")}">
      <ul>${navItems.map(([id, label]) => `<li><a href="#${id}" data-nav="${id}">${label}</a></li>`).join("")}</ul>
    </nav>
    <div class="tools">
      <a class="tool" href="${otherHome}" hreflang="${other}" lang="${other}" aria-label="${T("langSwitch")}">${T("langSwitchShort")}</a>
      <button type="button" class="tool" data-theme-toggle aria-label="${T("themeToggle")}">${icon("sun", "px only-dark")}${icon("moon", "px only-light")}</button>
    </div>
  </div>
</header>

<main id="main">

  <section class="cover" aria-labelledby="cover-h">
    <img class="cover-art" src="/assets/img/kralin-sozu-gate_view.webp" width="1200" height="675" alt="${T("coverAlt")}" fetchpriority="high">
    <div class="wrap cover-inner">
      <p class="cover-issue"><span>${T("issue")}</span><span>${T("issueDate")}</span><span>${T("issueTag")}</span></p>
      <h1 class="masthead" id="cover-h"><span class="masthead-word" lang="tr" translate="no" aria-hidden="true">YAZITAŞ</span><span class="cover-name"><span lang="tr">Salih Yazıtaş</span>, ${lang === "tr" ? "oyun ve yazılım geliştirici" : "game & software developer"}</span></h1>

      <a class="cover-story" href="#kralin-sozu">
        <span class="cover-title">${T("coverTitle")}</span>
        <span class="cover-deck">${T("coverDeck")}</span>
      </a>

      <ul class="cover-lines">${C.coverLines.map((c) => `
        <li><a href="${c.href}"><span class="cl-big">${esc(L(c.big))}</span><span class="cl-text">${esc(L(c.text))}</span></a></li>`).join("")}
      </ul>

      <a class="sticker" href="/cv/Salih_Yazitas_CV_${cvFirst}.pdf" download><span class="sticker-top">${T("stickerTop")}</span><span class="sticker-main">${T("stickerMain")}</span></a>

      <div class="barcode" aria-hidden="true">${barcode(26)}<span>${T("issue")}</span></div>
    </div>
  </section>

  <section class="contents" id="icindekiler" aria-labelledby="icindekiler-h">
    <div class="wrap contents-grid">
      <div class="toc">
        <h2 class="toc-title" id="icindekiler-h">${T("tocTitle")}<span class="folio" aria-hidden="true">${T("page")} 2</span></h2>
        <ol class="toc-list">
          ${tocGroup(T("secGame"), "oyun", games, 0)}
          ${tocGroup(T("secCode"), "yazilim", code, 1)}
          <li class="toc-group toc-group--misc"><ul>
            <li><a href="#yolculuk"><span>${T("journeyTitle")}</span><span class="toc-pg">${folio.yolculuk}</span></a></li>
            <li><a href="#rozetler"><span>${T("awardsTitle")}</span><span class="toc-pg">${folio.rozetler}</span></a></li>
            <li><a href="#rehber"><span>${T("guideTitle")}</span><span class="toc-pg">${folio.rehber}</span></a></li>
            <li><a href="#mektup"><span>${T("lettersTitle")}</span><span class="toc-pg">${folio.mektup}</span></a></li>
          </ul></li>
        </ol>
      </div>
      <aside class="editor" aria-labelledby="editor-h">
        <img class="editor-photo" src="/assets/img/salih.webp" width="480" height="480" alt="${T("photoAlt")}" loading="lazy" decoding="async">
        <h2 class="editor-title" id="editor-h">${T("editorTitle")}</h2>
        ${L(C.ui.editorLetter).map((p) => `<p>${esc(p)}</p>`).join("\n        ")}
        <p class="editor-sign">${T("editorSign")}</p>
      </aside>
    </div>
  </section>

  ${section("oyun", "section--game", T("secGame"), T("secGameDeck"), games, T("briefsGame"), 0)}

  ${section("yazilim", "section--code", T("secCode"), T("secCodeDeck"), code, T("briefsCode"), 1)}

  <section class="section section--journey" id="yolculuk" aria-labelledby="yolculuk-h">
    <span class="thumb-tab" aria-hidden="true">${lang === "tr" ? "Dosya" : "Feature"}</span>
    <div class="wrap">
      <header class="feature-head">
        <h2 class="feature-title" id="yolculuk-h">${T("journeyTitle")}</h2>
        <p class="feature-deck">${T("journeyDeck")}</p>
        <p class="folio" aria-hidden="true">${pg("yolculuk")}</p>
      </header>
      <ol class="timeline">${C.quests.map(entry).join("")}
      </ol>
    </div>
  </section>

  <section class="section section--awards" id="rozetler" aria-labelledby="rozetler-h">
    <span class="thumb-tab" aria-hidden="true">${T("awardsTitle")}</span>
    <div class="wrap">
      <header class="feature-head">
        <h2 class="feature-title" id="rozetler-h">${T("awardsTitle")}</h2>
        <p class="feature-deck">${T("awardsDeck")}</p>
        <p class="folio" aria-hidden="true">${pg("rozetler")}</p>
      </header>
      <ul class="seals">${C.achievements.map(seal).join("")}
        <li class="seal seal--locked" id="secret-badge">
          <span class="seal-disc">${icon("lock")}</span>
          <span class="seal-name">${T("secretName")}</span>
          <span class="seal-how">${T("secretHint")}</span>
        </li>
      </ul>
    </div>
  </section>

  <section class="section section--guide" id="rehber" aria-labelledby="rehber-h">
    <span class="thumb-tab" aria-hidden="true">${lang === "tr" ? "Rehber" : "Guide"}</span>
    <div class="wrap">
      <header class="feature-head">
        <h2 class="feature-title" id="rehber-h">${T("guideTitle")}</h2>
        <p class="feature-deck">${T("guideDeck")}</p>
        <p class="folio" aria-hidden="true">${pg("rehber")}</p>
      </header>
      <div class="table-scroll" role="region" aria-labelledby="rehber-h" tabindex="0">
        <table class="guide">
          <thead><tr><th scope="col">${T("guideCat")}</th><th scope="col">${T("guideTools")}</th><th scope="col">${T("guideUsed")}</th></tr></thead>
          <tbody>
            <tr><th scope="row">${T("guideLangs")}</th><td data-label="${T("guideTools")}">${C.languages.map(esc).join(", ")}</td><td data-label="${T("guideUsed")}">${lang === "tr" ? "Bütün projeler" : "Every project"}</td></tr>
            ${C.skills.map((s) => `<tr><th scope="row">${esc(L(s.branch))}</th><td data-label="${T("guideTools")}">${s.items.map((i) => esc(split(i))).join(", ")}</td><td data-label="${T("guideUsed")}">${esc(L(s.used))}</td></tr>`).join("\n            ")}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="section section--letters" id="mektup" aria-labelledby="mektup-h">
    <span class="thumb-tab" aria-hidden="true">${lang === "tr" ? "Mektup" : "Letters"}</span>
    <div class="wrap letters-grid">
      <div class="letters-main">
        <h2 class="feature-title" id="mektup-h">${T("lettersTitle")}<span class="folio" aria-hidden="true">${pg("mektup")}</span></h2>
        <p class="feature-deck">${T("lettersDeck")}</p>
        <p class="mail"><a class="mail-link" href="mailto:${C.links.email}">${C.links.email}</a></p>
        <p class="letters-actions">
          <button type="button" class="btn" data-copy="${C.links.email}" data-ok="${T("copied")}" data-fail="${T("copyFailed")}">${icon("copy")}<span>${T("copyEmail")}</span></button>
          ${cvLink(cvFirst, "btn btn--solid")}
          ${cvLink(cvSecond, "btn")}
        </p>
        <ul class="socials">
          <li>${extLink(C.links.github, `${brand("github")}<span>GitHub</span>`)}</li>
          <li>${extLink(C.links.linkedin, `${brand("linkedin")}<span>LinkedIn</span>`)}</li>
          <li>${extLink(C.links.itch, `${brand("itchdotio")}<span>itch.io</span>`)}</li>
          <li>${extLink(C.links.volpen, `${icon("crown", "brand-icon")}<span>Volpen</span>`)}</li>
        </ul>
      </div>
      <aside class="imprint" aria-labelledby="imprint-h">
        <h2 class="imprint-title" id="imprint-h">${T("imprintTitle")}</h2>
        <dl>${C.ui.imprint.map((r) => `<div><dt>${esc(L(r.k))}</dt><dd>${esc(L(r.v))}</dd></div>`).join("")}</dl>
        <h2 class="imprint-title">${T("nextTitle")}</h2>
        <ul class="next">${L(C.ui.next).map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
      </aside>
    </div>
  </section>

</main>

<footer class="footer">
  <div class="wrap footer-inner">
    <p class="footer-mast"><span lang="tr">YAZITAŞ</span>, ${T("issue")}, ${T("issueDate")}</p>
    <p>${T("footer")}</p>
    <p class="footer-hint">${T("footerHint")}</p>
    <p><a href="${otherHome}" hreflang="${other}" lang="${other}">${T("langSwitch")}</a></p>
  </div>
</footer>

<div class="toast" role="status" aria-live="polite" hidden></div>
<template id="icon-star">${icon("star")}</template>
<script id="i18n" type="application/json">${JSON.stringify({
    secretName: lang === "tr" ? "Hile kodu" : "Cheat code",
    secretHow: lang === "tr" ? "↑ ↑ ↓ ↓ ← → ← → B A tuşlarına bastın" : "You pressed ↑ ↑ ↓ ↓ ← → ← → B A",
    toastSecret: L(C.ui.toastSecret),
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
<body>
<main class="lost">
  <div class="wrap">
    <p class="lost-code">404</p>
    <h1 class="lost-title">Bu sayfa baskıdan çıkmamış</h1>
    <p class="lost-text">Aradığın sayfa bu sayıda yok. İçindekilere dönüp oradan devam edebilirsin.</p>
    <p class="lost-text" lang="en">This page didn't make it into the issue. Head back to the contents.</p>
    <p class="rv-links"><a class="btn btn--solid" href="/#icindekiler">İçindekilere dön</a> <a class="btn" href="/en/#icindekiler" lang="en">Contents (English)</a></p>
  </div>
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
