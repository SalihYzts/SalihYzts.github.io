// Dergi okuyucusu: sayfa düzeni, sayfa çevirme, tema, e-posta kopyalama, gizli rozet.
// JS kapalıysa sayfalar alt alta okunur; bu dosya yalnızca okuma deneyimini ekler.
(function () {
  "use strict";

  var root = document.documentElement;
  var book = document.querySelector(".book");
  var pages = Array.prototype.slice.call(document.querySelectorAll(".page"));
  var total = pages.length;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)");
  var i18n = {};
  try { i18n = JSON.parse(document.getElementById("i18n").textContent); } catch (e) {}
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  // ---------- Görünüm: açılım (iki sayfa), tek sayfa ya da telefon ----------
  var view = "";
  var current = 1;       // görünen sayfa (açılımda soldaki ya da kapak)
  var busy = false;
  var queued = null;

  function layout() {
    var w = window.innerWidth, h = window.innerHeight;
    var top = 52, bottom = 76, side = 24, gap = 16;
    var next, pw;
    if (w < 720 || h < 520) {
      next = "app";
    } else {
      var spread = Math.min((w - side * 2) / 2, (h - top - bottom - gap) / 1.25);
      if (spread >= 380) { next = "spread"; pw = spread; }
      else { next = "single"; pw = Math.min(w - side * 2, (h - top - bottom - gap) / 1.25); }
    }
    root.classList.toggle("app", next === "app");
    root.classList.toggle("print", next !== "app");
    root.dataset.view = next;
    if (pw) {
      root.style.setProperty("--pw", Math.floor(pw) + "px");
      var free = h - top - bottom - pw * 1.25;
      root.style.setProperty("--book-top", Math.max(8, Math.floor(free / 2)) + "px");
    }
    var changed = next !== view;
    view = next;
    if (changed) { fitAll(); }
    show(current, true);
  }

  // Taşan sayfayı küçült: bütün ölçüler --u'ya bağlı olduğu için oran ekran boyundan bağımsız
  function fitAll() {
    pages.forEach(function (p) { p.style.removeProperty("--fit"); });
    if (view === "app") return;
    pages.forEach(function (p) {
      var inner = p.querySelector(".page-inner");
      if (!inner) return;
      var fit = 1;
      var off = p.classList.contains("is-off");
      if (off) p.style.visibility = "hidden", p.classList.remove("is-off");
      while (inner.scrollHeight > inner.clientHeight + 2 && fit > 0.72) {
        fit = Math.round((fit - 0.03) * 100) / 100;
        p.style.setProperty("--fit", fit);
      }
      if (off) { p.classList.add("is-off"); p.style.removeProperty("visibility"); }
    });
  }

  // Bir sayfanın içinde bulunduğu açılım
  function spreadOf(n) {
    if (view !== "spread") return [n];
    if (n <= 1) return [1];
    var left = n % 2 === 0 ? n : n - 1;
    var right = left + 1;
    return right <= total && left !== total ? [left, right] : [left];
  }
  function firstOf(n) { return spreadOf(n)[0]; }

  // Sayfaları yerleştir (animasyonsuz)
  function show(n, silent) {
    n = Math.max(1, Math.min(total, n));
    current = firstOf(n);
    var visible = spreadOf(current);
    pages.forEach(function (p, i) {
      var num = i + 1;
      p.classList.remove("is-left", "is-right", "is-solo", "is-off");
      var on = visible.indexOf(num) >= 0;
      if (!on) { p.classList.add("is-off"); p.setAttribute("inert", ""); p.setAttribute("aria-hidden", "true"); return; }
      p.removeAttribute("inert"); p.removeAttribute("aria-hidden");
      if (view === "spread") p.classList.add(num === 1 || num % 2 === 1 ? "is-right" : "is-left");
      else p.classList.add("is-solo");
    });
    if (view === "app") { var cur = pages[current - 1]; if (cur) cur.scrollTop = 0; }
    updateChrome(silent);
  }

  function label(list) {
    return (i18n.page || "") + " " + list.join("–") + " " + (i18n.of || "/") + " " + total;
  }
  var status = document.querySelector("[data-status]");
  var jump = document.querySelector("[data-jump]");
  var prevBtn = document.querySelector("[data-prev]");
  var nextBtn = document.querySelector("[data-next]");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));

  function updateChrome(silent) {
    var visible = spreadOf(current);
    if (jump) jump.value = String(visible[visible.length - 1] === 1 ? 1 : visible[0]);
    if (status && !silent) status.textContent = label(visible);
    if (prevBtn) prevBtn.disabled = current <= 1;
    if (nextBtn) nextBtn.disabled = visible[visible.length - 1] >= total;
    var id = pages[current - 1].id;
    if (history.replaceState) history.replaceState(null, "", current === 1 ? location.pathname : "#" + id);
    // Üst menüde okunan bölüm
    var best = null, bestN = 0;
    navLinks.forEach(function (a) {
      var t = document.getElementById(a.dataset.nav);
      var n = t ? Number(t.dataset.page) : 0;
      if (n && n <= visible[visible.length - 1] && n > bestN) { best = a; bestN = n; }
    });
    navLinks.forEach(function (a) { a.toggleAttribute("aria-current", a === best); if (a === best) a.setAttribute("aria-current", "true"); });
  }

  // ---------- Sayfa çevirme ----------
  function cloneFace(n) {
    var src = pages[n - 1];
    if (!src) return null;
    var c = src.cloneNode(true);
    c.removeAttribute("id");
    c.querySelectorAll("[id]").forEach(function (el) { el.removeAttribute("id"); });
    c.classList.remove("is-off", "is-left", "is-right", "is-solo");
    c.setAttribute("aria-hidden", "true");
    c.setAttribute("inert", "");
    return c;
  }
  function face(cls, n, blank) {
    var f = document.createElement("div");
    f.className = "leaf-face " + cls + (blank ? " leaf-blank" : "");
    var c = n ? cloneFace(n) : null;
    if (c) f.appendChild(c);
    var s = document.createElement("div");
    s.className = "leaf-shade";
    f.appendChild(s);
    return f;
  }

  function go(target, focusPage) {
    target = Math.max(1, Math.min(total, target));
    var to = firstOf(target);
    if (busy) { queued = [target, focusPage]; return; }
    if (to === current) { if (focusPage) focusOn(target); return; }
    var forward = to > current;
    var done = function () {
      busy = false;
      show(to);
      if (focusPage) focusOn(target);
      if (queued) { var q = queued; queued = null; go(q[0], q[1]); }
    };
    if (reduce.matches || view === "app" && !("animate" in Element.prototype)) { show(to); if (focusPage) focusOn(target); return; }
    busy = true;
    if (view === "spread") turnSpread(forward, to, done);
    else if (view === "single") turnSingle(forward, to, done);
    else slide(forward, to, done);
  }

  function turnSpread(forward, to, done) {
    var from = spreadOf(current), dest = spreadOf(to);
    var leaf = document.createElement("div");
    leaf.className = "leaf";
    var pw = pages[0].getBoundingClientRect().width || 0;
    leaf.style.width = "var(--pw)"; leaf.style.height = "var(--ph)";
    var frontN, backN;
    if (forward) {
      frontN = from[from.length - 1] === 1 ? 1 : (from[1] || from[0]);
      backN = dest[0];
      leaf.style.left = "var(--pw)"; leaf.style.transformOrigin = "left center";
      // Altta: hedef açılımın sağ sayfası
      placeUnder(from.length > 1 ? from[0] : null, dest[1] || null);
    } else {
      frontN = from[0];
      backN = dest[1] || dest[0];
      leaf.style.left = "0"; leaf.style.transformOrigin = "right center";
      placeUnder(dest.length > 1 ? dest[0] : null, from.length > 1 ? from[1] : (from[0] === 1 ? 1 : null));
    }
    var front = face("leaf-front", frontN), back = face("leaf-back", backN);
    leaf.appendChild(front); leaf.appendChild(back);
    book.appendChild(leaf);
    var angle = forward ? -180 : 180;
    var anim = leaf.animate([{ transform: "rotateY(0deg)" }, { transform: "rotateY(" + angle + "deg)" }], { duration: 900, easing: "cubic-bezier(.62,.04,.3,1)" });
    front.querySelector(".leaf-shade").animate([{ opacity: 0 }, { opacity: 0.9 }], { duration: 900, easing: "ease-in" });
    back.querySelector(".leaf-shade").animate([{ opacity: 0.9 }, { opacity: 0 }], { duration: 900, easing: "ease-out" });
    anim.onfinish = function () { leaf.remove(); done(); };
  }

  // Çevirme sırasında altta görünecek sayfalar
  function placeUnder(leftN, rightN) {
    pages.forEach(function (p, i) {
      var n = i + 1;
      p.classList.remove("is-left", "is-right", "is-solo");
      if (n === leftN) { p.classList.remove("is-off"); p.classList.add("is-left"); }
      else if (n === rightN) { p.classList.remove("is-off"); p.classList.add("is-right"); }
      else p.classList.add("is-off");
    });
  }

  function turnSingle(forward, to, done) {
    var leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.width = "var(--pw)"; leaf.style.height = "var(--ph)"; leaf.style.left = "0"; leaf.style.transformOrigin = "left center";
    var frontN = forward ? current : to;
    var underN = forward ? to : current;
    pages.forEach(function (p, i) { p.classList.remove("is-solo"); p.classList.toggle("is-off", i + 1 !== underN); if (i + 1 === underN) p.classList.add("is-solo"); });
    var front = face("leaf-front", frontN), back = face("leaf-back", null, true);
    leaf.appendChild(front); leaf.appendChild(back);
    book.appendChild(leaf);
    var kf = forward ? [{ transform: "rotateY(0deg)" }, { transform: "rotateY(-180deg)", opacity: 0.4 }] : [{ transform: "rotateY(-180deg)", opacity: 0.4 }, { transform: "rotateY(0deg)" }];
    var anim = leaf.animate(kf, { duration: 750, easing: "cubic-bezier(.62,.04,.3,1)" });
    anim.onfinish = function () { leaf.remove(); done(); };
  }

  function slide(forward, to, done) {
    var a = pages[current - 1], b = pages[to - 1];
    b.classList.remove("is-off"); b.classList.add("is-solo"); b.scrollTop = 0;
    var dir = forward ? 1 : -1;
    a.animate([{ transform: "translateX(0)", filter: "brightness(1)" }, { transform: "translateX(" + (-30 * dir) + "%)", filter: "brightness(.7)" }], { duration: 380, easing: "cubic-bezier(.3,.7,.2,1)" });
    var anim = b.animate([{ transform: "translateX(" + (100 * dir) + "%)", boxShadow: "-20px 0 40px rgb(0 0 0 / .3)" }, { transform: "translateX(0)", boxShadow: "0 0 0 rgb(0 0 0 / 0)" }], { duration: 380, easing: "cubic-bezier(.3,.7,.2,1)" });
    b.style.zIndex = 3;
    anim.onfinish = function () { b.style.zIndex = ""; done(); };
  }

  function focusOn(n) {
    var el = pages[n - 1];
    if (!el) return;
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }

  function step(dir) {
    var visible = spreadOf(current);
    if (dir > 0) go(visible[visible.length - 1] + 1);
    else go(current - 1);
  }

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
    else if (e.key === "Home") { e.preventDefault(); go(1); }
    else if (e.key === "End") { e.preventDefault(); go(total); }
  });

  // Kaydırarak çevirme (telefon ve dokunmatik ekran)
  var sx = 0, sy = 0, st = 0;
  book.addEventListener("touchstart", function (e) { var p = e.changedTouches[0]; sx = p.clientX; sy = p.clientY; st = Date.now(); }, { passive: true });
  book.addEventListener("touchend", function (e) {
    var p = e.changedTouches[0], dx = p.clientX - sx, dy = p.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - st < 800) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  // Sayfa içi bağlantılar: ilgili sayfayı aç
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    var n = pageFor(id);
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
  window.addEventListener("resize", function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(layout, 120); });

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
  var startN = pageFor(location.hash.slice(1)) || 1;
  current = startN;
  layout();
  if (current === 1) { pages[0].classList.add("is-fresh"); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitAll(); });
})();
