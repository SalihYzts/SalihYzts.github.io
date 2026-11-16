// Statik site üretici. Bağımlılık yok.
// Kullanım: node src/build.js  →  index.html (TR), en/index.html (EN), 404.html, sitemap.xml
const fs = require("fs");
const path = require("path");
const C = require("./content.js");
// Projeler panelden düzenlenir: data/projects.json
const PROJECTS = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "projects.json"), "utf8")).projects;
const { icon } = require("./icons.js");

const ROOT = path.join(__dirname, "..");
const BUILD = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function page(lang) {
  const other = lang === "tr" ? "en" : "tr";
  // { tr, en } nesnesini ya da düz metni çöz
  const L = (v) => (v && typeof v === "object" && !Array.isArray(v) && ("tr" in v || "en" in v) ? v[lang] : v);
  const T = (k) => esc(L(C.ui[k]));
  // "TR|EN" biçimindeki tek satırlık çeviriler
  const split = (s) => (s.includes("|") ? s.split("|")[lang === "tr" ? 0 : 1] : s);

  const home = lang === "tr" ? "/" : "/en/";
  const otherHome = lang === "tr" ? "/en/" : "/";
  const url = C.links.site.replace(/\/$/, "") + home;
  const otherUrl = C.links.site.replace(/\/$/, "") + otherHome;
  const ext = `<span class="sr">${T("externalHint")}</span>`;
  const extLink = (href, inner, cls = "") =>
    `<a${cls ? ` class="${cls}"` : ""} href="${esc(href)}" target="_blank" rel="noopener">${inner}${icon("ext", "px px--ext")}${ext}</a>`;

  const lensText = (game, code, tag = "span") =>
    `<${tag} data-lens-only="game">${game}</${tag}><${tag} data-lens-only="code">${code}</${tag}>`;
  // Başlıklarda yazılım modu karşılığı komut gibi görünsün
  const headText = (game, code) =>
    `<span data-lens-only="game">${game}</span><span data-lens-only="code" class="h-code" lang="en">${code}</span>`;

  const visible = PROJECTS.filter((p) => !p.hidden);
  const games = visible.filter((p) => p.track === "game");
  const code = visible.filter((p) => p.track === "code");
  const countGame = games.length;
  const countCode = code.length;
  const achTotal = C.achievements.length + 1;

  // ---------- Parçalar ----------

  const art = {
    counter: `<svg class="art" viewBox="0 0 320 200" role="img" aria-label="${esc(lang === "tr" ? "Dükkân tezgâhı, CD'ler ve şüphe göstergesi çizimi" : "Drawing of a shop counter, CDs and a suspicion meter")}">
      <g fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 150h280M20 150v34M300 150v34M40 120h240v30H40z"/>
        <circle cx="96" cy="96" r="24"/><circle cx="96" cy="96" r="5"/>
        <circle cx="150" cy="104" r="16"/><circle cx="150" cy="104" r="3"/>
        <path d="M196 70h56v50h-56zM204 80h40M204 90h28"/>
        <path d="M30 24h120v14H30z"/>
      </g>
      <path d="M32 26h78v10H32z" fill="currentColor"/>
      <text x="160" y="35" fill="currentColor" font-family="IBM Plex Mono, monospace" font-size="11">${lang === "tr" ? "ŞÜPHE" : "SUSPICION"}</text>
      <text x="196" y="138" fill="currentColor" font-family="IBM Plex Mono, monospace" font-size="11">₺ 2000s</text>
    </svg>`,
    dawn: `<svg class="art" viewBox="0 0 320 200" role="img" aria-label="${esc(lang === "tr" ? "Ufukta doğan güneş ve bir üs duvarı çizimi" : "Drawing of a sun rising behind a base wall")}">
      <g fill="none" stroke="currentColor" stroke-width="2">
        <path d="M110 140a50 50 0 0 1 100 0"/>
        <path d="M160 70v-18M118 86l-12-12M202 86l12-12M96 118H78M224 118h18"/>
        <path d="M10 140h300"/>
        <path d="M30 140v-34h14v10h14v-10h14v10h14v-10h14v34M222 140v-34h14v10h14v-10h14v10h14v-10h14v34"/>
      </g>
      <g fill="currentColor"><path d="M10 160h300v2H10zM40 176h240v2H40zM90 190h140v2H90z"/></g>
    </svg>`,
    parcel: `<svg class="art" viewBox="0 0 320 200" role="img" aria-label="${esc(lang === "tr" ? "Izgara üzerinde bir arsa parseli ve geri sayım çizimi" : "Drawing of a land parcel on a grid with a countdown")}">
      <g stroke="currentColor" stroke-width="1" opacity=".35">
        ${Array.from({ length: 9 }, (_, i) => `<path d="M${20 + i * 35} 10v180"/>`).join("")}
        ${Array.from({ length: 6 }, (_, i) => `<path d="M10 ${20 + i * 32}h300"/>`).join("")}
      </g>
      <path d="M58 52l96-18 64 40-20 82-112 10z" fill="none" stroke="currentColor" stroke-width="3"/>
      <g fill="currentColor"><path d="M55 49h6v6h-6zM151 31h6v6h-6zM215 71h6v6h-6zM195 153h6v6h-6zM83 163h6v6h-6z"/></g>
      <path d="M110 96l12 12 22-24" fill="none" stroke="currentColor" stroke-width="4"/>
      <g fill="none" stroke="currentColor" stroke-width="2"><path d="M238 120h66v34h-66z"/></g>
      <text x="248" y="143" fill="currentColor" font-family="IBM Plex Mono, monospace" font-size="15">00:10</text>
    </svg>`,
    pipeline: `<svg class="art" viewBox="0 0 320 200" role="img" aria-label="${esc(lang === "tr" ? "QR menüden kasaya giden sipariş akışı çizimi" : "Drawing of orders flowing from a QR menu to the register")}">
      <g fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 60h56v56H18zM90 76h36M118 70l8 6-8 6M140 52h64v80h-64zM218 76h36M246 70l8 6-8 6M262 56h44v44h-44zM270 100v16h28v-16"/>
        <path d="M150 66h44M150 80h44M150 94h30"/>
        <path d="M172 132v28M150 160h44M18 160h56"/>
      </g>
      <g fill="currentColor"><path d="M26 68h12v12H26zM54 68h12v12H54zM26 96h12v12H26zM44 86h6v6h-6zM56 96h4v4h-4zM62 104h4v4h-4z"/><path d="M276 66h16v4h-16zM276 76h10v4h-10z"/></g>
      <text x="140" y="176" fill="currentColor" font-family="IBM Plex Mono, monospace" font-size="11">go · windows</text>
      <text x="18" y="176" fill="currentColor" font-family="IBM Plex Mono, monospace" font-size="11">QR</text>
      <text x="258" y="132" fill="currentColor" font-family="IBM Plex Mono, monospace" font-size="11">POS</text>
    </svg>`,
    chat: `<svg class="art" viewBox="0 0 320 200" role="img" aria-label="${esc(lang === "tr" ? "Sohbet balonlarından bir tabloya aktarım çizimi" : "Drawing of chat bubbles being exported to a spreadsheet")}">
      <g fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 40h100v30H44l-10 10V70H20zM30 96h90v30H54l-10 10v-10H30zM20 150h80v26H20z"/>
        <path d="M140 108h34M166 100l8 8-8 8"/>
        <path d="M190 40h112v128H190zM190 64h112M190 88h112M190 112h112M190 136h112M222 40v128"/>
      </g>
      <g fill="currentColor"><path d="M30 50h60v4H30zM30 58h40v4H30zM40 106h60v4H40zM30 158h50v4H30zM198 48h16v8h-16zM198 72h16v8h-16zM198 96h16v8h-16zM198 120h16v8h-16zM198 144h16v8h-16zM230 72h50v4h-50zM230 96h40v4h-40zM230 120h56v4h-56zM230 144h30v4h-30z"/></g>
      <text x="232" y="56" fill="currentColor" font-family="IBM Plex Mono, monospace" font-size="10">.xlsx</text>
    </svg>`,
    tasks: `<svg class="art" viewBox="0 0 320 200" role="img" aria-label="${esc(lang === "tr" ? "Görev listesi ve takvim çizimi" : "Drawing of a task list and a calendar")}">
      <g fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 30h140v140H20zM34 52h14v14H34zM34 84h14v14H34zM34 116h14v14H34zM34 148h14v14H34z"/>
        <path d="M37 59l4 4 6-8M37 91l4 4 6-8"/>
        <path d="M180 30h120v140H180zM180 58h120M210 58v112M240 58v112M270 58v112M180 86h120M180 114h120M180 142h120"/>
      </g>
      <g fill="currentColor"><path d="M58 56h80v6H58zM58 88h64v6H58zM58 120h88v6H58zM58 152h52v6H58zM214 90h22v20h-22zM244 118h22v20h-22zM190 36h50v10h-50z"/></g>
    </svg>`,
  };

  // Büyük harfe çevirmede "i" → "İ" yalnızca Türkçe adlarda olsun (MyEverythingList → MYEVERYTHINGLIST)
  const titleLang = (t) => (/[çğıöşüÇĞİÖŞÜ]|Parsel/.test(t) ? "tr" : "en");

  const statSheet = (stats) => !stats.length ? "" : `
        <dl class="stat-sheet" aria-label="${T("stats")}">
          ${stats.map((s) => `<div><dt>${esc(L(s.k))}</dt><dd>${esc(L(s.v))}</dd></div>`).join("")}
        </dl>`;

  const inventory = (tech) => `
        <ul class="inventory" aria-label="${T("inventory")}">${tech.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;

  const card = (p) => {
    const sub = L(p.subtitle);
    const screen = p.image
      ? `<img src="/assets/img/${p.image.src}" width="${p.image.w}" height="${p.image.h}" alt="${esc(L(p.image.alt))}" loading="lazy" decoding="async">`
      : art[p.art];
    const gallery = p.gallery && p.gallery.length ? `
        <ul class="qc-gallery">${p.gallery.map((g) => `<li><img src="/assets/img/${g.src}" width="${g.w || 1200}" height="${g.h || 675}" alt="${esc(L(g.alt))}" loading="lazy" decoding="async"></li>`).join("")}</ul>` : "";
    const points = L(p.points) || [];
    const linkHtml = p.links.map((l, i) =>
      extLink(l.href, esc(L(C.ui.links[l.label])), i === 0 ? "btn btn--primary" : "btn btn--ghost")).join("");
    return `
      <article class="qc${p.tier === "featured" ? " qc--featured" : ""}${p.image ? "" : " qc--art"}" id="${esc(p.id)}">
        <div class="qc-media">
          <div class="qc-screen">${screen}</div>${gallery}
        </div>
        <div class="qc-body">
          <p class="qc-kind"><span>${esc(L(p.kind))}</span>${L(p.date) ? `<span class="qc-date">${esc(L(p.date))}</span>` : ""}</p>
          <h4 class="qc-title" lang="${titleLang(p.title)}">${esc(p.title)}${sub ? ` <span class="qc-sub" lang="${titleLang(sub)}">${esc(sub)}</span>` : ""}</h4>
          <p class="qc-pitch">${esc(L(p.pitch))}</p>
          ${points.length ? `<ul class="qc-points">${points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
          ${statSheet(p.stats)}
          ${inventory(p.tech)}
          ${linkHtml ? `<p class="qc-links">${linkHtml}</p>` : ""}
        </div>
      </article>`;
  };

  // Kompakt kart: küçük işler için görsel, ad, tek cümle ve bağlantılar
  const compact = (p) => {
    const screen = p.image
      ? `<img src="/assets/img/${p.image.src}" width="${p.image.w}" height="${p.image.h}" alt="${esc(L(p.image.alt))}" loading="lazy" decoding="async">`
      : art[p.art] || "";
    const sub = L(p.subtitle);
    return `
        <li class="mini${p.image ? "" : " qc--art"}" id="${esc(p.id)}">
          <div class="qc-screen">${screen}</div>
          <p class="qc-kind"><span>${esc(L(p.kind))}</span>${L(p.date) ? `<span class="qc-date">${esc(L(p.date))}</span>` : ""}</p>
          <h5 class="mini-title" lang="${titleLang(p.title)}">${esc(p.title)}</h5>
          ${sub ? `<p class="mini-sub" lang="${titleLang(sub)}">${esc(sub)}</p>` : ""}
          <p class="mini-pitch">${esc(L(p.pitch))}</p>
          <p class="mini-tech">${p.tech.map(esc).join(", ")}</p>
          ${p.links.length ? `<p class="mini-links">${p.links.map((l) => extLink(l.href, esc(L(C.ui.links[l.label])))).join("")}</p>` : ""}
        </li>`;
  };

  const track = (id, items, minorLabel, name, iconName) => `
    <section class="track" id="track-${id}" data-track="${id}" aria-labelledby="track-${id}-h">
      <h3 class="track-head" id="track-${id}-h">
        ${icon(iconName, "px px--lg")}
        <span class="track-name">${name}</span>
        <span class="track-rank" data-rank-for="${id}">${id === "game" ? lensText(T("mainQuest"), T("sideQuest")) : lensText(T("sideQuest"), T("mainQuest"))}</span>
      </h3>
      <div class="qc-list">${items.filter((p) => p.tier !== "compact").map(card).join("")}</div>
      ${items.some((p) => p.tier === "compact") ? `
      <h4 class="minor-title">${minorLabel}</h4>
      <ul class="mini-grid">${items.filter((p) => p.tier === "compact").map(compact).join("")}
      </ul>` : ""}
    </section>`;

  const statusIcon = { active: "flag", done: "check", locked: "lock" };
  const quest = (q) => {
    if (q.status === "locked") {
      return `
        <li class="quest quest--locked">
          <span class="quest-node" aria-hidden="true">${icon("lock")}</span>
          <div class="quest-main">
            <p class="quest-status">${esc(L(C.ui.status.locked))}</p>
            <h3 class="quest-title">${T("lockedTitle")}</h3>
            <p class="quest-org">${T("lockedText")}</p>
          </div>
        </li>`;
    }
    const goals = L(q.goals) || [];
    const date = L(q.date);
    return `
        <li class="quest quest--${q.status}">
          <span class="quest-node" aria-hidden="true">${icon(statusIcon[q.status])}</span>
          <div class="quest-main">
            <p class="quest-status">${esc(L(C.ui.status[q.status]))}</p>
            <h3 class="quest-title">${esc(L(q.title))}</h3>
            <p class="quest-org"><span>${esc(L(q.org))}</span>${date ? `<span class="quest-date">${esc(date)}</span>` : ""}</p>
            ${goals.length ? `<ul class="goals">${goals.map((g) => `<li>${esc(g)}</li>`).join("")}</ul>` : ""}
          </div>
        </li>`;
  };

  const badge = (a) => `
        <li class="badge">
          <span class="badge-icon">${icon(a.icon)}</span>
          <span class="badge-text"><span class="badge-name">${esc(L(a.name))}</span><span class="badge-how">${esc(L(a.how))}</span></span>
        </li>`;

  const secretBadge = `
        <li class="badge badge--locked" id="secret-badge">
          <span class="badge-icon">${icon("lock")}</span>
          <span class="badge-text"><span class="badge-name">${T("secretName")}</span><span class="badge-how">${T("secretHint")}</span></span>
        </li>`;

  const branch = (b) => `
        <li class="branch">
          <h3 class="node node--branch">${esc(L(b.branch))}</h3>
          <ul class="leaves">${b.items.map((i) => `<li class="node">${esc(split(i))}</li>`).join("")}</ul>
          <p class="used"><span>${T("usedIn")}</span> ${esc(L(b.used))}</p>
        </li>`;

  const menu = [
    { href: "#seviyeler", label: lensText(T("levelsTitleGame"), T("levelsTitleCode")), n: String(countGame + countCode) },
    { href: "#gorevler", label: lensText(T("questsTitleGame"), T("questsTitleCode")), n: String(C.quests.length) },
    { href: "#basarimlar", label: lensText(T("achTitleGame"), T("achTitleCode")), n: `<span data-ach-count>${C.achievements.length}</span>/${achTotal}` },
    { href: "#yetenekler", label: lensText(T("skillsTitleGame"), T("skillsTitleCode")), n: String(C.skills.length + 1) },
    { href: "#kayit", label: lensText(T("saveTitleGame"), T("saveTitleCode")), n: "CV" },
  ];

  const sectionHead = (id, game, codeTitle, intro) => `
      <header class="section-head">
        <h2 id="${id}-h">${headText(game, codeTitle)}</h2>
        ${intro}
      </header>`;

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Salih Yazıtaş",
    url,
    image: C.links.site + "assets/img/salih.webp",
    jobTitle: L(C.ui.role),
    email: "mailto:" + C.links.email,
    address: { "@type": "PostalAddress", addressLocality: "Çanakkale", addressCountry: "TR" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Çanakkale Onsekiz Mart Üniversitesi" },
    founder: { "@type": "Organization", name: "Volpen", url: C.links.volpen },
    sameAs: [C.links.github, C.links.linkedin, C.links.itch],
    knowsAbout: ["Unity", "C#", "TypeScript", "React", "Python", "FastAPI", "Supabase", "Electron", "Tauri"],
  };

  return `<!doctype html>
<html lang="${lang}" data-theme="dark" data-lens="game">
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
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#10131d" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#eceef2" media="(prefers-color-scheme: light)">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="Salih Yazıtaş">
<meta property="og:title" content="${esc(L(C.meta.title))}">
<meta property="og:description" content="${esc(L(C.meta.description))}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${lang === "tr" ? "tr_TR" : "en_US"}">
<meta property="og:locale:alternate" content="${lang === "tr" ? "en_US" : "tr_TR"}">
<meta property="og:image" content="${C.links.site}assets/og/og-${lang}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(L(C.meta.ogAlt))}">
<meta property="profile:first_name" content="Salih">
<meta property="profile:last_name" content="Yazıtaş">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/big-shoulders-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/plex-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/fonts.css">
<link rel="stylesheet" href="/assets/css/site.css">
<script>
  // Boyamadan önce tema ve modu uygula (yanıp sönme olmasın)
  (function () {
    var d = document.documentElement, t = null, l = null;
    try { t = localStorage.getItem("theme"); l = localStorage.getItem("lens"); } catch (e) {}
    if (!t) t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    d.dataset.theme = t;
    // ?mod=yazilim / ?mod=oyun ile paylaşılan bağlantı o modda açılsın
    var q = /[?&]mod=(oyun|game|yazilim|code)/.exec(location.search);
    if (q) l = /oyun|game/.test(q[1]) ? "game" : "code";
    if (l === "game" || l === "code") d.dataset.lens = l;
    d.classList.add("js");
  })();
</script>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<a class="skip" href="#main">${T("skip")}</a>

<header class="hud">
  <div class="wrap hud-inner">
    <a class="brand" href="${home}" aria-label="Salih Yazıtaş">
      ${icon("logo", "brand-mark")}
      <span class="brand-name" lang="tr">Salih Yazıtaş</span>
    </a>
    <div class="lens-switch" role="group" aria-label="${T("modeLabel")}">
      <button type="button" class="lens-btn" data-set-lens="game" aria-pressed="true">${icon("pad")}<span>${T("modeGame")}</span></button>
      <button type="button" class="lens-btn" data-set-lens="code" aria-pressed="false">${icon("term")}<span>${T("modeCode")}</span></button>
    </div>
    <div class="tools">
      <a class="tool tool--lang" href="${otherHome}" hreflang="${other}" lang="${other}" aria-label="${T("langSwitch")}">${T("langSwitchShort")}</a>
      <button type="button" class="tool" data-theme-toggle aria-label="${T("themeToggle")}">${icon("sun", "px only-dark")}${icon("moon", "px only-light")}</button>
      <button type="button" class="tool" data-sound-toggle aria-pressed="false" aria-label="${T("soundOn")}" data-label-on="${T("soundOff")}" data-label-off="${T("soundOn")}">${icon("mute", "px if-muted")}${icon("sound", "px if-sound")}</button>
    </div>
  </div>
</header>

<main id="main">

  <section class="title-screen" aria-labelledby="hero-h">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <h1 id="hero-h" class="hero-name"><span class="hero-first" lang="tr">SALİH</span> <span class="hero-last" lang="tr">YAZITAŞ</span></h1>
        <p class="hero-role">${T("role")}</p>
        <p class="hero-intro">${T("intro")}</p>
      </div>

      <div class="hero-side">
        <p class="mode-q" id="mode-q">${T("pickMode")}</p>
        <div class="mode-cards" role="group" aria-labelledby="mode-q">
          <button type="button" class="mode-card mode-card--game" data-set-lens="game" data-go="#seviyeler" aria-pressed="true">
            <span class="mode-screen" aria-hidden="true">
              <img src="/assets/img/kralin-sozu-thumb.webp" width="400" height="225" alt="">
              <span class="snow"></span>
            </span>
            <span class="mode-label">${icon("pad")}<span class="mode-title">${T("pickGameTitle")}</span></span>
            <span class="mode-text">${T("pickGameText")}</span>
          </button>
          <button type="button" class="mode-card mode-card--code" data-set-lens="code" data-go="#seviyeler" aria-pressed="false">
            <span class="mode-screen mode-screen--term" aria-hidden="true">
              <span class="term-line"><span class="term-prompt">$</span> npm run deploy</span>
              <span class="term-line term-ok">✓ ${T("terminalLine")}<span class="caret"></span></span>
            </span>
            <span class="mode-label">${icon("term")}<span class="mode-title">${T("pickCodeTitle")}</span></span>
            <span class="mode-text">${T("pickCodeText")}</span>
          </button>
        </div>

        <nav class="main-menu" aria-label="${T("menuLabel")}">
          <ul>
            ${menu.map((m) => `<li><a href="${m.href}"><span class="mm-label">${m.label}</span><span class="mm-leader" aria-hidden="true"></span><span class="mm-count">${m.n}</span></a></li>`).join("\n            ")}
          </ul>
        </nav>
      </div>
    </div>

    <div class="wrap">
      <dl class="statusbar" aria-label="${T("hudLabel")}">
        ${C.hud.map((h) => `<div><dt>${esc(L(h.label))}</dt><dd>${esc(L(h.value))}</dd></div>`).join("\n        ")}
      </dl>
    </div>
  </section>

  <section class="section" id="seviyeler" aria-labelledby="seviyeler-h">
    <div class="wrap">
      ${sectionHead("seviyeler", T("levelsTitleGame"), T("levelsTitleCode"), `<p class="section-intro">${lensText(T("levelsIntroGame"), T("levelsIntroCode"))}</p>`)}
      <div class="tracks" data-tracks>
        ${track("game", games, T("moreGames"), T("trackGame"), "pad")}
        ${track("code", code, T("moreCode"), T("trackCode"), "term")}
      </div>
    </div>
  </section>

  <section class="section" id="gorevler" aria-labelledby="gorevler-h">
    <div class="wrap">
      ${sectionHead("gorevler", T("questsTitleGame"), T("questsTitleCode"), `<p class="section-intro">${T("questsIntro")}</p>`)}
      <ol class="quest-log">${C.quests.map(quest).join("")}
      </ol>
    </div>
  </section>

  <section class="section" id="basarimlar" aria-labelledby="basarimlar-h">
    <div class="wrap">
      ${sectionHead("basarimlar", T("achTitleGame"), T("achTitleCode"), `<p class="section-intro">${T("achIntro")}</p>`)}
      <ul class="badges">${C.achievements.map(badge).join("")}${secretBadge}
      </ul>
    </div>
  </section>

  <section class="section" id="yetenekler" aria-labelledby="yetenekler-h">
    <div class="wrap">
      ${sectionHead("yetenekler", T("skillsTitleGame"), T("skillsTitleCode"), `<p class="section-intro">${T("skillsIntro")}</p>`)}
      <div class="tree">
        <div class="tree-root">
          <p class="node node--root">${lang === "tr" ? "Diller" : "Languages"}</p>
          <ul class="root-leaves">${C.languages.map((l) => `<li class="node">${esc(l)}</li>`).join("")}</ul>
        </div>
        <ul class="branches">${C.skills.map(branch).join("")}
        </ul>
      </div>
    </div>
  </section>

  <section class="section section--save" id="kayit" aria-labelledby="kayit-h">
    <div class="wrap">
      ${sectionHead("kayit", T("saveTitleGame"), T("saveTitleCode"), `<p class="section-intro">${T("saveIntro")}</p>`)}
      <div class="save-grid">
        <div class="char-card">
          <img class="char-photo" src="/assets/img/salih.webp" width="480" height="480" alt="${T("photoAlt")}" loading="lazy" decoding="async">
          <div class="char-info">
            <p class="char-name" lang="tr">Salih Yazıtaş</p>
            <dl class="stat-sheet stat-sheet--char">
              <div><dt>${T("charClass")}</dt><dd>${T("charClassValue")}</dd></div>
              <div><dt>${T("charGuild")}</dt><dd>${T("charGuildValue")}</dd></div>
              <div><dt>${T("charSchool")}</dt><dd>${T("charSchoolValue")}</dd></div>
              <div><dt>${T("charBase")}</dt><dd>${T("charBaseValue")}</dd></div>
              <div><dt>${T("charLang")}</dt><dd>${T("charLangValue")}</dd></div>
            </dl>
          </div>
        </div>

        <div class="save-menu">
          <div class="save-cv">
            <a class="btn btn--primary btn--block" href="/cv/Salih_Yazitas_CV_${lang === "tr" ? "TR" : "EN"}.pdf" download>${icon("download")}<span>${T(lang === "tr" ? "cvTr" : "cvEn")}</span></a>
            <a class="btn btn--ghost btn--block" href="/cv/Salih_Yazitas_CV_${lang === "tr" ? "EN" : "TR"}.pdf" download>${icon("download")}<span>${T(lang === "tr" ? "cvEn" : "cvTr")}</span></a>
          </div>
          <div class="save-mail">
            <a class="mail-link" href="mailto:${C.links.email}">${icon("mail")}<span>${C.links.email}</span></a>
            <button type="button" class="btn btn--ghost btn--small" data-copy="${C.links.email}" data-ok="${T("copied")}" data-fail="${T("copyFailed")}">${icon("copy")}<span>${T("copyEmail")}</span></button>
          </div>
          <ul class="socials">
            ${C.socials.map((s) => `<li>${extLink(s.href, `<span class="soc-name">${esc(s.name)}</span><span class="soc-handle">${esc(L(s.handle))}</span>`)}</li>`).join("\n            ")}
          </ul>
        </div>
      </div>
    </div>
  </section>

</main>

<footer class="footer">
  <div class="wrap footer-inner">
    <p>© 2026 <span lang="tr">Salih Yazıtaş</span>. ${T("footer")}</p>
    <p class="footer-hint">${T("footerHint")}</p>
    <p><a href="${otherHome}" hreflang="${other}" lang="${other}">${T("langSwitch")}</a></p>
  </div>
</footer>

<div class="toast" role="status" aria-live="polite" hidden></div>
<template id="icon-star">${icon("star")}</template>
<script id="i18n" type="application/json">${JSON.stringify({
    secretName: lang === "tr" ? "Hile kodu" : "Cheat code",
    secretHow: lang === "tr" ? "↑ ↑ ↓ ↓ ← → ← → B A tuşlarına bas" : "Press ↑ ↑ ↓ ↓ ← → ← → B A",
    toastSecret: L(C.ui.toastSecret), crtOn: L(C.ui.crtOn), crtOff: L(C.ui.crtOff),
  })}</script>
<script src="/assets/js/site.js" defer></script>
</body>
</html>
`;
}

function notFound() {
  return `<!doctype html>
<html lang="tr" data-theme="dark" data-lens="game">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 · Salih Yazıtaş</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/css/fonts.css">
<link rel="stylesheet" href="/assets/css/site.css">
<script>(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem("theme")}catch(e){}if(!t)t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";d.dataset.theme=t;})();</script>
</head>
<body>
<main class="lost">
  <div class="wrap">
    <p class="lost-code">404</p>
    <h1 class="lost-title">Bu bölüm haritada yok</h1>
    <p class="lost-text">Aradığın sayfa taşınmış ya da hiç olmamış. Ana menüye dönüp oradan devam edebilirsin.</p>
    <p class="lost-text" lang="en">This level isn't on the map. Head back to the main menu.</p>
    <p class="qc-links"><a class="btn btn--primary" href="/">Ana menüye dön</a> <a class="btn btn--ghost" href="/en/" lang="en">Main menu (English)</a></p>
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
