// Proje paneli arayüzü. Veri: /api/projects (data/projects.json)
(function () {
  "use strict";

  // Erişim anahtarı adresin # kısmında gelir; sunucuya hiç gönderilmez, sekme kapanınca silinir
  var m = /[#&]t=([0-9a-f]+)/.exec(location.hash);
  if (m) { sessionStorage.setItem("panel-token", m[1]); history.replaceState(null, "", location.pathname); }
  var TOKEN = sessionStorage.getItem("panel-token") || "";

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var data = null, sel = 0, dirty = false;

  var TRACK = { game: "Oyunlar", code: "Yazılım" };
  var TIER = { featured: "Öne çıkan (geniş)", card: "Kart", compact: "Kompakt" };
  var TIER_SHORT = { featured: "Öne çıkan", card: "Kart", compact: "Kompakt" };
  var ART = { "": "Yok", counter: "Dükkân tezgâhı", dawn: "Gün doğumu", parcel: "Arsa parseli", pipeline: "Sipariş akışı", chat: "Sohbet → tablo", tasks: "Görev listesi" };
  var LINK = { play: "Oyna (itch.io)", open: "Siteyi aç", source: "Kaynak kod", release: "İndir" };

  // ---------- API ----------
  function call(method, url, body, raw) {
    var opts = { method: method, headers: { "X-Admin-Token": TOKEN } };
    if (body !== undefined) {
      opts.body = raw ? body : JSON.stringify(body);
      if (!raw) opts.headers["Content-Type"] = "application/json";
    }
    return fetch(url, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { j._status = r.status; return j; });
    });
  }

  function status(text, bad) {
    var s = $("#status");
    s.textContent = text;
    s.classList.toggle("is-bad", !!bad);
  }

  function setDirty(v) {
    dirty = v;
    $("#btn-save").disabled = !v;
    document.title = (v ? "● " : "") + "Proje paneli · Salih Yazıtaş";
  }

  function refreshGit() {
    return call("GET", "/api/git").then(function (g) {
      if (g._status !== 200) return;
      var n = g.changes ? g.changes.split("\n").length : 0;
      $("#git").textContent = "Dal: " + g.branch + " · " + (n ? n + " değişmiş dosya" : "temiz") +
        (g.ahead ? " · " + g.ahead + " commit gönderilmedi" : "");
      $("#git").dataset.changes = g.changes || "";
      $("#git").dataset.branch = g.branch;
      $("#git").dataset.ahead = g.ahead || 0;
    });
  }

  // ---------- Yardımcılar ----------
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") e.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] === true) e.setAttribute(k, "");
      else if (attrs[k] !== false && attrs[k] != null) e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.append(c); });
    return e;
  }
  function pair() { return { tr: "", en: "" }; }
  function cur() { return data.projects[sel]; }
  function changed(rerenderList) { setDirty(true); if (rerenderList) renderList(); }
  var uid = 0;
  function nid(p) { return "f" + (++uid) + "-" + p; }

  // ---------- Liste ----------
  function renderList() {
    var box = $("#list");
    box.replaceChildren();
    ["game", "code"].forEach(function (track) {
      var items = data.projects.map(function (p, i) { return { p: p, i: i }; }).filter(function (x) { return x.p.track === track; });
      box.append(el("h2", { class: "list-h", text: TRACK[track] + " (" + items.length + ")" }));
      var ul = el("ul", { class: "rows" });
      items.forEach(function (x, k) {
        var p = x.p;
        ul.append(el("li", { class: "row" + (x.i === sel ? " is-sel" : "") + (p.hidden ? " is-hidden" : "") }, [
          el("button", { type: "button", class: "row-main", "aria-current": x.i === sel ? "true" : false, onclick: function () { select(x.i); } }, [
            el("span", { class: "row-title", text: p.title || "(adsız)" }),
            el("span", { class: "row-meta", text: TIER_SHORT[p.tier] + (p.hidden ? " · gizli" : "") + (p.image ? "" : " · görsel yok") }),
          ]),
          el("button", { type: "button", class: "icon", "aria-label": p.title + " yukarı taşı", disabled: k === 0, onclick: function () { move(x.i, items[k - 1].i); } }, [document.createTextNode("↑")]),
          el("button", { type: "button", class: "icon", "aria-label": p.title + " aşağı taşı", disabled: k === items.length - 1, onclick: function () { move(x.i, items[k + 1].i); } }, [document.createTextNode("↓")]),
        ]));
      });
      box.append(ul);
    });
  }

  function move(from, to) {
    var list = data.projects;
    var a = list[from];
    list[from] = list[to];
    list[to] = a;
    if (sel === from) sel = to; else if (sel === to) sel = from;
    changed(true);
  }

  function select(i) {
    sel = i;
    renderList();
    renderEditor();
    $("#editor").focus({ preventScroll: true });
  }

  // ---------- Form parçaları ----------
  function text(label, get, set, opts) {
    opts = opts || {};
    var id = nid("t");
    var input = el(opts.multiline ? "textarea" : "input", { id: id, rows: opts.rows || 3, placeholder: opts.placeholder || "" });
    input.value = get() || "";
    input.addEventListener("input", function () { set(input.value); changed(opts.list); });
    return el("div", { class: "field" }, [el("label", { for: id, text: label }), input, opts.hint ? el("small", { text: opts.hint }) : null]);
  }

  function bi(label, obj, key, opts) {
    opts = opts || {};
    if (!obj[key]) obj[key] = pair();
    return el("fieldset", { class: "bi" }, [
      el("legend", { text: label }),
      text("TR", function () { return obj[key].tr; }, function (v) { obj[key].tr = v; }, opts),
      text("EN", function () { return obj[key].en; }, function (v) { obj[key].en = v; }, opts),
    ]);
  }

  function select_(label, value, options, onchange) {
    var id = nid("s");
    var s = el("select", { id: id });
    Object.keys(options).forEach(function (k) { s.append(el("option", { value: k, text: options[k], selected: k === value })); });
    s.addEventListener("change", function () { onchange(s.value); });
    return el("div", { class: "field" }, [el("label", { for: id, text: label }), s]);
  }

  function upload(label, onDone) {
    var id = nid("u");
    var input = el("input", { type: "file", id: id, accept: "image/*", class: "sr" });
    input.addEventListener("change", function () {
      var f = input.files[0];
      if (!f) return;
      status("Görsel yükleniyor ve WebP'ye çevriliyor…");
      f.arrayBuffer().then(function (buf) {
        return call("POST", "/api/upload?name=" + encodeURIComponent(f.name), buf, true);
      }).then(function (r) {
        if (r._status !== 200) return status(r.error || "Görsel yüklenemedi", true);
        status("Görsel eklendi: " + r.src + " (" + r.w + "×" + r.h + "). Kaydetmeyi unutma.");
        onDone(r);
      });
    });
    return el("span", {}, [input, el("label", { for: id, class: "btn btn--small", text: label })]);
  }

  // ---------- Düzenleyici ----------
  function renderEditor() {
    var p = cur();
    var ed = $("#editor");
    ed.replaceChildren();
    if (!p) { ed.append(el("p", { text: "Soldan bir proje seç ya da yeni proje ekle." })); return; }

    ed.append(el("div", { class: "ed-head" }, [
      el("h1", { text: p.title || "(adsız)" }),
      el("label", { class: "check" }, [
        (function () { var c = el("input", { type: "checkbox" }); c.checked = p.hidden; c.addEventListener("change", function () { p.hidden = c.checked; changed(true); }); return c; })(),
        document.createTextNode(" Sitede gizle"),
      ]),
    ]));

    ed.append(el("section", { class: "grp" }, [
      el("h2", { text: "Temel bilgiler" }),
      el("div", { class: "grid3" }, [
        text("Ad", function () { return p.title; }, function (v) { p.title = v; $(".ed-head h1").textContent = v || "(adsız)"; }, { list: true }),
        text("Kimlik (adres parçası)", function () { return p.id; }, function (v) { p.id = v; }, { hint: "Küçük harf, rakam ve tire: kralin-sozu" }),
        select_("Hat", p.track, TRACK, function (v) { p.track = v; changed(true); }),
        select_("Kart türü", p.tier, TIER, function (v) { p.tier = v; changed(true); }),
      ]),
      bi("Alt başlık (isteğe bağlı)", p, "subtitle"),
      bi("Tür ve rol", p, "kind", { placeholder: "Tek kişilik oyun" }),
      bi("Tarih", p, "date", { placeholder: "Ekim 2026" }),
      bi("Tek cümlelik tanıtım", p, "pitch", { multiline: true }),
    ]));

    // Maddeler
    ed.append(el("section", { class: "grp" }, [
      el("h2", { text: "Öne çıkan maddeler" }),
      el("p", { class: "muted", text: "Her satır bir madde. Kompakt kartlarda gösterilmez." }),
      el("fieldset", { class: "bi" }, [
        el("legend", { class: "sr", text: "Maddeler" }),
        text("TR", function () { return p.points.tr.join("\n"); }, function (v) { p.points.tr = v.split("\n").map(function (s) { return s.trim(); }).filter(Boolean); }, { multiline: true, rows: 4 }),
        text("EN", function () { return p.points.en.join("\n"); }, function (v) { p.points.en = v.split("\n").map(function (s) { return s.trim(); }).filter(Boolean); }, { multiline: true, rows: 4 }),
      ]),
    ]));

    // İstatistikler
    var statBox = el("div", { class: "rows-edit" });
    function drawStats() {
      statBox.replaceChildren();
      p.stats.forEach(function (s, i) {
        statBox.append(el("div", { class: "stat-row" }, [
          text("Ad (TR)", function () { return s.k.tr; }, function (v) { s.k.tr = v; }),
          text("Ad (EN)", function () { return s.k.en; }, function (v) { s.k.en = v; }),
          text("Değer (TR)", function () { return s.v.tr; }, function (v) { s.v.tr = v; }),
          text("Değer (EN)", function () { return s.v.en; }, function (v) { s.v.en = v; }),
          el("button", { type: "button", class: "icon", "aria-label": "Bu istatistiği sil", onclick: function () { p.stats.splice(i, 1); changed(); drawStats(); } }, [document.createTextNode("×")]),
        ]));
      });
    }
    drawStats();
    ed.append(el("section", { class: "grp" }, [
      el("h2", { text: "İstatistikler" }),
      el("p", { class: "muted", text: "Sitede noktalı çizgili satırlar olarak görünür: Test ........ 614" }),
      statBox,
      el("button", { type: "button", class: "btn btn--small", text: "İstatistik ekle", onclick: function () { p.stats.push({ k: pair(), v: pair() }); changed(); drawStats(); } }),
    ]));

    // Teknolojiler
    ed.append(el("section", { class: "grp" }, [
      el("h2", { text: "Envanter (teknolojiler)" }),
      text("Virgülle ayır", function () { return p.tech.join(", "); }, function (v) { p.tech = v.split(",").map(function (s) { return s.trim(); }).filter(Boolean); }),
    ]));

    // Görsel
    var imgBox = el("div");
    function drawImage() {
      imgBox.replaceChildren();
      if (p.image) {
        imgBox.append(
          el("div", { class: "img-row" }, [
            el("img", { src: "/assets/img/" + p.image.src + "?v=" + Date.now(), alt: "", class: "thumb" }),
            el("div", {}, [
              el("p", { class: "muted", text: p.image.src + " · " + p.image.w + "×" + p.image.h }),
              upload("Görseli değiştir", function (r) { p.image.src = r.src; p.image.w = r.w; p.image.h = r.h; changed(true); drawImage(); }),
              el("button", { type: "button", class: "btn btn--small btn--danger", text: "Görseli kaldır", onclick: function () { p.image = null; changed(true); drawImage(); } }),
            ]),
          ]),
          bi("Görsel açıklaması (alt metin, ekran okuyucular için)", p.image, "alt")
        );
      } else {
        imgBox.append(
          el("p", { class: "muted", text: "Görsel yok. Görsel yükle ya da yerine bir çizim seç." }),
          upload("Görsel yükle", function (r) { p.image = { src: r.src, w: r.w, h: r.h, alt: pair() }; p.art = null; changed(true); drawImage(); }),
          select_("Görsel yerine çizim", p.art || "", ART, function (v) { p.art = v || null; changed(); })
        );
      }
    }
    drawImage();
    ed.append(el("section", { class: "grp" }, [el("h2", { text: "Görsel" }), imgBox]));

    // Galeri
    var galBox = el("div", { class: "gallery" });
    function drawGallery() {
      galBox.replaceChildren();
      p.gallery.forEach(function (g, i) {
        galBox.append(el("div", { class: "gal-item" }, [
          el("img", { src: "/assets/img/" + g.src, alt: "", class: "thumb thumb--sm" }),
          bi("Açıklama", g, "alt"),
          el("button", { type: "button", class: "btn btn--small btn--danger", text: "Kaldır", onclick: function () { p.gallery.splice(i, 1); changed(); drawGallery(); } }),
        ]));
      });
    }
    drawGallery();
    ed.append(el("section", { class: "grp" }, [
      el("h2", { text: "Galeri (yalnızca öne çıkan kartlarda)" }),
      galBox,
      upload("Galeriye görsel ekle", function (r) { p.gallery.push({ src: r.src, w: r.w, h: r.h, alt: pair() }); changed(); drawGallery(); }),
    ]));

    // Bağlantılar
    var linkBox = el("div", { class: "rows-edit" });
    function drawLinks() {
      linkBox.replaceChildren();
      p.links.forEach(function (l, i) {
        linkBox.append(el("div", { class: "link-row" }, [
          select_("Tür", l.label, LINK, function (v) { l.label = v; changed(); }),
          text("Adres", function () { return l.href; }, function (v) { l.href = v.trim(); }, { placeholder: "https://…" }),
          el("button", { type: "button", class: "icon", "aria-label": "Bu bağlantıyı sil", onclick: function () { p.links.splice(i, 1); changed(); drawLinks(); } }, [document.createTextNode("×")]),
        ]));
      });
    }
    drawLinks();
    ed.append(el("section", { class: "grp" }, [
      el("h2", { text: "Bağlantılar" }),
      el("p", { class: "muted", text: "İlk bağlantı vurgulu düğme olur. Gizli repolara bağlantı verme." }),
      linkBox,
      el("button", { type: "button", class: "btn btn--small", text: "Bağlantı ekle", onclick: function () { p.links.push({ label: "open", href: "" }); changed(); drawLinks(); } }),
    ]));

    ed.append(el("section", { class: "grp grp--danger" }, [
      el("button", { type: "button", class: "btn btn--danger", text: "Projeyi sil", onclick: function () {
        if (!confirm("\"" + (p.title || "adsız") + "\" silinsin mi? Kaydedene kadar geri alabilirsin (sayfayı yenile).")) return;
        data.projects.splice(sel, 1);
        sel = Math.max(0, sel - 1);
        changed(true);
        renderEditor();
      } }),
    ]));
  }

  // ---------- Eylemler ----------
  function newProject() {
    var track = cur() ? cur().track : "game";
    var n = 1;
    while (data.projects.some(function (p) { return p.id === "yeni-proje-" + n; })) n++;
    data.projects.push({
      id: "yeni-proje-" + n, track: track, tier: "compact", hidden: true, title: "Yeni proje",
      subtitle: pair(), kind: pair(), date: pair(), pitch: pair(), points: { tr: [], en: [] },
      stats: [], tech: [], image: null, art: null, gallery: [], links: [],
    });
    changed();
    select(data.projects.length - 1);
    status("Yeni proje eklendi. Gizli başlıyor; hazır olunca \"Sitede gizle\" işaretini kaldır.");
  }

  function save() {
    status("Kaydediliyor…");
    return call("PUT", "/api/projects", data).then(function (r) {
      if (r._status === 422) {
        status("Kaydedilmedi: " + r.details.join(" · "), true);
        return false;
      }
      if (r._status !== 200) { status(r.error || "Kaydedilemedi", true); return false; }
      setDirty(false);
      status("Kaydedildi ve sayfalar yeniden üretildi. Önizlemeden kontrol edebilirsin.");
      refreshGit();
      return true;
    });
  }

  function showResult(title, out) {
    $("#result-title").textContent = title;
    $("#result-out").textContent = out || "";
    $("#dlg-result").showModal();
  }

  function commit() {
    var go = function () {
      refreshGit().then(function () {
        $("#commit-changes").textContent = $("#git").dataset.changes || "Değişiklik yok.";
        $("#dlg-commit").showModal();
      });
    };
    if (dirty) { if (!confirm("Kaydedilmemiş değişiklikler var. Önce kaydedilsin mi?")) return; save().then(function (ok) { if (ok) go(); }); }
    else go();
  }

  $("#dlg-commit").addEventListener("close", function () {
    if ($("#dlg-commit").returnValue !== "ok") return;
    call("POST", "/api/commit", { message: $("#commit-msg").value }).then(function (r) {
      showResult(r.ok ? "Commit'lendi" : "Commit yapılamadı", r.out || r.error);
      refreshGit();
    });
  });

  function push() {
    refreshGit().then(function () {
      var g = $("#git").dataset;
      $("#push-text").textContent = "\"" + g.branch + "\" dalı GitHub'a gönderilecek (" + (g.ahead || 0) + " commit).";
      $("#dlg-push").showModal();
    });
  }
  $("#dlg-push").addEventListener("close", function () {
    if ($("#dlg-push").returnValue !== "ok") return;
    status("Gönderiliyor…");
    call("POST", "/api/push").then(function (r) {
      showResult(r.ok ? "Gönderildi" : "Gönderilemedi", r.out || r.error);
      status(r.ok ? "Push tamam." : "Push başarısız.", !r.ok);
      refreshGit();
    });
  });

  $("#btn-new").addEventListener("click", newProject);
  $("#btn-save").addEventListener("click", save);
  $("#btn-commit").addEventListener("click", commit);
  $("#btn-push").addEventListener("click", push);
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); if (dirty) save(); }
  });
  window.addEventListener("beforeunload", function (e) { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

  // ---------- Başlat ----------
  call("GET", "/api/projects").then(function (r) {
    if (r._status !== 200 || !Array.isArray(r.projects)) {
      $("#offline").hidden = false;
      if (r._status === 401) $("#offline p").textContent = r.error;
      return;
    }
    data = { projects: r.projects };
    $("#app").hidden = false;
    renderList();
    renderEditor();
    refreshGit();
  }).catch(function () { $("#offline").hidden = false; });
})();
