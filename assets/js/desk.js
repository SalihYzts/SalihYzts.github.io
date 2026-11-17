// Masa: üç sayı ahşap bir masada durur. Tıklanan sayıya kamera yaklaşır; dergi okuyucudaki kapağın tam yerine
// oturunca o sayının sayfası açılır. Okuyucudan "Masa" ile dönülünce kamera aynı dergiden geri çekilir.
// JS kapalıysa dergiler düz bağlantı olarak çalışır.
(function () {
  "use strict";

  var root = document.documentElement;
  var data = {};
  try { data = JSON.parse(document.getElementById("desk-data").textContent); } catch (e) {}
  // Eski tek dergi adresleri (#kralin-sozu, #mektup) ilgili sayıya gider
  var hash = location.hash.slice(1);
  if (hash && data.legacy && data.legacy[hash]) { location.replace(data.legacy[hash] + "#" + hash); return; }

  var scene = document.getElementById("scene");
  var viewport = document.getElementById("viewport");
  var camera = document.getElementById("camera");
  var dim = document.getElementById("dim");
  var slots = Array.prototype.slice.call(document.querySelectorAll(".slot"));
  var mags = slots.map(function (s) { return s.querySelector(".mag"); });
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Okuyucuyla aynı ölçüler (site.js → layout): üst çubuk telefonda 52, masaüstünde alt şerit 48 piksel
  var TOP = 52, BAR = 48, LIFT = 34, DUR = 950;
  var L = {}, open = -1, busy = false;

  function layout() {
    var w = innerWidth, h = innerHeight, app = w < 720 || h < 512;
    var pw, ph, cy;
    if (app) { pw = w; ph = h - TOP; cy = TOP / 2; root.dataset.view = "app"; }
    else {
      var hh = h - BAR, spread = Math.floor(Math.min((w - 20) / 2, (hh - 20) / 1.25));
      pw = spread >= 360 ? spread : Math.floor(Math.min(w - 20, (hh - 20) / 1.25));
      ph = Math.round(pw * 1.25); cy = -BAR / 2;
      root.dataset.view = spread >= 360 ? "spread" : "single";
    }
    root.classList.toggle("app", app);
    root.classList.toggle("print", !app);
    var ratio = ph / pw;
    // Masadaki dergi genişliği (masa düzleminde piksel); telefonda üç dergi üst üste dizilir
    var mw = app ? Math.min(w * 0.42, h * 0.86 / (2.5 * 0.88 * ratio)) : Math.min(w * 0.235, h * 0.4);
    var gap = mw * 1.2, mh = mw * ratio;
    L = {
      pw: pw, ph: ph, cx: 0, cy: cy, app: app,
      tilt: app ? 28 : 44, k: mw / pw, t: Math.max(5, mw * 0.02),
      homeY: app ? -h * 0.045 : h * 0.02,
      spots: app
        ? [{ x: -w * 0.15, y: -mh * 0.76, r: -5 }, { x: w * 0.16, y: -mh * 0.02, r: 4, z: 4 }, { x: -w * 0.12, y: mh * 0.74, r: -3 }]
        : [{ x: -gap, y: mh * 0.06, r: -7 }, { x: 0, y: -mh * 0.1, r: 2.5 }, { x: gap, y: mh * 0.1, r: 8 }],
    };
    var s = root.style;
    s.setProperty("--pw", pw + "px"); s.setProperty("--ph", ph + "px");
    s.setProperty("--k", L.k); s.setProperty("--t", L.t + "px"); s.setProperty("--tilt", L.tilt + "deg");
    slots.forEach(function (el, i) { var p = L.spots[i]; el.style.cssText = "--x:" + p.x + "px;--y:" + p.y + "px;--r:" + p.r + "deg;--zb:" + (p.z || 0) + "px"; });
    // Kupa, kalem, not kâğıdı ve CV: [x, y, ölçek, açı]
    var props = app
      ? { mug: [w * 0.3, -mh * 0.98, 0.5, 0], pencil: [w * 0.26, mh * 1.22, 0.45, -30], note: [w * 0.31, mh * 0.6, 0.48, 8], cv: [w * 0.3, -mh * 0.32, 0.5, 6] }
      : { mug: [gap * 1.12, -mh * 1.02, 0.85, 0], pencil: [gap * 0.35, mh * 0.86, 0.95, -8], note: [-gap * 1.02, -mh * 0.98, 0.9, -7], cv: [-gap * 1.6, -mh * 0.5, 0.82, -10] };
    Object.keys(props).forEach(function (k) {
      var el = document.querySelector('[data-prop="' + k + '"]'), v = props[k];
      if (el) el.style.cssText = "--x:" + v[0] + "px;--y:" + v[1] + "px;--s:" + v[2] + ";--r:" + v[3] + "deg";
    });
    // Okuyucunun masası: dergi yaklaşınca çevresi okuyucudaki zemin rengine döner
    dim.style.cssText = "left:" + (w / 2 - pw / 2) + "px;top:" + (h / 2 + cy - ph / 2) + "px;width:" + pw + "px;height:" + ph + "px";
    if (open < 0 && !busy) camera.style.transform = cam(-1);
  }

  // Kamera, seçilen derginin dünyadaki dönüşümünün tersidir: hedefte dergi düz ve okuyucudaki kapağın yerinde durur.
  // İki uçta da aynı fonksiyon listesi: tarayıcı her parçayı ayrı ayrı yumuşakça geçirir.
  function cam(i) {
    if (i < 0) return "translate3d(0px," + L.homeY + "px,0px) scale(1) rotateZ(0deg) translate3d(0px,0px,0px) rotateX(0deg)";
    var p = L.spots[i];
    return "translate3d(" + L.cx + "px," + L.cy + "px,0px) scale(" + (1 / L.k) + ") rotateZ(" + (-p.r * 0.65) + "deg) translate3d(" +
      (-p.x) + "px," + (-p.y) + "px," + (-(L.t + (p.z || 0) + LIFT)) + "px) rotateX(" + (-L.tilt) + "deg)";
  }

  function run(from, to, dimFrom, dimTo, done) {
    if (reduce || !camera.animate) { camera.style.transform = to; dim.style.opacity = dimTo; done(); return; }
    var a = camera.animate([{ transform: from }, { transform: to }], { duration: DUR, easing: "cubic-bezier(.62,0,.18,1)", fill: "forwards" });
    dim.animate([{ opacity: dimFrom }, { opacity: dimFrom, offset: dimTo ? 0.45 : 0.1 }, { opacity: dimTo }], { duration: DUR, easing: "ease-in-out", fill: "forwards" });
    a.onfinish = function () {
      camera.style.transform = to; dim.style.opacity = dimTo;
      dim.getAnimations().forEach(function (x) { x.cancel(); }); a.cancel();
      done();
    };
  }

  function prefetch(href) {
    if (document.querySelector('link[rel="prefetch"][href="' + href + '"]')) return;
    var l = document.createElement("link"); l.rel = "prefetch"; l.href = href; document.head.appendChild(l);
  }

  function openMag(i) {
    if (busy || open >= 0) return;
    var href = mags[i].href;
    prefetch(href);
    busy = true; open = i;
    scene.classList.add("is-busy");
    mags[i].classList.add("is-picked");
    run(cam(-1), cam(i), 0, 1, function () { location.assign(href); });
  }

  // Okuyucudan dönüş ya da geri tuşu: kamera açık dergiden masaya çekilir
  function closeFrom(i) {
    busy = true; open = i;
    scene.classList.add("is-busy");
    mags[i].classList.add("is-picked");
    camera.style.transform = cam(i); dim.style.opacity = 1;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      run(cam(i), cam(-1), 1, 0, function () {
        mags[i].classList.remove("is-picked"); scene.classList.remove("is-busy");
        busy = false; open = -1;
        mags[i].focus({ preventScroll: true });
      });
    }); });
  }

  mags.forEach(function (m, i) {
    m.addEventListener("click", function (e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      openMag(i);
    });
    m.addEventListener("pointerenter", function () { prefetch(m.href); });
    m.addEventListener("focus", function () { prefetch(m.href); });
  });
  // Ok tuşlarıyla dergiler arasında gez
  addEventListener("keydown", function (e) {
    if (busy || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    var cur = mags.indexOf(document.activeElement);
    var n = cur < 0 ? (e.key === "ArrowRight" ? 0 : mags.length - 1) : Math.max(0, Math.min(mags.length - 1, cur + (e.key === "ArrowRight" ? 1 : -1)));
    e.preventDefault();
    mags[n].focus();
  });

  // Fareyle hafif paralaks: yalnızca masadayken bakış noktası kayar
  var tx = 50, ty = 46, px = 50, py = 46, raf = 0;
  function tick() {
    px += (tx - px) * 0.08; py += (ty - py) * 0.08;
    viewport.style.setProperty("--po-x", px.toFixed(2) + "%"); viewport.style.setProperty("--po-y", py.toFixed(2) + "%");
    raf = Math.abs(tx - px) + Math.abs(ty - py) > 0.02 ? requestAnimationFrame(tick) : 0;
  }
  if (!reduce && matchMedia("(hover: hover)").matches) addEventListener("pointermove", function (e) {
    if (busy) return;
    tx = 50 + (e.clientX / innerWidth - 0.5) * 8; ty = 46 + (e.clientY / innerHeight - 0.5) * 6;
    if (!raf) raf = requestAnimationFrame(tick);
  });

  var rt = null;
  addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(layout, 120); });
  layout();

  // Okuyucudan "Masa" ile gelindiyse o dergiden geri çekil
  var from = null;
  try { from = sessionStorage.getItem("desk-from"); sessionStorage.removeItem("desk-from"); } catch (e) {}
  var fromI = mags.findIndex(function (m) { return m.dataset.issue === from; });
  if (fromI >= 0) closeFrom(fromI);
  // Geri tuşuyla önbellekten dönülürse masa yaklaşılmış hâlde kalmasın
  addEventListener("pageshow", function (e) { if (e.persisted && open >= 0) { var i = open; busy = false; layout(); closeFrom(i); } });
})();
