# salihyzts.github.io

Salih Yazıtaş'ın kişisel sitesi. Çerçevesiz, statik; GitHub Pages'te doğrudan çalışır.

- Tasarım kararları: [DESIGN.md](DESIGN.md)
- İçerik (TR/EN): [src/content.js](src/content.js)
- Şablon ve üretici: [src/build.js](src/build.js), piksel ikonlar: [src/icons.js](src/icons.js)
- Stil ve davranış: `assets/css/site.css`, `assets/js/site.js`

İçeriği değiştirdikten sonra sayfaları yeniden üret:

```bash
node src/build.js
```

Bu komut `index.html`, `en/index.html`, `404.html` ve `sitemap.xml` dosyalarını yazar. Yerelde bakmak için:

```bash
python3 -m http.server 8765
```

CV dosyaları `cv/` klasöründe; kaynağı `~/Root/cv/` (orada yeniden üretilince buraya kopyala).
