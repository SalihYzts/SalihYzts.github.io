#!/usr/bin/env node
// Yerel yönetim paneli. Yalnızca bu bilgisayarda, 127.0.0.1 üzerinde çalışır.
// Kullanım: node admin/server.js   (PORT=4545 varsayılan)
//
// Güvenlik:
// - Sunucu yalnızca 127.0.0.1'e bağlanır; ağdaki başka cihazlar erişemez.
// - Her açılışta rastgele bir erişim anahtarı üretilir ve yalnızca terminalde basılan adreste yer alır.
//   Değiştiren her istek bu anahtarı X-Admin-Token başlığında göndermek zorundadır.
// - Host ve Origin başlıkları denetlenir (DNS rebinding ve başka sitelerden gelen istekler reddedilir).
// - Commit ve push, bilgisayarındaki git oturumunu kullanır; kodda hiçbir token ya da şifre yoktur.
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFile, spawn } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data", "projects.json");
const IMG_DIR = path.join(ROOT, "assets", "img");
const PORT = Number(process.env.PORT) || 4545;
const HOST = "127.0.0.1";
const TOKEN = crypto.randomBytes(24).toString("hex");
const MAX_UPLOAD = 25 * 1024 * 1024;

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".webp": "image/webp", ".woff2": "font/woff2", ".pdf": "application/pdf", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
};

// ---------- Yardımcılar ----------

function send(res, code, body, type = "application/json; charset=utf-8") {
  const data = typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body);
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  res.end(data);
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) { reject(new Error("İstek çok büyük")); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    execFile(cmd, args, { cwd: ROOT, maxBuffer: 10 * 1024 * 1024, ...opts }, (err, stdout, stderr) => {
      resolve({ ok: !err, code: err ? err.code : 0, out: String(stdout || "") + String(stderr || "") });
    });
  });
}

// Statik dosyayı kökün dışına çıkmadan çöz; nokta ile başlayan parçaları (.git, .env) reddet
function safeFile(base, urlPath) {
  let rel;
  try { rel = decodeURIComponent(urlPath).replace(/^\/+/, ""); } catch { return null; }
  if (rel.split(/[\\/]/).some((part) => part.startsWith("."))) return null;
  const full = path.resolve(base, rel);
  if (full !== base && !full.startsWith(base + path.sep)) return null;
  return full;
}

// Önizlemede yalnızca yayımlanan çıktı sunulur: data, src, admin ve .git kapalı
const PUBLIC_FILES = ["", "index.html", "404.html", "sitemap.xml", "robots.txt"];
const PUBLIC_DIRS = ["en/", "ben/", "oyun/", "yazilim/", "assets/", "cv/"];
function isPublic(urlPath) {
  const rel = urlPath.replace(/^\/+/, "");
  return PUBLIC_FILES.includes(rel) || PUBLIC_DIRS.some((d) => rel === d.slice(0, -1) || rel.startsWith(d));
}

// Yüklenen dosyanın gerçek biçimi (ilk baytlar). Yalnızca bu dört biçim kabul edilir.
function sniffImage(buf) {
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (buf.length >= 6 && /^GIF8[79]a$/.test(buf.toString("ascii", 0, 6))) return "gif";
  return null;
}

function serveStatic(res, base, urlPath) {
  let file = safeFile(base, urlPath);
  if (!file) return send(res, 403, "Yasak", "text/plain; charset=utf-8");
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    const body = fs.readFileSync(file);
    send(res, 200, body, TYPES[path.extname(file).toLowerCase()] || "application/octet-stream");
  } catch {
    send(res, 404, "Bulunamadı", "text/plain; charset=utf-8");
  }
}

// ---------- Doğrulama ----------

const TRACKS = ["game", "code"];
const TIERS = ["featured", "card", "compact"];
const ARTS = ["counter", "dawn", "parcel", "pipeline", "chat", "tasks"];
const LINK_LABELS = ["play", "open", "source", "release"];

function isPair(v) { return v && typeof v === "object" && typeof v.tr === "string" && typeof v.en === "string"; }
function imageExists(src) { return typeof src === "string" && /^[a-z0-9._-]+\.(webp|png|jpe?g)$/i.test(src) && fs.existsSync(path.join(IMG_DIR, src)); }

function validate(data) {
  const errors = [];
  if (!data || !Array.isArray(data.projects)) return ["projects dizisi yok"];
  const ids = new Set();
  data.projects.forEach((p, i) => {
    const at = `${i + 1}. proje (${p && p.title ? p.title : "adsız"})`;
    if (!p || typeof p !== "object") return errors.push(`${at}: geçersiz`);
    if (!/^[a-z0-9-]+$/.test(p.id || "")) errors.push(`${at}: id yalnızca küçük harf, rakam ve tire içermeli`);
    if (ids.has(p.id)) errors.push(`${at}: id "${p.id}" iki kez kullanılmış`);
    ids.add(p.id);
    if (!TRACKS.includes(p.track)) errors.push(`${at}: hat oyun ya da yazılım olmalı`);
    if (!TIERS.includes(p.tier)) errors.push(`${at}: kart türü geçersiz`);
    if (typeof p.hidden !== "boolean") errors.push(`${at}: gizli alanı true/false olmalı`);
    if (!p.title || typeof p.title !== "string") errors.push(`${at}: ad boş olamaz`);
    for (const k of ["subtitle", "kind", "date", "pitch"]) if (!isPair(p[k])) errors.push(`${at}: ${k} TR/EN metni eksik`);
    if (!p.points || !Array.isArray(p.points.tr) || !Array.isArray(p.points.en)) errors.push(`${at}: maddeler eksik`);
    if (!Array.isArray(p.stats) || p.stats.some((s) => !isPair(s.k) || !isPair(s.v))) errors.push(`${at}: istatistikler TR/EN olmalı`);
    if (!Array.isArray(p.tech) || p.tech.some((t) => typeof t !== "string")) errors.push(`${at}: teknolojiler liste olmalı`);
    if (p.image) {
      if (!imageExists(p.image.src)) errors.push(`${at}: görsel bulunamadı (${p.image.src})`);
      if (!isPair(p.image.alt) || !p.image.alt.tr.trim() || !p.image.alt.en.trim()) errors.push(`${at}: görselin TR ve EN açıklaması (alt) gerekli`);
    } else if (p.art && !ARTS.includes(p.art)) errors.push(`${at}: çizim türü geçersiz`);
    if (!Array.isArray(p.gallery) || p.gallery.some((g) => !imageExists(g.src) || !isPair(g.alt))) errors.push(`${at}: galeri görsellerinden biri eksik`);
    if (!Array.isArray(p.links)) errors.push(`${at}: bağlantılar liste olmalı`);
    else p.links.forEach((l) => {
      if (!LINK_LABELS.includes(l.label)) errors.push(`${at}: bağlantı türü geçersiz`);
      if (!/^https:\/\/[^\s"<>]+$/.test(l.href || "")) errors.push(`${at}: bağlantı https:// ile başlamalı (${l.href || "boş"})`);
    });
  });
  return errors;
}

// ---------- Görsel yükleme: ImageMagick ile WebP'ye çevir ----------

async function saveImage(name, buf) {
  const base = (name || "gorsel").toLowerCase().replace(/\.[a-z0-9]+$/, "")
    .normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "gorsel";
  const format = sniffImage(buf);
  if (!format) throw new Error("Yalnızca PNG, JPEG, WebP ya da GIF yüklenebilir.");
  let file = `${base}.webp`;
  for (let n = 2; fs.existsSync(path.join(IMG_DIR, file)); n++) file = `${base}-${n}.webp`;
  const tmp = path.join(require("os").tmpdir(), `panel-${crypto.randomBytes(6).toString("hex")}`);
  fs.writeFileSync(tmp, buf);
  try {
    // Biçimi açıkça ver: ImageMagick dosyanın içeriğine bakıp SVG/MVG/MSL gibi başka bir okuyucuya geçmesin.
    // GIF'te yalnızca ilk kare alınır.
    const input = `${format}:${tmp}${format === "gif" ? "[0]" : ""}`;
    const conv = await run("magick", [input, "-auto-orient", "-strip", "-resize", "1200x1200>", "-quality", "80", path.join(IMG_DIR, file)]);
    if (!conv.ok) throw new Error("Görsel çevrilemedi. ImageMagick (magick) kurulu mu? " + conv.out.slice(0, 300));
    const id = await run("magick", ["identify", "-format", "%w %h", `webp:${path.join(IMG_DIR, file)}`]);
    const [w, h] = id.out.trim().split(" ").map(Number);
    return { src: file, w, h };
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

// ---------- API ----------

async function api(req, res, url) {
  const route = `${req.method} ${url.pathname}`;

  if (route === "GET /api/projects") {
    return send(res, 200, JSON.parse(fs.readFileSync(DATA, "utf8")));
  }

  if (route === "PUT /api/projects") {
    let data;
    try { data = JSON.parse((await readBody(req, 2 * 1024 * 1024)).toString("utf8")); } catch { return send(res, 400, { error: "JSON okunamadı" }); }
    const errors = validate(data);
    if (errors.length) return send(res, 422, { error: "Kaydedilmedi", details: errors });
    const tmp = DATA + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify({ projects: data.projects }, null, 2) + "\n");
    fs.renameSync(tmp, DATA);
    const build = await run(process.execPath, [path.join(ROOT, "src", "build.js")]);
    return send(res, build.ok ? 200 : 500, { saved: true, build: build.out.trim(), buildOk: build.ok });
  }

  if (route === "POST /api/upload") {
    const name = url.searchParams.get("name") || "gorsel";
    let buf;
    try { buf = await readBody(req, MAX_UPLOAD); } catch (e) { return send(res, 413, { error: e.message }); }
    if (!buf.length) return send(res, 400, { error: "Dosya boş" });
    try { return send(res, 200, await saveImage(name, buf)); } catch (e) { return send(res, 500, { error: e.message }); }
  }

  if (route === "GET /api/images") {
    const files = fs.readdirSync(IMG_DIR).filter((f) => /\.(webp|png|jpe?g)$/i.test(f)).sort();
    return send(res, 200, { files });
  }

  if (route === "GET /api/git") {
    const [branch, status, last] = await Promise.all([
      run("git", ["rev-parse", "--abbrev-ref", "HEAD"]),
      run("git", ["status", "--short"]),
      run("git", ["log", "-1", "--format=%h %s"]),
    ]);
    const ahead = await run("git", ["rev-list", "--count", "@{u}..HEAD"]);
    return send(res, 200, {
      branch: branch.out.trim(), changes: status.out.trimEnd(), last: last.out.trim(),
      ahead: ahead.ok ? Number(ahead.out.trim()) : null,
    });
  }

  if (route === "POST /api/commit") {
    let body;
    try { body = JSON.parse((await readBody(req, 64 * 1024)).toString("utf8")); } catch { return send(res, 400, { error: "JSON okunamadı" }); }
    const message = String(body.message || "").trim();
    if (!message) return send(res, 400, { error: "Commit mesajı boş olamaz" });
    // Yalnızca panelin değiştirdiği dosyalar
    const add = await run("git", ["add", "--", "data/projects.json", "assets/img", "index.html", "en/index.html", "ben/index.html", "oyun/index.html", "yazilim/index.html", "en/about/index.html", "en/games/index.html", "en/software/index.html", "404.html", "sitemap.xml"]);
    if (!add.ok) return send(res, 500, { error: add.out });
    const commit = await run("git", ["commit", "-m", message]);
    return send(res, commit.ok ? 200 : 400, { ok: commit.ok, out: commit.out });
  }

  if (route === "POST /api/push") {
    const push = await run("git", ["push"], { timeout: 120000 });
    return send(res, push.ok ? 200 : 500, { ok: push.ok, out: push.out });
  }

  return send(res, 404, { error: "Bilinmeyen istek" });
}

// ---------- Sunucu ----------

const server = http.createServer(async (req, res) => {
  try {
    // DNS rebinding'e karşı: yalnızca kendi adresimize gelen istekler
    const host = req.headers.host || "";
    if (host !== `${HOST}:${PORT}` && host !== `localhost:${PORT}`) return send(res, 403, "Yasak", "text/plain; charset=utf-8");
    const url = new URL(req.url, `http://${host}`);

    if (url.pathname.startsWith("/api/")) {
      const origin = req.headers.origin;
      if (origin && origin !== `http://${HOST}:${PORT}` && origin !== `http://localhost:${PORT}`) return send(res, 403, { error: "Başka siteden gelen istek reddedildi" });
      const given = Buffer.from(String(req.headers["x-admin-token"] || ""));
      const want = Buffer.from(TOKEN);
      if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) return send(res, 401, { error: "Erişim anahtarı yok ya da yanlış. Paneli terminaldeki adresten aç." });
      return await api(req, res, url);
    }

    // Sitenin önizlemesi
    if (url.pathname === "/site" ) { res.writeHead(302, { Location: "/site/" }); return res.end(); }
    if (url.pathname.startsWith("/site/")) {
      const rel = url.pathname.slice("/site".length);
      if (!isPublic(rel)) return send(res, 403, "Yasak", "text/plain; charset=utf-8");
      return serveStatic(res, ROOT, rel);
    }
    // Site mutlak yollar kullanıyor (/assets/...): önizlemede bunları kökten de sun
    if (/^\/(assets|cv|en)\//.test(url.pathname)) return serveStatic(res, ROOT, url.pathname);

    // Panel arayüzü
    if (url.pathname === "/" || url.pathname === "/index.html") return serveStatic(res, __dirname, "index.html");
    if (["/app.js", "/admin.css"].includes(url.pathname)) return serveStatic(res, __dirname, url.pathname);
    return send(res, 404, "Bulunamadı", "text/plain; charset=utf-8");
  } catch (e) {
    send(res, 500, { error: String(e && e.message || e) });
  }
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") console.error(`\n  ${PORT} numaralı port kullanımda. Panel zaten açık olabilir; başka bir portla dene: PORT=${PORT + 1} node admin/server.js\n`);
  else console.error(e);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  const link = `http://${HOST}:${PORT}/#t=${TOKEN}`;
  console.log("\n  Yönetim paneli hazır. Bu adresi yalnızca sen kullan:\n");
  console.log("  " + link + "\n");
  console.log("  Kapatmak için Ctrl+C.\n");
  if (!process.env.NO_OPEN) {
    const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "explorer" : "xdg-open";
    try { spawn(opener, [link], { stdio: "ignore", detached: true }).unref(); } catch {}
  }
});
