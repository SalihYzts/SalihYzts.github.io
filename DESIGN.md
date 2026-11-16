# DESIGN.md · salihyzts.github.io

Salih Yazıtaş'ın kişisel sitesi. Site bir oyunun ana menüsü gibi açılır, ama içerik bir CV kadar düz okunur.

## Yön

**"Mod seçimi"**: Aynı kişi, iki mercek. Ziyaretçi açılışta **Oyunlar** ya da **Yazılım** modunu seçer. Mod sitenin vurgu rengini, bölüm adlarını ve projelerin sırasını değiştirir; seçilen hat "ana görev", öteki "yan görev" olur. İçerik aynı kalır.

İncelenen siteler ve aldığım fikirler:

| Site | Ne gördüm | Ne aldım |
|---|---|---|
| lynnandtonic.com (Lynn Fisher) | Siyah zemin, tek bir güçlü renk, kitap içindekiler sayfası gibi noktalı çizgili menü ve Roma rakamları | Ana menüyü **noktalı çizgili, numaralı bir liste** olarak kurmak. Tek vurgu rengi. |
| joshwcomeau.com (Josh Comeau) | Kişisel, sıcak ton; kesilmiş fotoğraf; katmanlı silüetlerle bölünen bölümler; küçük sürprizler | Siteye **kişi** olarak girmek (karakter kartı), küçük sürprizler (gizli başarım, ses), ama varsayılan sessiz. |
| brittanychiang.com | Gizli bölmede yalnızca koyu lacivert zemin ve köşe ışığı görünebildi | Düzeni hakkında yorum yok. |
| Awwwards / One Page Love "Portfolio", "Game", "Pixel Art" listeleri | Küçük resimler gizli bölmede yüklenmedi; yalnızca isim ve kategori listesi okundu | Doğrudan fikir alınmadı. |

Kaçındıklarım: mor-mavi gradyan, cam efekti, üç eş kart, emoji ikon, gradyanlı başlık, her şeyin ortalanması, uydurma "beceri yüzdesi" çubukları, "Press Start 2P" ile yazılmış koca başlıklar.

Görsel imza üç şeyden geliyor:

1. **Pah kırılmış köşeler** (chamfer, `clip-path`): yuvarlak köşe yerine oyun arayüzü kesiği.
2. **Sert piksel gölge**: bulanık gölge yok, `4px 4px 0` ofset gölge.
3. **Noktalı çizgili stat satırları**: `DİL ........ 19` gibi RPG karakter sayfası.

## Renk

Bütün renkler `assets/css/site.css` içindeki `:root` değişkenlerinde. Sayfalar ham değer kullanmaz.

Zemin saf siyah değil: Kralın Sözü'nün kış gecesinden alınmış lacivert-mürekkep. Yazılım modunda zemin aynı açıklıkta ama daha nötr bir grafite döner.

### Nötr (koyu tema, varsayılan)

| Token | Oyun modu | Yazılım modu | Rol |
|---|---|---|---|
| `--bg` | `#10131d` | `#0f1216` | Sayfa zemini |
| `--bg-raised` | `#171b28` | `#161a20` | Kartlar, paneller |
| `--bg-sunken` | `#0b0d15` | `#0a0c0f` | Ekran çerçevesi içi, stat blokları |
| `--line` | `#2a3044` | `#283039` | Kenarlıklar, ayırıcılar |
| `--line-strong` | `#4a5270` | | Sert gölge, ağaç bağlantıları |
| `--text` | `#ece6d9` | | Ana metin (14.9:1) |
| `--text-muted` | `#aba69c` | | İkincil metin (7.1:1 ve üstü) |
| `--text-faint` | `#8c877d` | | Noktalı çizgiler, pasif etiketler (4.8:1 ve üstü) |
| `--grid-dot` | `rgb(236 230 217 / .07)` | | Zemin ızgarası: oyunda nokta, yazılımda çizgi |

### Nötr (açık tema)

| Token | Oyun modu | Yazılım modu |
|---|---|---|
| `--bg` | `#eceef2` | `#edeff0` |
| `--bg-raised` | `#fafbfc` | `#fbfcfc` |
| `--bg-sunken` | `#dfe2e9` | `#e0e4e7` |
| `--line` | `#c6cbd6` | `#c5ccd2` |
| `--line-strong` | `#141826` | |
| `--text` | `#141826` | |
| `--text-muted` | `#474c5b` | |
| `--text-faint` | `#5c6272` | |

### Mod renkleri (tek vurgu, moda göre değişir)

| Token | Koyu | Açık | Rol |
|---|---|---|---|
| `--ember` | `#f2a541` | `#94470a` | **Oyun modu**: fener ışığı |
| `--signal` | `#6cc4ff` | `#0b5aa0` | **Yazılım modu**: ekran ışığı. Asit yeşili "terminal" klişesinden kaçmak için mavi |
| `--accent` | moda göre `--ember` ya da `--signal` | | Bileşenler yalnızca bunu kullanır: bağlantılar, birincil düğme, seçili mod, ikonlar |
| `--accent-ink` | `#10131d` | `#ffffff` | Vurgu zeminli düğmede metin (6.6:1 ve üstü) |
| `--accent-soft` | vurgunun %10–12'si | | Rozet ikon zemini |

Ölçülen en düşük metin kontrastı 4.7:1 (açık tema, `--text-faint` / `--bg-sunken`). Vurgu metni koyuda 8.4:1, açıkta 5.1:1 ve üstü.

## Tipografi

| Rol | Aile | Ağırlık | Kullanım |
|---|---|---|---|
| Display | **Big Shoulders Display** | 800, 900 | İsim, bölüm ve proje başlıkları. Dar, büyük, atari tabelası gibi. Hep büyük harf. |
| Gövde | **IBM Plex Sans** | 400, 500, 600 | Paragraflar, açıklamalar |
| HUD | **IBM Plex Mono** | 400, 500 | Stat satırları, tarih, etiket, teknoloji envanteri, yazılım modundaki komutlar |
| Piksel | **Tiny5** | 400 | Yalnızca 1–3 kelimelik küçük rozet ve tuş etiketleri (`ANA GÖREV`, `TAMAMLANDI`). Silkscreen'de İ, Ş, Ğ olmadığı için Tiny5 seçildi. Asla paragraf. |

Yazı tipleri `assets/fonts/` altında, yalnızca `latin` ve `latin-ext` alt kümeleriyle yerelde barınıyor.

Ölçek (`clamp` ile akışkan, mobil → masaüstü):

| Token | Boyut | Satır yüksekliği | Kullanım |
|---|---|---|---|
| `--fs-hero` | 64 → 152px | 0.86 | Hero'daki isim |
| `--fs-h2` | 44 → 80px | 0.9 | Bölüm başlığı |
| `--fs-h3` | 30 → 44px | 0.95 | Proje başlığı |
| `--fs-lg` | 18 → 20px | 1.5 | Giriş paragrafı |
| `--fs-md` | 16px | 1.6 | Gövde |
| `--fs-sm` | 14px | 1.5 | HUD, etiket |
| `--fs-xs` | 12px | 1.4 | Piksel rozetler |

Paragraf genişliği en fazla `64ch`.

## Boşluk

4 tabanlı ölçek: `--s-1` 4px · `--s-2` 8px · `--s-3` 12px · `--s-4` 16px · `--s-5` 24px · `--s-6` 32px · `--s-7` 48px · `--s-8` 64px · `--s-9` 96px · `--s-10` 128px.

- İçerik genişliği `--w-content: 1200px`, kenar boşluğu mobilde 16px, masaüstünde 32px.
- Bölümler arası `--s-9` (mobilde `--s-8`).

## Şekil ve derinlik

| Token | Değer | Kullanım |
|---|---|---|
| `--cut` | 10px | Kart ve düğmelerde pah kırılmış köşe boyu |
| `--cut-sm` | 6px | Çip ve rozetlerde |
| `--radius` | 0 | Yuvarlak köşe yok. Tek istisna: avatar çerçevesi de pah kırık. |
| `--shadow-px` | `4px 4px 0 var(--line-strong)` | Düğme ve kartların sert gölgesi |
| `--shadow-px-accent` | `4px 4px 0 var(--accent)` | Üzerine gelinen ya da seçili öğe |

Bulanık gölge, cam efekti ve gradyan yok. Tek "parıltı": hero'daki ekran kartlarında 1px tarama çizgisi deseni.

## Bileşenler

- **HUD çubuğu** (üst, yapışkan): solda `SY` piksel logosu ve aktif mod; sağda dil (TR/EN), tema ve ses düğmeleri. Düğmeler 40×40px'ten küçük değil.
- **Mod kartları** (hero): iki büyük seçim kartı, `aria-pressed`. Seçili olan vurgu renkli kenarlık ve vurgu gölgesi alır, `▸` imleci kartın soluna kayar.
- **Ana menü listesi**: numaralı, noktalı çizgili bağlantılar. Üzerine gelince ya da odaklanınca `▸` imleci belirir.
- **Düğmeler**
  - Birincil: `--accent` zemin, `--accent-ink` metin, pah köşe, sert gölge. Üzerine gelince 2px yukarı-sola kayar ve gölge büyür; basınca gölge kapanır.
  - İkincil: şeffaf zemin, `--line-strong` kenar.
  - Sessiz: yalnızca metin ve `↗`.
  - Odak: 2px `--accent` dış çizgi, 3px boşluk. Devre dışı: `--locked` renk, gölge yok.
- **Görev kartı (proje)**: `LV.xx` piksel etiket, kategori, tarih; display başlık; tek cümle; "ekran" (görsel ya da çizim); stat bloğu (noktalı çizgili); envanter (teknolojiler kare çipler halinde); bağlantılar. Öne çıkan iki proje geniş, diğerleri ikili ızgara.
- **Görev günlüğü**: durum etiketi (`AKTİF`, `TAMAMLANDI`, `KİLİTLİ`), başlık, kurum, tarih, hedef listesi (☑ işaretli maddeler).
- **Başarım rozeti**: 16×16 piksel ikon, ad, açılma koşulu. Kilitli rozet gri ve `???`.
- **Yetenek ağacı**: kökten dallanan sütunlar; düğümler pah kırık küçük kutular, aralarında 2px bağlantı çizgileri. Seviye ya da yüzde yok.
- **Kayıt noktası**: karakter kartı (fotoğraf, sınıf, lonca, konum) ve "kaydet" menüsü (CV indirme, iletişim bağlantıları).
- **Bildirim (toast)**: başarım açıldığında sağ altta, 4 saniye, `role="status"`.

## Görseller ve ikonlar

- İkonlar elle çizilmiş 16×16 piksel SVG'ler (`shape-rendering: crispEdges`), tek renk, `currentColor`.
- Proje görselleri gerçek ekran görüntüleri; çerçeve içinde, `--bg-sunken` paspas üzerinde. Metinli tanıtım kartları kullanılmaz, yalnızca ekran bölgesi kırpılır.
- Oyun içi görseli paylaşılmamış ekip projelerinde (Under the Counter, LAST DAWN) ve şirket onayı beklenen stajda (Parsel) görsel yerine tipografik ya da çizgisel bir "ekran" var.
- Fotoğraf yalnızca kayıt noktasındaki karakter kartında.

## Hareket

- Süreler: 120ms (üzerine gelme), 200ms (seçim), 320ms (bölüm girişi). Piksel hissi için imleç hareketlerinde `steps(4)`.
- Hero'da yazılım kartında imleç yanıp söner, oyun kartında kar taneleri yavaşça düşer (canvas değil, CSS).
- İsmin altındaki sert gölge moda göre renk değiştirir; sitenin tek "cesur" öğesi bu.
- `prefers-reduced-motion: reduce` iken: bütün animasyon ve geçişler kapanır, kar durur, terminal metni hazır gelir, kaydırma anlık olur.
- Ses: WebAudio ile üretilen kısa kare dalga sesleri. **Varsayılan kapalı**, düğmeyle açılır, tercih `localStorage`'da saklanır.
- Gizli: Konami kodu (↑↑↓↓←→←→BA) gizli başarımı açar ve tarama çizgisi (CRT) katmanını açıp kapatır.
