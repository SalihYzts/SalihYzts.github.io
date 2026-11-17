// Dergi okuyucusu: bütün sayfalar büyük bir masada yan yana durur, bir kamera aralarında gezer.
// Masaüstünde iki sayfalık açılım ekranı doldurur; telefonda tek sayfa tam ekrandır.
// JS kapalıysa sayfalar alt alta okunur; bu dosya yalnızca okuma deneyimini ekler.
(function () {
  "use strict";

  var root = document.documentElement;
  var book = document.querySelector(".book");
  var world = document.querySelector(".world");
  var pages = Array.prototype.slice.call(document.querySelectorAll(".page"));
  var total = pages.length;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)");
  var i18n = {};
  try { i18n = JSON.parse(document.getElementById("i18n").textContent); } catch (e) {}
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  var TOP = 52;
  var view = "", pw = 0, ph = 0, gap = 0;
  var stops = [];       // her durak: { pages: [n...], fx, fy } (kameranın odak noktası)
  var stopOf = {};      // sayfa numarası → durak sırası
  var stop = 0;         // şu anki durak
  var cam = { x: 0, y: 0, s: 1 };
  var anim = null;

  // ---------- Yerleşim ----------
  function layout() {
    var w = window.innerWidth, h = window.innerHeight - TOP;
    var margin = 14, bottomRoom = 8;
    var next;
    if (w < 720 || h < 460) next = "app";
    else {
      var spreadW = Math.min((w - margin * 2) / 2, (h - margin - bottomRoom) / 1.25);
      next = spreadW >= 360 ? "spread" : "single";
    }
    view = next;
    root.classList.toggle("app", view === "app");
    root.classList.toggle("print", view !== "app");
    root.dataset.view = view;

    if (view === "app") { pw = w; ph = h; gap = Math.round(w * 0.06); }
    else if (view === "spread") { pw = Math.floor(Math.min((w - margin * 2) / 2, (h - margin - bottomRoom) / 1.25)); ph = Math.round(pw * 1.25); gap = Math.round(pw * 0.22); }
    else { pw = Math.floor(Math.min(w - margin * 2, (h - margin - bottomRoom) / 1.25)); ph = Math.round(pw * 1.25); gap = Math.round(pw * 0.12); }
    root.style.setProperty("--pw", pw + "px");
    root.style.setProperty("--ph", ph + "px");

    // Durakları ve sayfaların masadaki yerini hesapla
    stops = []; stopOf = {};
    var x = 0, y = view === "app" ? 0 : Math.max(margin, Math.round((h - ph - bottomRoom) / 2));
    if (view === "spread") {
      var groups = [[1]];
      for (var n = 2; n <= total; n += 2) groups.push(n + 1 <= total && n !== total ? [n, n + 1] : [n]);
      groups.forEach(function (g, i) {
        var left = x, right = x + pw;
        g.forEach(function (num) {
          var el = pages[num - 1];
          var isLeft = num !== 1 && num % 2 === 0;
          place(el, isLeft ? left : right, y);
        });
        // Tek sayfalık duraklarda (kapak, arka kapak) kamera o sayfaya odaklanır
        var cx = g.length === 2 ? left + pw : (g[0] === 1 ? right + pw / 2 : left + pw / 2);
        stops.push({ pages: g, fx: cx, fy: y + ph / 2 });
        g.forEach(function (num) { stopOf[num] = i; });
        x += pw * 2 + gap;
      });
    } else {
      pages.forEach(function (el, i) {
        place(el, x, y);
        stops.push({ pages: [i + 1], fx: x + pw / 2, fy: y + ph / 2 });
        stopOf[i + 1] = i;
        x += pw + gap;
      });
    }
    fitAll();
    jumpTo(stop);
  }
  function place(el, x, y) { el.style.left = x + "px"; el.style.top = y + "px"; }

  // Taşan sayfayı küçült: bütün ölçüler --u'ya bağlı olduğu için oran ekran boyundan bağımsız
  function fitAll() {
    pages.forEach(function (p) { p.style.removeProperty("--fit"); });
    if (view === "app") return;
    pages.forEach(function (p) {
      var inner = p.querySelector(".page-inner");
      var fit = 1;
      while (inner && inner.scrollHeight > inner.clientHeight + 2 && fit > 0.72) {
        fit = Math.round((fit - 0.03) * 100) / 100;
        p.style.setProperty("--fit", fit);
      }
    });
  }

  // ---------- Kamera ----------
  function viewport() { return { w: window.innerWidth, h: window.innerHeight - TOP }; }
  function camFor(i, s) {
    var v = viewport(), st = stops[i];
    s = s || 1;
    return { x: v.w / 2 - st.fx * s, y: v.h / 2 - st.fy * s, s: s };
  }
  function setCam(c) {
    cam = c;
    world.style.transform = "translate3d(" + c.x.toFixed(1) + "px," + c.y.toFixed(1) + "px,0) scale(" + c.s + ")";
  }
  function tf(c) { return "translate3d(" + c.x.toFixed(1) + "px," + c.y.toFixed(1) + "px,0) scale(" + c.s + ")"; }

  function jumpTo(i) {
    stop = Math.max(0, Math.min(stops.length - 1, i));
    setCam(camFor(stop));
    settle();
  }

  // Bir duraktan ötekine: kamera geri çekilir, kayar, yeniden yaklaşır
  function travel(i, focusPage) {
    i = Math.max(0, Math.min(stops.length - 1, i));
    if (i === stop && !anim) { if (focusPage) focusOn(focusPage); return; }
    if (anim) { anim.cancel(); anim = null; }
    var from = cam, to = camFor(i);
    var dist = Math.abs(i - stop);
    if (reduce.matches) { stop = i; setCam(to); settle(); if (focusPage) focusOn(focusPage); return; }
    // Uzaklık arttıkça kamera daha çok geri çekilir ve yolculuk biraz uzar
    var low = Math.max(view === "app" ? 0.62 : 0.42, (view === "app" ? 0.86 : 0.8) - 0.05 * (dist - 1));
    var v = viewport();
    var midFx = (stops[stop].fx + stops[i].fx) / 2, midFy = (stops[stop].fy + stops[i].fy) / 2;
    var mid = { x: v.w / 2 - midFx * low, y: v.h / 2 - midFy * low, s: low };
    var duration = Math.min(1500, (view === "app" ? 520 : 820) + 90 * (dist - 1));
    stop = i;
    root.classList.add("is-moving");
    updateChrome();
    anim = world.animate([
      { transform: tf(from), easing: "cubic-bezier(.45,0,.35,1)" },
      { transform: tf(mid), offset: 0.5, easing: "cubic-bezier(.45,0,.35,1)" },
      { transform: tf(to) },
    ], { duration: duration });
    anim.onfinish = function () {
      anim = null;
      setCam(to);
      root.classList.remove("is-moving");
      settle();
      if (focusPage) focusOn(focusPage);
    };
  }

  // Görünen sayfalar etkileşime açık, diğerleri inert (ekran okuyucu ve sekme sırası için)
  function settle() {
    var on = stops[stop].pages;
    pages.forEach(function (p, idx) {
      var visible = on.indexOf(idx + 1) >= 0;
      if (visible) { p.removeAttribute("inert"); p.removeAttribute("aria-hidden"); }
      else { p.setAttribute("inert", ""); p.setAttribute("aria-hidden", "true"); }
    });
    if (view === "app") on.forEach(function (n) { pages[n - 1].scrollTop = 0; });
    loadNear();
    updateChrome(true);
  }

  // Yolda görünecek komşu sayfaların görsellerini önceden yükle
  function loadNear() {
    for (var d = -2; d <= 2; d++) {
      var st = stops[stop + d];
      if (!st) continue;
      st.pages.forEach(function (n) { pages[n - 1].querySelectorAll('img[loading="lazy"]').forEach(function (im) { im.loading = "eager"; }); });
    }
  }

  // ---------- Çubuklar ----------
  var status = document.querySelector("[data-status]");
  var jump = document.querySelector("[data-jump]");
  var prevBtn = document.querySelector("[data-prev]");
  var nextBtn = document.querySelector("[data-next]");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));

  function updateChrome(announce) {
    var on = stops[stop].pages;
    if (jump) jump.value = String(on[0]);
    if (status && announce) status.textContent = (i18n.page || "") + " " + on.join("–") + " " + (i18n.of || "/") + " " + total;
    if (prevBtn) prevBtn.disabled = stop <= 0;
    if (nextBtn) nextBtn.disabled = stop >= stops.length - 1;
    var id = pages[on[0] - 1].id;
    if (history.replaceState) history.replaceState(null, "", on[0] === 1 ? location.pathname : "#" + id);
    var best = null, bestN = 0, last = on[on.length - 1];
    navLinks.forEach(function (a) {
      var t = document.getElementById(a.dataset.nav);
      var n = t ? Number(t.dataset.page) : 0;
      if (n && n <= last && n > bestN) { best = a; bestN = n; }
    });
    navLinks.forEach(function (a) { if (a === best) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
  }

  function focusOn(n) {
    var el = pages[n - 1];
    if (!el) return;
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
    book.scrollLeft = 0; book.scrollTop = 0;
  }
  function go(n, focus) { n = Math.max(1, Math.min(total, n)); travel(stopOf[n], focus ? n : 0); }
  function step(d) { travel(stop + d); }

  // ---------- Girdiler ----------
  if (prevBtn) prevBtn.addEventListener("click", function () { step(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { step(1); });
  if (jump) jump.addEventListener("change", function () { go(Number(jump.value), true); });

  document.addEventListener("keydown", function (e) {
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); step(1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); step(-1); }
    else if (e.key === "Home") { e.preventDefault(); travel(0); }
    else if (e.key === "End") { e.preventDefault(); travel(stops.length - 1); }
  });

  // Trackpad ya da yatay tekerlek: yatay kaydırma sayfa değiştirir
  var wheelLock = 0;
  book.addEventListener("wheel", function (e) {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 1.2 || Math.abs(e.deltaX) < 18) return;
    e.preventDefault();
    var now = Date.now();
    if (now < wheelLock) return;
    wheelLock = now + 750;
    step(e.deltaX > 0 ? 1 : -1);
  }, { passive: false });

  // Dokunmatik: sayfalar parmağı takip eder, bırakınca kamera bir sonraki durağa gider
  var drag = null;
  book.addEventListener("touchstart", function (e) {
    if (anim) return;
    var p = e.touches[0];
    drag = { x: p.clientX, y: p.clientY, dx: 0, dir: 0, base: cam };
  }, { passive: true });
  book.addEventListener("touchmove", function (e) {
    if (!drag) return;
    var p = e.touches[0], dx = p.clientX - drag.x, dy = p.clientY - drag.y;
    if (!drag.dir) { if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) drag.dir = 1; else if (Math.abs(dy) > 10) { drag = null; return; } }
    if (drag.dir === 1) {
      drag.dx = dx;
      var edge = (dx > 0 && stop === 0) || (dx < 0 && stop === stops.length - 1);
      var moved = edge ? dx * 0.3 : dx;
      var s = 1 - Math.min(0.08, Math.abs(moved) / 4000);
      var v = viewport();
      setCam({ x: drag.base.x + moved + (1 - s) * (v.w / 2 - drag.base.x), y: drag.base.y + (1 - s) * (v.h / 2 - drag.base.y), s: s });
    }
  }, { passive: true });
  book.addEventListener("touchend", function () {
    if (!drag) return;
    var d = drag; drag = null;
    if (d.dir !== 1) return;
    if (d.dx < -60 && stop < stops.length - 1) travel(stop + 1);
    else if (d.dx > 60 && stop > 0) travel(stop - 1);
    else travelBack();
  }, { passive: true });
  function travelBack() {
    var from = cam, to = camFor(stop);
    if (reduce.matches) { setCam(to); return; }
    anim = world.animate([{ transform: tf(from) }, { transform: tf(to) }], { duration: 260, easing: "cubic-bezier(.3,.7,.2,1)" });
    anim.onfinish = function () { anim = null; setCam(to); };
  }

  // Sayfa içi bağlantılar: ilgili sayfaya git
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var n = pageFor(a.getAttribute("href").slice(1));
    if (!n) return;
    e.preventDefault();
    go(n, true);
  });
  function pageFor(id) {
    if (!id) return 1;
    var m = /^s(\d+)$/.exec(id);
    if (m) return Number(m[1]);
    var el = document.getElementById(id);
    var pg = el && el.closest(".page");
    return pg ? Number(pg.dataset.page) : 0;
  }
  window.addEventListener("hashchange", function () { var n = pageFor(location.hash.slice(1)); if (n) go(n, true); });

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { var first = stops[stop] ? stops[stop].pages[0] : 1; layout(); jumpTo(stopOf[first]); }, 120);
  });

  // ---------- Tema ----------
  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    store("theme", next);
  });

  // ---------- Bildirim, e-posta kopyalama ----------
  var toast = document.querySelector(".toast"), toastTimer = null;
  function notify(text) {
    if (!toast || !text) return;
    toast.textContent = text; toast.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.hidden = true; }, 4000);
  }
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(b.dataset.copy).then(function () { notify(b.dataset.ok); }, function () { notify(b.dataset.fail); });
      else notify(b.dataset.fail);
    });
  });

  // ---------- Konami kodu: gizli rozet ----------
  var code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  var pos = 0;
  function unlock(announce) {
    var seal = document.getElementById("secret-badge");
    if (!seal || !seal.classList.contains("seal--locked")) return;
    seal.classList.remove("seal--locked"); seal.classList.add("seal--unlocked");
    seal.querySelector(".seal-name").textContent = i18n.secretName || "";
    seal.querySelector(".seal-how").textContent = i18n.secretHow || "";
    var star = document.getElementById("icon-star"), disc = seal.querySelector(".seal-disc");
    if (star && disc) disc.replaceChildren(star.content.cloneNode(true));
    if (announce) { notify(i18n.toastSecret); go(pageFor("rozetler")); }
  }
  if (read("secret") === "1") unlock(false);
  document.addEventListener("keydown", function (e) {
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = key === code[pos] ? pos + 1 : (key === code[0] ? 1 : 0);
    if (pos === code.length) { pos = 0; if (read("secret") !== "1") { store("secret", "1"); unlock(true); } }
  });

  // ---------- Başlat ----------
  var startPage = pageFor(location.hash.slice(1)) || 1;
  layout();
  jumpTo(stopOf[startPage]);
  if (stop === 0) pages[0].classList.add("is-fresh");
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitAll(); });
  // Kamera uzun yolculukta bütün masayı gösterebilir: ilk açılıştan sonra diğer görselleri de yükle
  window.addEventListener("load", function () {
    setTimeout(function () { document.querySelectorAll('img[loading="lazy"]').forEach(function (im) { im.loading = "eager"; }); }, 1200);
  });
})();
