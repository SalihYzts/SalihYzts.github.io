# DESIGN.md · YAZITAŞ, oyun ve yazılım dergisi

Site, Salih Yazıtaş'ın soyadını taşıyan bir oyun ve yazılım dergisinin bir sayısıdır: "YAZITAŞ, Sayı 26, Kasım 2026". Ziyaretçi bir portfolyoyu taramaz, bir sayıyı okur: kapak, içindekiler, bölüm açılışları, inceleme sayfaları, kısa haberler, bir dosya konusu, rozetler, bir rehber tablosu ve okur mektupları.

Bu yön 2000'lerin Türk oyun ve bilgisayar dergilerinin baskı geleneğinden gelir. Herhangi bir derginin logosu, adı ya da sayfası kopyalanmadı.

**Kaçınılanlar:** koyu zemin üstüne tek neon vurgu, oyun menüsü veya HUD kostümü, "kahraman başlık + eş kartlar" iskeleti, başlık üstü etiket (eyebrow), sert ofset gölge, kostüm olarak mono yazı, renkli kalın sol kenarlık.

## Okuyucu: gerçek dergi sayfaları

Site uzun bir sayfa değil, sayfalara bölünmüş bir sayıdır (`src/build.js` sayfalara böler, `assets/js/site.js` okur).

- **Sayfa oranı 4:5** (masaüstü). Bütün sayfa içi ölçüler `--u` birimindedir. Masaüstünde 1u = sayfa genişliği / 600; telefonda ve JS kapalıyken 1u = 1.08px. Bir sayfa her ekranda aynı oranda dizilir.
- **Masa ve kamera:** Bütün sayfalar büyük bir masada yan yana durur. Okuyucu bir kameradır; bir anda bir durak ekranı doldurur.
  - *Masaüstü:* durak iki sayfalık açılımdır; ekranın neredeyse tamamını kaplar, ortasında sırt gölgesi vardır. Kapak ve arka kapak tek başına ekranın ortasında durur.
  - *Telefon:* durak tek sayfadır, tam ekran. Sayfa kendi içinde dikey kayar.
  - *JS kapalı:* sayfalar alt alta.
- **Kamera hareketi:**
  - Bir duraktan ötekine geçerken kamera geri çekilir (komşu sayfalar görünür), kayar ve yeni durağa yeniden yaklaşır.
  - Süre 0.8 sn'dir (telefonda 0.5 sn). Uzak bir sayfaya atlarken kamera daha çok geri çekilir (en çok %42 ölçeğe kadar), aradaki açılımlar masada görünür.
  - Telefonda sayfalar parmağı takip eder; bırakınca kamera sonraki durağa gider ya da geri oturur.
  - Trackpad'de yatay kaydırma da durak değiştirir.
  - `prefers-reduced-motion` iken kamera atlamalı gider.
- **Sayfalama kuralları:**
  - Kapak s. 1'dir; açılımlar çift sayfadan başlar.
  - Öne çıkan projeler iki sayfalık gerçek açılımdır.
  - Gerekirse araya reklam sayfası girer (Volpen, Kralın Sözü itch.io, CV), böylece arka kapak çift sayfada tek kalır.
  - Sayfa sayısı projelerden otomatik çıkar.
- **Gezinme:**
  - Ok tuşları, PageUp/PageDown, Home/End.
  - Alttaki yuvarlak sayfa çubuğu: önceki, sayfa listesi, sonraki.
  - Her sayfanın bağlantısı vardır (`#s12` ya da `#kralin-sozu`). İçindekiler, bölüm açılışları ve üst menü ilgili sayfayı açar.
  - Görünmeyen sayfalar `inert`'tir; ekran okuyucuya yalnızca açık sayfalar okunur, sayfa değişimi `aria-live` ile duyurulur.
- **Sığdırma:** Bir sayfanın içeriği taşarsa o sayfanın `--fit` çarpanı en çok %72'ye kadar düşürülür. Proje metinleri uzarsa sayfa küçülerek sığar.

## Renk

Strateji: **tam palet**. Baskının üç işlem rengi, kâğıt ve mürekkep. Renkler bölgelere sahip çıkar: tam genişlik bölüm açılışları, kapak, çıkartmalar. Bütün değerler `assets/css/site.css` içindeki `:root` değişkenlerindedir.

| Token | Gündüz baskısı | Gece baskısı | Rol |
|---|---|---|---|
| `--desk` | `#d9d8d2` | `#0e0f11` | Derginin durduğu masa (sayfaların arkası) |
| `--paper` | `#fbfbf9` | `#1a1b1f` | Sayfa zemini (parlak beyaz kâğıt) |
| `--paper-2` | `#f0f0eb` | `#202227` | Künye kutuları, editörden kutusu, tablo zebra satırı |
| `--ink` | `#161616` | `#f3f2ee` | Metin, kalın çizgiler, alt bilgi zemini |
| `--ink-2` | `#4a4a47` | `#b8b6ae` | İkincil metin, künye etiketleri, sayfa numaraları |
| `--rule` | `#d8d8d0` | `#34363c` | İnce ayırıcılar |
| `--red` | `#d2131a` | `#ff5c55` | Logo, Oyun bölümü, damla harfler, mektup bölümü |
| `--blue` | `#0062ad` | `#5cb2ff` | Yazılım bölümü, rehber tablosu |
| `--yellow` | `#ffd21f` | `#ffd21f` | Kapak rakamları, CV çıkartması, sayı etiketi, seçim rengi |
| `--on-color` | `#ffffff` | `#16171a` | Kırmızı ve mavi zemin üstündeki metin |
| `--sec` | bölüme göre | | Bileşenler bölüm rengini yalnızca bundan alır |

Kapakta görsel üstündeki okunabilirlik, alttan ve üstten koyulaşan bir baskı tonuyla sağlanır. Kontrast hedefi: gövde metni ≥4.5:1, büyük metin ≥3:1.

## Tipografi

Tek aile: **Archivo** (değişken; genişlik 62–125, ağırlık 100–900). Kişilik genişlik ekseninden gelir. Yerelde barınır, yalnızca latin ve latin-ext alt kümeleriyle (`assets/fonts/`).

| Rol | Genişlik | Ağırlık | Boyut |
|---|---|---|---|
| Logo (masthead) | 125% | 900 | `clamp(2.75rem, 15.4vw, 13.5rem)`, satır yüksekliği .78, harf aralığı -0.045em |
| Bölüm açılışı (Oyun, Yazılım) | 125% | 900 | `--fs-open`, en çok 6rem |
| Sayfa başlığı (h2) | 112% | 900 | `--fs-h2` |
| İnceleme başlığı | 112% | 900, büyük harf | `--fs-h3`; öne çıkanlarda 4.5rem'e kadar. Tek parça uzun adlar (MyEverythingList) normal genişlikte ve daha küçük dizilir |
| Spot (deck) | 78% | 600 | `--fs-deck` |
| Gövde | 100% | 400 | 17px / 1.6, en çok 64ch |
| Etiket, künye, sayfa numarası | 78% | 700 | 13–15px |

- Türkçe büyük harf dönüşümü için başlıklara `lang` verilir. Türkçe adlar `tr` (İ), İngilizce adlar `en` alır.
- Damla harf: her incelemenin ve editör yazısının ilk harfi, 125% / 900, bölüm renginde.

## Boşluk ve ızgara

- 4 tabanlı ölçek: `--s-1` 4px … `--s-10` 128px.
- İçerik genişliği 1240px. Kenar boşluğu mobilde 20px, 760px üstünde 40px.
- Bölüm araları `--s-9`. Başlığın üstündeki boşluk altındakinden fazladır.

## Şekil ve derinlik

- Köşe yarıçapı `--radius: 6px` (görsel çerçeveleri, kutular, düğmeler). Mühürler ve çıkartma tam daire.
- Tek gölge `--shadow-lift`: ofsetli ve yumuşak. Yalnızca çıkartma, editör fotoğrafı ve bildirimde kullanılır.
- Kalın çizgiler (6px `--ink` ya da bölüm rengi) sayfa başlarını ayırır. İnce çizgiler (`--rule`) listeleri ayırır.

## Bileşenler

- **Üst çubuk:** Yapışkan, kâğıt zeminli, 2px mürekkep alt çizgi. Küçük logo, bölüm bağlantıları (okunan bölüm `aria-current` ile mürekkep zemine döner), dil ve tema. 520px altında menüde yalnızca İçindekiler kalır.
- **Kapak:**
  - Kralın Sözü kapak görseli tam genişlikte.
  - Sarı "Sayı 26" etiketiyle sayı satırı, kırmızı YAZITAŞ logosu ve "Salih Yazıtaş, oyun ve yazılım geliştirici" satırı.
  - Kapak konusu (oyunun incelemesine bağlanır).
  - Sarı büyük rakamlı üç kapak başlığı (19, 614, 1,6 ms).
  - Döndürülmüş sarı "CV hediye" çıkartması (CV indirir) ve dekoratif barkod (mobilde gizli).
- **İçindekiler:** Gerçek sayfa numaralarıyla iki sütun (Oyun kırmızı, Yazılım mavi); her satır ilgili incelemeye bağlanır. Yanında "Editörden" kutusu: yuvarlak fotoğraf, damla harfli kısa yazı, imza.
- **Bölüm açılışı:** Tam genişlik bölüm rengi bant, dev bölüm adı, spot, sayfa numarası.
- **Kenar sekmesi:** Basılı dergi başparmak dizini. Dikey yazılı, bölüm renginde; renkli açılışların önünde kâğıt renginde. 1340px altında gizli.
- **İnceleme düzenleri** (`src/build.js` atar; ardışık sayfalar aynı kalıbı tekrar etmez):
  - *Yayılım:* görsel solda yapışkan, metin sağda, altında üçlü galeri. Bölümün ilk öne çıkanı.
  - *Lead:* geniş 16:7 görsel üstte; altında iki sütunlu, sütun çizgili gövde ve sağda künye. İkinci bölümün öne çıkanı.
  - *Satır:* tam genişlik; görsel bir solda, bir sağda. Uzun incelemeler.
  - *İkili:* yarım sayfa, ikişer yan yana. Kısa incelemeler. Tek kalırsa en uzunu satıra çıkar.
  - Her incelemenin altında, ince çizginin üstünde, dış köşede sayfa numarası.
- **Künye kutusu:** `--paper-2` zemin. "Künye" (tür ve rol, tarih, teknoloji) ve "Rakamlarla" (yalnızca gerçek rakamlar) alt başlıkları bölüm renginde.
- **Kısa kısa:** Küçük resim, büyük harf başlık, bölüm renginde tür ve tarih, tek cümle, teknolojiler, sessiz bağlantılar. 340px'lik akışkan ızgara.
- **Dosya: Yolculuk:** Solda tarih ve durum (Sürüyor kırmızı), sağda başlık, kurum ve hedef maddeleri.
- **Rozetler:** Yuvarlak damga mühürleri (sarı, kırmızı, mavi sırayla), ortada piksel ikon, altında ad ve koşul. Gizli mühür kesik çizgili; Konami koduyla açılır. Mobilde 2–3 sütun.
- **Rehber tablosu:** Mürekkep başlık satırı, zebra satırlar, alan adları mavi. 640px altında her satır etiketli bloklara dönüşür.
- **Okur mektupları:** Büyük e-posta bağlantısı, kopyala düğmesi, iki CV düğmesi, marka ikonlu sosyal bağlantılar (simple-icons, CC0). Yanında çerçeveli künye (dergi imprint'i) ve "Gelecek sayıda" kutusu.
- **Düğmeler:** 2px mürekkep kenarlı, 6px yarıçap, en az 46px yükseklik. Dolu olanı bölüm renginde. Üzerine gelince 2px yükselir; basınca iner. Odak: 3px bölüm rengi dış çizgi.
- **Bildirim:** Sarı, ortada altta, 4 saniye, `role="status"`.

## Görseller

- Proje görselleri gerçek ekran görüntüleri ya da itch.io sayfalarındaki oyun kareleridir. 960px WebP'ye çevrilir ve 16:10 çerçevede gösterilir.
- Görsel paylaşılamayan projelerde (Under the Counter, Parsel, Truva arabirimi, YtChatInstaller) bölüm renginde çizgisel çizim kullanılır (`src/art.js`).
- Görsel altı yazısı yok. Açıklamalar `alt` metninde.
- OG görselleri (`assets/og/og-*.jpg`) kapağın 1200×630 sürümüdür ve Chromium ile üretilir.

## Hareket

- **Tek yüklenme anı:** logo, CMYK baskı kaymasından (camgöbeği ve sarı gölgeler) yerine oturur. Kapak konusu, kapak başlıkları ve çıkartma bir kez yükselir.
- **Fare üstü katmanı:** inceleme görseli 1.03 büyür, düğmeler 2px yükselir, çıkartma düzelir, mühür döner.
- `prefers-reduced-motion: reduce` iken bütün animasyon ve geçişler kapanır, kaydırma anlık olur.

## Süreç notu

Bu yeniden tasarım Impeccable, design-taste-frontend, ui-ux-pro-max ve web-design-guidelines skill'leriyle yapıldı. Impeccable'ın motoru indirilmediği için yön kurası (concept-seed) çalışmadı. Yön, türetilen yedi aday arasından kullanıcıya sunulan üç seçenekten kullanıcı tarafından seçildi. Son inceleme bağımsız bir ajanla yapıldı.
