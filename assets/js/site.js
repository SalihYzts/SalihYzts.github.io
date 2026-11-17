// Dergi okuyucusu: açılım (masaüstü) ya da tek sayfa (telefon) ekranı doldurur, sayfalar çevrilerek değişir.
// Çevirme sırasında sahne hafifçe geri çekilip yaklaşır. JS kapalıysa sayfalar alt alta okunur.
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

  var TOP = 52, BAR = 48, FIT_MIN = 0.76;
  var view = "";
  var current = 1;
  var busy = false, queued = null, running = [], pendingTo = 1;

  // ---------- Görünüm ve boyut: sayfa ekranı doldurur ----------
  function layout() {
    var w = window.innerWidth, h = window.innerHeight;
    var m = 10, pw, ph;
    // Eşik, boyamadan önce çalışan baş betiğiyle aynı
    if (w < 720 || h < 512) { view = "app"; pw = w; ph = h - TOP; }
    else {
      h -= BAR; // alttaki ince şerit
      var spread = Math.floor(Math.min((w - m * 2) / 2, (h - m * 2) / 1.25));
      if (spread >= 360) { view = "spread"; pw = spread; }
      else { view = "single"; pw = Math.floor(Math.min(w - m * 2, (h - m * 2) / 1.25)); }
      ph = Math.round(pw * 1.25);
    }
    root.classList.toggle("app", view === "app");
    root.classList.toggle("print", view !== "app");
    root.dataset.view = view;
    root.style.setProperty("--pw", pw + "px");
    root.style.setProperty("--ph", ph + "px");
    fitAll();
    show(current, true);
  }

  // Taşan sayfayı küçült (gövde yazısının piksel tabanı var, küçülen başlık ve boşluklar);
  // yine de sığmazsa sayfa kendi içinde kayar
  function fitAll() {
    pages.forEach(function (p) {
      p.style.removeProperty("--fit"); p.classList.remove("is-scroll");
      // Telefonda sayfanın kendisi kayar
      if (view === "app") p.setAttribute("tabindex", "0"); else p.removeAttribute("tabindex");
    });
    if (view === "app") return;
    pages.forEach(function (p) {
      var inner = p.querySelector(".page-inner");
      var off = p.classList.contains("is-off");
      if (off) { p.classList.remove("is-off"); p.style.visibility = "hidden"; }
      var fit = 1;
      while (inner && inner.scrollHeight > inner.clientHeight + 2 && fit > FIT_MIN) {
        fit = Math.round((fit - 0.03) * 100) / 100;
        p.style.setProperty("--fit", fit);
      }
      var scroll = inner && inner.scrollHeight > inner.clientHeight + 2;
      p.classList.toggle("is-scroll", !!scroll);
      // Kayan alan klavyeyle de kaydırılabilsin
      if (scroll) inner.setAttribute("tabindex", "0"); else if (inner) inner.removeAttribute("tabindex");
      if (inner) p.classList.toggle("at-end", !scroll);
      if (off) { p.classList.add("is-off"); p.style.removeProperty("visibility"); }
    });
  }

  // Kayan sayfanın altındaki "devamı" işareti sona gelince kalkar
  pages.forEach(function (p) {
    var inner = p.querySelector(".page-inner");
    if (inner) inner.addEventListener("scroll", function () {
      p.classList.toggle("at-end", inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 4);
    }, { passive: true });
  });

  // ---------- Açılımlar ----------
  function spreadOf(n) {
    if (view !== "spread") return [n];
    if (n <= 1) return [1];
    var left = n % 2 === 0 ? n : n - 1;
    return left + 1 <= total && left !== total ? [left, left + 1] : [left];
  }
  function firstOf(n) { return spreadOf(n)[0]; }

  // Sayfaları yerleştir (animasyonsuz)
  function show(n, silent) {
    current = firstOf(Math.max(1, Math.min(total, n)));
    var on = spreadOf(current);
    pages.forEach(function (p, i) {
      var num = i + 1;
      p.classList.remove("is-left", "is-right", "is-off");
      if (on.indexOf(num) < 0) { p.classList.add("is-off"); p.setAttribute("inert", ""); p.setAttribute("aria-hidden", "true"); return; }
      p.removeAttribute("inert"); p.removeAttribute("aria-hidden");
      if (view === "spread") p.classList.add(num !== 1 && num % 2 === 0 ? "is-left" : "is-right");
    });
    frame(on);
    root.classList.toggle("on-cover", current === 1);
    on.forEach(function (n) { pages[n - 1].scrollTop = 0; var inner = pages[n - 1].querySelector(".page-inner"); if (inner) inner.scrollTop = 0; });
    loadNear();
    updateChrome(!silent);
  }
  function loadNear() {
    for (var n = current - 2; n <= current + 3; n++) imagesOf(n).forEach(function (im) { im.loading = "eager"; });
  }
  function imagesOf(n) {
    var p = pages[n - 1];
    return p ? Array.prototype.slice.call(p.querySelectorAll("img")) : [];
  }
  // Çevirmeden önce hedef sayfanın görselleri çözülsün; yavaş ağda en çok 250 ms bekle
  function ready(list, cb) {
    var imgs = [];
    list.forEach(function (n) { imagesOf(n).forEach(function (im) { im.loading = "eager"; if (im.decode) imgs.push(im.decode().catch(function () {})); }); });
    if (!imgs.length || !window.Promise) { cb(); return; }
    var called = false, once = function () { if (!called) { called = true; cb(); } };
    Promise.all(imgs).then(once);
    setTimeout(once, 250);
  }

  // ---------- Çubuklar ----------
  var status = document.querySelector("[data-status]");
  var jump = document.querySelector("[data-jump]");
  var prevBtn = document.querySelector("[data-prev]");
  var nextBtn = document.querySelector("[data-next]");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  function updateChrome(announce) {
    var on = spreadOf(current), last = on[on.length - 1];
    if (jump) jump.value = String(on[0]);
    if (status && announce) status.textContent = (i18n.page || "") + " " + on.join("–") + " " + (i18n.of || "/") + " " + total;
    if (prevBtn) prevBtn.disabled = current <= 1;
    if (nextBtn) nextBtn.disabled = last >= total;
    if (history.replaceState) history.replaceState(null, "", current === 1 ? location.pathname : "#" + pages[current - 1].id);
    // Görünen açılımda başlayan bölüm öne çıkar; yoksa içinde bulunulan bölüm
    var best = null, bestN = 0;
    navLinks.forEach(function (a) {
      var n = pageFor(a.dataset.nav);
      var visible = on.indexOf(n) >= 0;
      if (n > 1 && (visible || n <= on[0]) && (visible ? n + 1000 : n) > bestN) { best = a; bestN = visible ? n + 1000 : n; }
    });
    navLinks.forEach(function (a) { if (a === best) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
  }

  // ---------- Sayfa çevirme ----------
  function cloneOf(n) {
    var src = pages[n - 1];
    if (!src) return null;
    var c = src.cloneNode(true);
    c.removeAttribute("id");
    c.querySelectorAll("[id]").forEach(function (el) { el.removeAttribute("id"); });
    c.classList.remove("is-off", "is-left", "is-right");
    c.setAttribute("aria-hidden", "true");
    c.setAttribute("inert", "");
    c.scrollTop = 0;
    return c;
  }
  function face(cls, n) {
    var f = document.createElement("div");
    f.className = "leaf-face " + cls + (n ? "" : " leaf-blank");
    var c = n ? cloneOf(n) : null;
    if (c) f.appendChild(c);
    var s = document.createElement("div");
    s.className = "leaf-shade";
    f.appendChild(s);
    return f;
  }
  // Çevirme sırasında altta görünecek sayfalar
  function under(list) {
    pages.forEach(function (p, i) {
      var n = i + 1, hit = null;
      list.forEach(function (x) { if (x.n === n) hit = x.slot; });
      p.classList.remove("is-left", "is-right");
      if (hit) { p.classList.remove("is-off"); p.classList.add(hit); } else p.classList.add("is-off");
    });
  }
  // Tek sayfalık durakta sahneyi o sayfaya ortala (kapak sağda, arka kapak solda)
  function frame(on) {
    var single = view === "spread" && on.length === 1;
    world.classList.toggle("shift-cover", single && on[0] === 1);
    world.classList.toggle("shift-back", single && on[0] !== 1);
  }
  // Sahne hafifçe geri çekilip yaklaşır: sayfanın elde çevrildiği hissi
  function breathe(duration, depth) {
    return world.animate([{ transform: "scale(1)" }, { transform: "scale(" + depth + ")", offset: 0.45 }, { transform: "scale(1)" }], { duration: duration, easing: "cubic-bezier(.45,0,.35,1)" });
  }

  // Çevirme sürerken gelen yeni istek beklemez: süren yaprak hemen yerine oturur, sonra yenisi çevrilir
  function go(target, focusPage, instant) {
    target = Math.max(1, Math.min(total, target));
    var to = firstOf(target);
    if (busy) {
      queued = [target, focusPage, instant];
      running.forEach(function (a) { try { a.finish(); } catch (e) {} });
      return;
    }
    if (to === current) { if (focusPage) focusOn(target); return; }
    var forward = to > current;
    var finish = function () {
      running = [];
      busy = false;
      show(to);
      if (focusPage) focusOn(target);
      if (queued) { var q = queued; queued = null; go(q[0], q[1], q[2]); }
    };
    if (!("animate" in Element.prototype)) { show(to); if (focusPage) focusOn(target); return; }
    // Basılı tutulan tuş: animasyonsuz geç
    if (instant) { show(to); if (focusPage) focusOn(target); return; }
    // Hareket azaltma: çevirme yerine kısa bir geçiş
    if (reduce.matches) {
      show(to);
      world.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 180, easing: "ease-out" });
      if (focusPage) focusOn(target);
      return;
    }
    busy = true;
    pendingTo = to;
    var far = Math.abs(to - current) > 2;
    ready(spreadOf(to), function () {
      if (view === "spread") turnSpread(forward, to, far, finish);
      else turnSingle(forward, to, far, finish);
    });
  }

  function turnSpread(forward, to, far, done) {
    var from = spreadOf(current), dest = spreadOf(to);
    var leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.width = "var(--pw)"; leaf.style.height = "var(--ph)";
    var frontN, backN;
    // Tek sayfalık durak (kapak) ortada durur; yaprak yine sırttan döner
    if (forward) {
      frontN = from.length === 2 ? from[1] : from[0];
      backN = dest[0];
      leaf.style.left = "var(--pw)"; leaf.style.transformOrigin = "left center";
      under([{ n: from.length === 2 ? from[0] : -1, slot: "is-left" }, { n: dest[1] || -1, slot: "is-right" }]);
    } else {
      frontN = from[0];
      backN = dest.length === 2 ? dest[1] : dest[0];
      leaf.style.left = "0"; leaf.style.transformOrigin = "right center";
      under([{ n: dest.length === 2 ? dest[0] : -1, slot: "is-left" }, { n: from.length === 2 ? from[1] : -1, slot: "is-right" }]);
    }
    var front = face("leaf-front", frontN), back = face("leaf-back", backN);
    leaf.appendChild(front); leaf.appendChild(back);
    world.appendChild(leaf);
    frame(dest);
    var d = far ? 1100 : 900;
    var b = breathe(d, far ? 0.9 : 0.955);
    var anim = leaf.animate([{ transform: "rotateY(0deg)" }, { transform: "rotateY(" + (forward ? -180 : 180) + "deg)" }], { duration: d, easing: "cubic-bezier(.62,.04,.3,1)" });
    var s1 = front.querySelector(".leaf-shade").animate([{ opacity: 0 }, { opacity: 0.85 }], { duration: d, easing: "ease-in" });
    var s2 = back.querySelector(".leaf-shade").animate([{ opacity: 0.85 }, { opacity: 0 }], { duration: d, easing: "ease-out" });
    running = [b, s1, s2, anim];
    anim.onfinish = function () { leaf.remove(); done(); };
  }

  // Tek sayfa: ileri giderken sayfa sol kenarından dönerek kalkar, geri gelirken soldan kapanır
  function turnSingle(forward, to, far, done) {
    var leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.width = "var(--pw)"; leaf.style.height = "var(--ph)"; leaf.style.left = "0"; leaf.style.transformOrigin = "left center";
    var underN = forward ? to : current;
    under([{ n: underN, slot: "is-solo" }]);
    var front = face("leaf-front", forward ? current : to), back = face("leaf-back", null);
    leaf.appendChild(front); leaf.appendChild(back);
    world.appendChild(leaf);
    var d = view === "app" ? 620 : 800;
    var b = breathe(d, far ? 0.9 : 0.96);
    var kf = forward
      ? [{ transform: "rotateY(0deg)" }, { transform: "rotateY(-100deg)", opacity: 0.2 }]
      : [{ transform: "rotateY(-100deg)", opacity: 0.2 }, { transform: "rotateY(0deg)" }];
    var anim = leaf.animate(kf, { duration: d, easing: "cubic-bezier(.62,.04,.3,1)" });
    var s1 = front.querySelector(".leaf-shade").animate(forward ? [{ opacity: 0 }, { opacity: 0.8 }] : [{ opacity: 0.8 }, { opacity: 0 }], { duration: d });
    running = [b, s1, anim];
    anim.onfinish = function () { leaf.remove(); done(); };
  }

  // Ekran okuyucu ve klavye için odak, açılan sayfanın ilk başlığına gider
  function focusOn(n) {
    var page = pages[n - 1];
    if (!page) return;
    var el = page.querySelector("h1, h2, h3") || page;
    if (el !== page) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
    book.scrollTop = 0; book.scrollLeft = 0;
  }
  function step(d, instant) {
    // Çevirme sürerken basılırsa hedef, kuyruktaki sayfadan hesaplanır
    var base = busy && queued ? firstOf(queued[0]) : busy ? pendingTo : current;
    var on = spreadOf(base);
    go(d > 0 ? on[on.length - 1] + 1 : base - 1, false, instant);
  }

  // ---------- Girdiler ----------
  if (prevBtn) prevBtn.addEventListener("click", function () { step(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { step(1); });
  if (jump) jump.addEventListener("change", function () { go(Number(jump.value), true); });
  document.addEventListener("keydown", function (e) {
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); step(1, e.repeat); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); step(-1, e.repeat); }
    else if (e.key === "Home") { e.preventDefault(); go(1); }
    else if (e.key === "End") { e.preventDefault(); go(total); }
  });
  // Trackpad: yatay kaydırma sayfa çevirir
  var wheelLock = 0;
  book.addEventListener("wheel", function (e) {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 1.2 || Math.abs(e.deltaX) < 18) return;
    e.preventDefault();
    if (Date.now() < wheelLock) return;
    wheelLock = Date.now() + 600;
    step(e.deltaX > 0 ? 1 : -1);
  }, { passive: false });
  // Dokunmatik: yatay kaydırma sayfa çevirir, dikey kaydırma sayfanın içinde kalır
  var sx = 0, sy = 0, st = 0;
  book.addEventListener("touchstart", function (e) { var p = e.changedTouches[0]; sx = p.clientX; sy = p.clientY; st = Date.now(); }, { passive: true });
  book.addEventListener("touchend", function (e) {
    var p = e.changedTouches[0], dx = p.clientX - sx, dy = p.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - st < 900) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  // Sayfa içi bağlantılar: ilgili sayfayı çevirerek aç
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
  current = pageFor(location.hash.slice(1)) || 1;
  layout();
  if (current === 1) pages[0].classList.add("is-fresh");
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitAll(); });
})();
