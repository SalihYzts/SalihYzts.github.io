// Tema, aktif bölüm vurgusu, e-posta kopyalama ve gizli rozet.
// İçerik JS olmadan da tam görünür; bu dosya yalnızca etkileşim ekler.
(function () {
  "use strict";

  var root = document.documentElement;
  var i18n = {};
  try { i18n = JSON.parse(document.getElementById("i18n").textContent); } catch (e) {}
  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

  // ---------- Gündüz / gece baskısı ----------
  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      store("theme", next);
    });
  }

  // ---------- Üst menüde okunan bölümü işaretle ----------
  var navLinks = {};
  document.querySelectorAll("[data-nav]").forEach(function (a) { navLinks[a.dataset.nav] = a; });
  if ("IntersectionObserver" in window) {
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        if (current && navLinks[current]) navLinks[current].removeAttribute("aria-current");
        if (navLinks[id]) { navLinks[id].setAttribute("aria-current", "true"); current = id; }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(navLinks).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  // ---------- Bildirim ----------
  var toast = document.querySelector(".toast");
  var toastTimer = null;
  function notify(text) {
    if (!toast || !text) return;
    toast.textContent = text;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 4000);
  }

  // ---------- E-posta kopyalama ----------
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var done = function () { notify(b.dataset.ok); };
      var fail = function () { notify(b.dataset.fail); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(b.dataset.copy).then(done, fail);
      else fail();
    });
  });

  // ---------- Konami kodu: gizli rozet ----------
  var code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  var pos = 0;
  function unlock(announce) {
    var seal = document.getElementById("secret-badge");
    if (!seal || !seal.classList.contains("seal--locked")) return;
    seal.classList.remove("seal--locked");
    seal.classList.add("seal--unlocked");
    seal.querySelector(".seal-name").textContent = i18n.secretName || "";
    seal.querySelector(".seal-how").textContent = i18n.secretHow || "";
    var star = document.getElementById("icon-star");
    var disc = seal.querySelector(".seal-disc");
    if (star && disc) disc.replaceChildren(star.content.cloneNode(true));
    if (announce) notify(i18n.toastSecret);
  }
  if (read("secret") === "1") unlock(false);
  document.addEventListener("keydown", function (e) {
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = key === code[pos] ? pos + 1 : (key === code[0] ? 1 : 0);
    if (pos === code.length) {
      pos = 0;
      if (read("secret") !== "1") { store("secret", "1"); unlock(true); }
    }
  });
})();
