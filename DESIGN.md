# DESIGN.md · YAZITAŞ, oyun ve yazılım dergisi

Site, Salih Yazıtaş'ın soyadını taşıyan bir derginin üç sayısıdır. Ziyaretçi bir portfolyoyu taramaz; masadan bir sayı alıp okur.

- **Masa** (`/`, `/en/`): ahşap bir masada üç dergi, bir kupa, kalem, not kâğıdı ve basılı CV. Dergiye tıklanınca kamera yaklaşır; dergi okuyucudaki kapağın tam yerine oturunca o sayının sayfası açılır.
- **Sayı 1 · Ben** (`/ben/`, `/en/about/`, 10 sayfa, sarı): editörden ve künye, iş dosyası (Petra Cafe, Stoneograph, Volpen), okul ve topluluk, rozetler, rehber, okur mektupları.
- **Sayı 2 · Oyun** (`/oyun/`, `/en/games/`, 14 sayfa, kırmızı): Kralın Sözü dört sayfa (açılım, nasıl oynanır, yapım notları), tek sayfalık oyunlar, jam oyunları, kısa kısa, kulüp ve jamler.
- **Sayı 3 · Yazılım** (`/yazilim/`, `/en/software/`, 14 sayfa, mavi): MyEverythingList üç sayfa (açılım, yapım notları), tek sayfalık projeler, Parsel staj dosyası, kafe işleri, kısa kısa.

Bu yön 2000'lerin Türk oyun ve bilgisayar dergilerinin baskı geleneğinden gelir. Herhangi bir derginin logosu, adı ya da sayfası kopyalanmadı.

**Kaçınılanlar:** koyu zemin üstüne tek neon vurgu, oyun menüsü veya HUD kostümü, "kahraman başlık + eş kartlar" iskeleti, başlık üstü etiket (eyebrow), sert ofset gölge, kostüm olarak mono yazı, renkli kalın sol kenarlık.

## Okuyucu: gerçek dergi sayfaları

Site uzun bir sayfa değil, sayfalara bölünmüş bir sayıdır (`src/build.js` sayfalara böler, `assets/js/site.js` okur).

- **Sayfa oranı 4:5** (masaüstü). Bütün sayfa içi ölçüler `--u` birimindedir. Masaüstünde 1u = sayfa genişliği / 600; telefonda ve JS kapalıyken 1u = 1.08px. Bir sayfa her ekranda aynı oranda dizilir.
- **Tam ekran:** Masaüstünde iki sayfalık açılım ekranın bütün yüksekliğini alır; menü, dil, tema ve sayfa çubuğu alttaki tek 48px'lik masa renginde şerittedir (kapaktayken küçük logo gizlenir). Telefonda (720px altı ya da 512px'den kısa) üst çubuk yukarıda, sayfa çubuğu altta yüzen haptır; tek sayfa tam ekrandır ve kendi içinde dikey kayar. JS kapalıyken sayfalar alt alta durur. Görünüm sınıfı (`print`/`app`) boyamadan önce baştaki betikte konur.
- **Sayfa çevirme:**
  - Açılımda sağ sayfa sırttan 3B döner (0.9 sn, uzak atlamada 1.1 sn). Arkasında gelen açılımın sol sayfası görünür, gölgesi döndükçe değişir. Geri giderken sol sayfa ters yönde döner.
  - Çevirirken sahne hafifçe geri çekilip yaklaşır (ölçek 0.955; uzak atlamada 0.9).
  - Kapak kapalı bir dergi gibi açılımın sağında, arka kapak solunda durur; sahne onları ekranın ortasına getirir ve çevirirken açılımın ortasına kayar.
  - Telefonda sayfa sol kenarından dönerek kalkar.
  - Ok tuşları, sayfa çubuğu, trackpad'de yatay kaydırma ve telefonda yatay kaydırma sayfa çevirir.
  - Çevirme kesilebilir: sürerken gelen yeni istek beklemez, süren yaprak yerine oturur ve yenisi çevrilir. Basılı tutulan ok tuşu animasyonsuz geçer.
  - Çevirmeden önce hedef sayfanın görselleri çözülür (en çok 250 ms beklenir); yakındaki ±2 sayfanın görselleri önceden yüklenir.
  - Bağlantıyla açılan sayfada odak sayfanın ilk başlığına gider.
  - `prefers-reduced-motion` iken çevirme yerine 180 ms'lik bir geçiş olur.
- **Sayfalama kuralları** (her sayı ayrı; projeler `data/projects.json`'daki sıraya göre dizilir):
  - Kapak s. 1, içindekiler ile editörden s. 2–3. Arka kapak çift numaralıdır.
  - `featured` proje çift sayfadan başlayan iki sayfalık açılımdır; `pages` alanındaki ek sayfalar (nasıl oynanır, yapım notları) hemen ardından gelir.
  - `card` proje kendi sayfasındadır (tek sayfa: görsel, başlık, spot, metin, yan sütunda rakamlar, ekip, teknoloji, bağlantılar). Ek sayfası varsa ikisi bir açılım olur. `half: true` olan kartlar ikişer ikişer aynı sayfadadır.
  - `compact` projeler sayının sonunda kısa kısa sayfasındadır.
  - Hizalama bozulursa araya reklam sayfası girer (şu an gerek yok).
- **Gezinme:**
  - Ok tuşları, PageUp/PageDown, Home/End.
  - Alttaki yuvarlak sayfa çubuğu: önceki, sayfa listesi, sonraki.
  - Her sayfanın bağlantısı vardır (`#s12` ya da `#kralin-sozu`). İçindekiler, bölüm açılışları ve üst menü ilgili sayfayı açar.
  - Görünmeyen sayfalar `inert`'tir; ekran okuyucuya yalnızca açık sayfalar okunur, sayfa değişimi `aria-live` ile duyurulur.
- **Masa:** CSS 3B (kütüphane yok, `assets/css/desk.css`, `assets/js/desk.js`). Kamera, seçilen derginin dünyadaki dönüşümünün tersidir; hedefte dergi okuyucudaki kapağın piksel piksel yerindedir, çevresi okuyucunun zemin rengine döner, sonra sayfaya gidilir (hover'da önceden yükleme ve prerender). Okuyucudaki "Masa" bağlantısı ya da geri tuşu kamerayı aynı dergiden geri çeker. Fareyle hafif paralaks, ok tuşlarıyla dergiler arası gezinme, hareket azaltma açıkken doğrudan geçiş. Eski tek dergi adresleri (`/#kralin-sozu`) ilgili sayıya yönlenir.
- **Sığdırma ve okunabilirlik tabanı:** Taşan sayfanın `--fit` çarpanı en çok %76'ya kadar düşer. Küçük yazıların piksel tabanı vardır (`max(px, calc(n * var(--u)))`): etiket ve künye 11–11.5px, gövde 12–13px. Böylece küçülen yalnızca başlıklar, görseller ve boşluklardır. Yine sığmayan sayfa küçülmez, kendi içinde kayar (`.is-scroll`, klavyeyle odaklanabilir). Ölçüm: 1366×768 ve üstünde hiçbir sayfa kaymaz; 1280×720'de yalnızca NeRoBoT ve RaiPy sayfaları kayar.
- **Sayfa altı:** Dış köşede sayfa numarası, iç köşede `YAZITAŞ · bölüm` künye satırı. Sığdırmadan etkilenmeyen `--u0` birimindedir.

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
| `--band` | `#d2131a` / `#0062ad` | aynı | Bölüm bandı ve çizim zemini; iki temada da derin renk, üstünde beyaz yazı |

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
- Damla harf yalnızca öne çıkan açılımlarda ve editör yazısında. İkili sayfalarda metin, bölüm renginde kalın ilk dört kelimeyle (run-in) başlar.
- Büyük-küçük harf karışık adlar (MyEverythingList, NeRoBoT) büyük harfe çevrilmez (`--keep`).
- Çekme alıntı (pull quote): bölüm rengi sol çizgi, 112% / 850, tırnaklar bölüm renginde. Yalnızca projenin kendi metninden ya da oyunun içinden alıntı.

## Boşluk ve ızgara

- 4 tabanlı ölçek: `--s-1` 4px … `--s-10` 128px.
- İçerik genişliği 1240px. Kenar boşluğu mobilde 20px, 760px üstünde 40px.
- Bölüm araları `--s-9`. Başlığın üstündeki boşluk altındakinden fazladır.

## Şekil ve derinlik

- Köşe yarıçapı `--radius: 6px` (görsel çerçeveleri, kutular, düğmeler). Mühürler ve çıkartma tam daire.
- Tek gölge `--shadow-lift`: ofsetli ve yumuşak. Yalnızca çıkartma, editör fotoğrafı ve bildirimde kullanılır.
- Kalın çizgiler (6px `--ink` ya da bölüm rengi) sayfa başlarını ayırır. İnce çizgiler (`--rule`) listeleri ayırır.

## Bileşenler

- **Çubuk:** Masaüstünde alttaki ince şerit: küçük logo, bölüm bağlantıları (açık açılımda başlayan ya da içinde bulunulan bölüm `aria-current` ile mürekkep zemine döner), sayfa çubuğu (önceki, sayfa listesi, sonraki), dil ve tema. Telefonda üstte kâğıt zeminli çubuk ve altta yüzen sayfa hapı.
- **Kapak:**
  - Kralın Sözü kapak görseli tam genişlikte.
  - Sarı "Sayı 26" etiketiyle sayı satırı, kırmızı YAZITAŞ logosu ve "Salih Yazıtaş, oyun ve yazılım geliştirici" satırı.
  - Kapak konusu (oyunun incelemesine bağlanır).
  - Sarı büyük rakamlı üç kapak başlığı (19, 614, 1,6 ms).
  - Kapak başlıkları alt ızgarada hizalı: rakamlar sağa yaslı, açıklamalar aynı sütunda.
  - Döndürülmüş sarı "CV hediye" çıkartması kapak konusunun yanında (telefonda altında); dekoratif barkod sağ altta (telefonda gizli).
- **İçindekiler:** Gerçek sayfa numaralarıyla iki sütun (Oyun kırmızı, Yazılım mavi); her satır ilgili incelemeye bağlanır, "Kısa kısa" satırının altında oradaki projelerin adları yazar. Altta diğer bölümler (Editörden ve künye dahil) ve kalan yeri dolduran "Kapak konusu" kartı. Karşı sayfada Editörden ve künye.
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
- **Dosya: Yolculuk:** Solda tarih ve durum (Sürüyor kırmızı), sağda başlık, kurum ve tek paragrafta akan hedefler (sürenlerde iki, en yeni iki bitende bir, eskilerde yok).
- **Rozetler:** Yuvarlak damga mühürleri (sarı, kırmızı, mavi sırayla), ortada piksel ikon, altında ad ve koşul. Gizli mühür kesik çizgili; Konami koduyla açılır. Mobilde 2–3 sütun.
- **Rehber tablosu:** Mürekkep başlık satırı, zebra satırlar, alan adları mavi. 640px altında her satır etiketli bloklara dönüşür.
- **İkili sayfa:** İki proje üst üste; solda 4:3 görsel, sağda başlık, tür ve tarih, spot, run-in metin, rakamlar, teknolojiler, bağlantılar. Tek kalan proje, altındaki kısa kısa satırlarıyla sayfayı paylaşır; bu satırlarda tanıtımın yalnızca ilk cümlesi durur.
- **Okur mektupları:** Büyük e-posta bağlantısı (telefonda @ öncesinden bölünür), kopyala düğmesi, iki büyük CV kartı (sayfanın dilindeki sarı), kesik çizgili "okur kuponu" (konu satırı hazır üç e-posta bağlantısı), marka ikonlu sosyal bağlantılar (simple-icons, CC0).
- **Arka kapak:** Üst yarıda LAST DAWN görseli, "Gelecek sayıda" listesi, fiyat etiketi ve barkod.
- **Düğmeler:** 2px mürekkep kenarlı, 6px yarıçap, en az 46px yükseklik. Dolu olanı bölüm renginde. Üzerine gelince 2px yükselir; basınca iner. Odak: 3px bölüm rengi dış çizgi.
- **Bildirim:** Sarı, ortada altta, 4 saniye, `role="status"`.

## Görseller

- Proje görselleri gerçek ekran görüntüleri ya da itch.io sayfalarındaki oyun kareleridir. 960px WebP'ye çevrilir. Kırpma her görselde `focus` (object-position) ile ayarlanır; logo gibi kırpılmaması gerekenler `fit: "contain"` ile koyu zeminde tam görünür.
- Görsel paylaşılamayan projelerde (Under the Counter, Parsel, Truva arabirimi, YtChatInstaller) bölüm rengi zeminde beyaz çizgisel çizim kullanılır (`src/art.js`).
- Öne çıkan açılımlarda numaralı görsel altı yazısı vardır ("Görsel 1. …", `alt` metninden).
- OG görselleri (`assets/og/og-*.jpg`) kapağın 1200×630 sürümüdür ve Chromium ile üretilir.

## Hareket

- **Tek yüklenme anı:** logo, CMYK baskı kaymasından (camgöbeği ve sarı gölgeler) yerine oturur. Kapak konusu, kapak başlıkları ve çıkartma bir kez yükselir.
- **Fare üstü katmanı:** inceleme görseli 1.03 büyür, düğmeler 2px yükselir, çıkartma düzelir, mühür döner.
- `prefers-reduced-motion: reduce` iken CSS animasyon ve geçişleri kapanır; sayfa değişimi kısa bir saydamlık geçişidir.

## Süreç notu

Bu yeniden tasarım Impeccable, design-taste-frontend, ui-ux-pro-max ve web-design-guidelines skill'leriyle yapıldı. Impeccable'ın motoru indirilmediği için yön kurası (concept-seed) çalışmadı. Yön, türetilen yedi aday arasından kullanıcıya sunulan üç seçenekten kullanıcı tarafından seçildi. Son inceleme bağımsız bir ajanla yapıldı.

İyileştirme turu (17 Kasım 2026): bağımsız eleştiri, erişilebilirlik ve performans denetimi ile sayfa çevirme araştırması üzerine yapıldı. Hareket ve dokunma için emilkowalski/skills, erişilebilirlik ve Core Web Vitals için addyosmani/web-quality-skills skill'leri eklendi. axe-core 4.10: TR/EN, açık/koyu, masaüstü/telefonda 0 ihlal.

Üç sayı turu (17 Kasım 2026): tek dergi masa ve üç sayıya bölündü (kullanıcının fikri: "biri ben, biri oyun, biri yazılım"; giriş için masada üç dergi). Masa önce bağımsız bir CSS 3B denemesiyle gösterildi, beğenilince asıl yapıma geçildi. Ayrıntılar CV verisinden, LinkedIn gönderi taslaklarından ve Kralın Sözü'nün itch metninden; uydurma bilgi yok. axe-core 4.10: masa ve üç sayı, TR/EN, açık/koyu, masaüstü/telefonda 0 ihlal.
