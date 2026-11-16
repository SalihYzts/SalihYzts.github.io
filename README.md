# salihyzts.github.io

Salih Yazıtaş'ın kişisel sitesi. Çerçevesiz, statik; GitHub Pages'te doğrudan çalışır.

- Tasarım kararları: [DESIGN.md](DESIGN.md)
- Projeler: [data/projects.json](data/projects.json) (panelden düzenlenir)
- Diğer içerik (TR/EN): [src/content.js](src/content.js)
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

## Proje paneli (yalnızca yerelde)

Projeleri eklemek, düzenlemek, sıralamak, gizlemek ve görsel değiştirmek için:

```bash
node admin/server.js
```

Terminalde yazan adres tarayıcıda açılır. Panel yalnızca `127.0.0.1` üzerinde çalışır ve her açılışta yeni bir erişim anahtarı üretir; canlı sitede çalışmaz, kodda hiçbir token ya da şifre yoktur.

- **Kaydet ve sayfaları üret:** `data/projects.json`'u yazar ve `node src/build.js`'i çalıştırır.
- **Görsel yükle:** görseli ImageMagick (`magick`) ile WebP'ye çevirip `assets/img/` içine koyar.
- **Siteyi önizle:** üretilen sayfaları panelin içinden açar.
- **Commit / Push:** yalnızca proje verisini, görselleri ve üretilen sayfaları commit'ler; push senin git oturumunla yapılır.
