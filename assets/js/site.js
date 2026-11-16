// Mod (oyun/yazılım), tema, ses, Konami kodu ve e-posta kopyalama.
// İçerik JS olmadan da tam görünür; bu dosya yalnızca etkileşim ekler.
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  var i18n = {};
  try { i18n = JSON.parse(document.getElementById("i18n").textContent); } catch (e) {}

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  // ---------- Ses: WebAudio ile kısa kare dalga, varsayılan kapalı ----------
  var audio = null;
  var soundOn = read("sound") === "on";

  function blip(freqs, dur) {
    if (!soundOn) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      var t = audio.currentTime;
      freqs.forEach(function (f, i) {
        var o = audio.createOscillator(), g = audio.createGain();
        o.type = "square";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.04, t + i * dur);
        g.gain.exponentialRampToValueAtTime(0.0001, t + (i + 1) * dur);
        o.connect(g).connect(audio.destination);
        o.start(t + i * dur);
        o.stop(t + (i + 1) * dur);
      });
    } catch (e) {}
  }

  var soundBtn = document.querySelector("[data-sound-toggle]");
  function paintSound() {
    if (!soundBtn) return;
    soundBtn.setAttribute("aria-pressed", String(soundOn));
    soundBtn.setAttribute("aria-label", soundOn ? soundBtn.dataset.labelOn : soundBtn.dataset.labelOff);
  }
  if (soundBtn) {
    paintSound();
    soundBtn.addEventListener("click", function () {
      soundOn = !soundOn;
      store("sound", soundOn ? "on" : "off");
      paintSound();
      blip([660, 990], 0.06);
    });
  }

  // ---------- Mod ----------
  var tracks = document.querySelector("[data-tracks]");

  function setLens(lens, fromUser) {
    if (lens !== "game" && lens !== "code") return;
    root.dataset.lens = lens;
    document.querySelectorAll("[data-set-lens]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.setLens === lens));
    });
    // Ana hat önce gelsin: DOM sırasını değiştir ki sekme sırası da görünüşle aynı olsun
    if (tracks) {
      var first = document.getElementById("track-" + lens);
      if (first && tracks.firstElementChild !== first) tracks.insertBefore(first, tracks.firstElementChild);
    }
    if (fromUser) {
      store("lens", lens);
      blip(lens === "game" ? [523, 784] : [784, 523], 0.07);
    }
  }
  setLens(root.dataset.lens || "game", false);

  document.querySelectorAll("[data-set-lens]").forEach(function (b) {
    b.addEventListener("click", function () {
      setLens(b.dataset.setLens, true);
      var target = b.dataset.go && document.querySelector(b.dataset.go);
      if (target) {
        target.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
        var heading = target.querySelector("h2");
        if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
      }
    });
  });

  // ---------- Tema ----------
  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      store("theme", next);
      blip([440], 0.05);
    });
  }

  // ---------- Bildirim ----------
  var toast = document.querySelector(".toast");
  var toastTimer = null;
  function notify(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 4000);
  }

  // ---------- E-posta kopyalama ----------
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var done = function () { notify(b.dataset.ok); blip([880], 0.05); };
      var fail = function () { notify(b.dataset.fail); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(b.dataset.copy).then(done, fail);
      } else fail();
    });
  });

  // ---------- Konami kodu: gizli başarım + tarama çizgileri ----------
  var code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  var pos = 0;

  function unlockSecret(announce) {
    var badge = document.getElementById("secret-badge");
    if (badge && badge.classList.contains("badge--locked")) {
      badge.classList.remove("badge--locked");
      badge.classList.add("badge--unlocked");
      badge.querySelector(".badge-name").textContent = i18n.secretName || "";
      badge.querySelector(".badge-how").textContent = i18n.secretHow || "";
      var star = document.getElementById("icon-star");
      var iconBox = badge.querySelector(".badge-icon");
      if (star && iconBox) iconBox.replaceChildren(star.content.cloneNode(true));
      document.querySelectorAll("[data-ach-count]").forEach(function (n) {
        n.textContent = String(Number(n.textContent) + 1);
      });
      if (announce) notify(i18n.toastSecret);
    }
  }
  if (read("secret") === "1") unlockSecret(false);

  document.addEventListener("keydown", function (e) {
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = key === code[pos] ? pos + 1 : (key === code[0] ? 1 : 0);
    if (pos === code.length) {
      pos = 0;
      var on = root.classList.toggle("crt");
      if (read("secret") !== "1") {
        store("secret", "1");
        unlockSecret(true);
        blip([523, 659, 784, 1047], 0.08);
      } else {
        notify(on ? i18n.crtOn : i18n.crtOff);
        blip([330, 220], 0.06);
      }
    }
  });
})();
