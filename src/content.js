// Site içeriği. Kaynak: ~/Root/cv/kaynak/cv-data.js ve ~/Root/cv/linkedin-postlari/*/gonderi.md
// Her metin { tr, en } nesnesi ya da iki dilde aynıysa düz string.
// Düzenledikten sonra: node src/build.js

const links = {
  site: "https://salihyzts.github.io/",
  email: "yazitassalih0@gmail.com",
  github: "https://github.com/SalihYzts",
  linkedin: "https://www.linkedin.com/in/salih-yaz%C4%B1ta%C5%9F/",
  itch: "https://salihyzts.itch.io",
  kralinItch: "https://salihyzts.itch.io/kralin-sozu",
  kralinRepo: "https://github.com/SalihYzts/kralin-sozu",
  mel: "https://liste-programi.yazitassalih0.workers.dev/",
  volpen: "https://salihyzts.github.io/VolpenWeb/",
  lastDawn: "https://salihyzts.github.io/Last-Down-WEB/",
  rollingPizz: "https://tce81.itch.io/the-rolling-pizz",
  nerobot: "https://github.com/SalihYzts/NeRoBoT",
  heren: "https://github.com/SalihYzts/heren-agent",
  pati: "https://github.com/SalihYzts/pati-rotasi",
  gdd: "https://github.com/SalihYzts/gdd-creator",
  turkos: "https://github.com/SalihYzts/TurkOS",
};

const ui = {
  skip: { tr: "İçeriğe geç", en: "Skip to content" },
  langSwitch: { tr: "English", en: "Türkçe" },
  langSwitchShort: { tr: "EN", en: "TR" },
  themeToggle: { tr: "Gündüz ya da gece baskısı", en: "Day or night edition" },
  externalHint: { tr: "(yeni sekmede açılır)", en: "(opens in a new tab)" },
  navLabel: { tr: "Dergi bölümleri", en: "Magazine sections" },

  // Kapak
  issue: { tr: "Sayı 26", en: "Issue 26" },
  issueDate: { tr: "Kasım 2026", en: "November 2026" },
  issueTag: { tr: "Oyun ve yazılım dergisi", en: "Games & software magazine" },
  coverKicker: { tr: "Kapak konusu", en: "Cover story" },
  coverTitle: { tr: "Arayüzsüz bir nöbet", en: "A night watch with no HUD" },
  coverDeck: {
    tr: "Kralın Sözü: ekranında tek bir gösterge olmayan, 2000 gecelik bir simülasyonla dengelenmiş birinci şahıs nöbet oyunu.",
    en: "Kralın Sözü: a first-person guard game with no on-screen interface, balanced with a 2,000-night simulation.",
  },
  coverAlt: { tr: "Kralın Sözü: karlı bir gecede iki nöbet kulesi arasındaki kapı", en: "Kralın Sözü: the gate between two watchtowers on a snowy night" },
  stickerTop: { tr: "Bu sayıda", en: "Inside" },
  stickerMain: { tr: "CV hediye", en: "Free CV" },
  readIssue: { tr: "Sayıyı oku", en: "Read the issue" },

  // İçindekiler ve editörden
  tocTitle: { tr: "İçindekiler", en: "Contents" },
  editorTitle: { tr: "Editörden", en: "From the editor" },
  editorLetter: {
    tr: [
      "Merhaba, ben Salih. Çanakkale Onsekiz Mart Üniversitesi'nde oyun geliştirme okuyorum ve 7 yıldır kendi kendime kod yazıyorum.",
      "Bu sayıda iki işimi bir arada bulacaksın: Unity'de yaptığım oyunlar ve React, Python, Go ile yazdığım yazılımlar. İkisini de fikirden yayına kadar götürüyorum. Bağımsız ekip Volpen'in kurucusuyum.",
    ],
    en: [
      "Hi, I'm Salih. I study game development at Çanakkale Onsekiz Mart University and have been teaching myself to code for 7 years.",
      "This issue puts both halves of my work side by side: the games I make in Unity and the software I write in React, Python and Go. I take both from idea to release. I founded the independent studio Volpen.",
    ],
  },
  editorSign: { tr: "Salih Yazıtaş, genel yayın yönetmeni", en: "Salih Yazıtaş, editor-in-chief" },
  photoAlt: { tr: "Salih Yazıtaş'ın fotoğrafı", en: "Photo of Salih Yazıtaş" },

  // Bölümler
  secGame: { tr: "Oyun", en: "Games" },
  secCode: { tr: "Yazılım", en: "Software" },
  secGameDeck: { tr: "Unity ve C# ile yaptığım oyunlar: tek başıma, ekiple ve jamlerde.", en: "Games I made in Unity and C#: solo, with a team and at jams." },
  secCodeDeck: { tr: "Web, backend, masaüstü ve yapay zekâ: yayına aldığım yazılımlar.", en: "Web, backend, desktop and AI: software I shipped." },
  briefsGame: { tr: "Kısa kısa: jam ve ekip oyunları", en: "In brief: jam and team games" },
  briefsCode: { tr: "Kısa kısa: araçlar ve siteler", en: "In brief: tools and sites" },
  specTitle: { tr: "Künye", en: "Fact file" },
  specKind: { tr: "Tür ve rol", en: "Type and role" },
  specDate: { tr: "Tarih", en: "Date" },
  specTech: { tr: "Teknoloji", en: "Tech" },
  numbersTitle: { tr: "Rakamlarla", en: "By the numbers" },
  page: { tr: "s.", en: "p." },

  journeyTitle: { tr: "Dosya: Yolculuk", en: "Feature: The journey" },
  journeyDeck: { tr: "Deneyim, okul ve topluluk işleri. En yenisi en üstte.", en: "Work, school and community roles. Newest first." },
  status: {
    active: { tr: "Sürüyor", en: "Ongoing" },
    done: { tr: "Tamamlandı", en: "Done" },
    locked: { tr: "Yakında", en: "Coming soon" },
  },
  lockedTitle: { tr: "Yeni bir görev yolda", en: "A new role is on its way" },
  lockedText: { tr: "Bu kayıt yakında eklenecek.", en: "This entry is coming soon." },

  awardsTitle: { tr: "Rozetler", en: "Badges" },
  awardsDeck: { tr: "Her rozetin arkasında ölçülebilir bir şey var. Biri gizli.", en: "Every badge stands for something you can check. One is hidden." },
  secretName: { tr: "Gizli rozet", en: "Hidden badge" },
  secretHint: { tr: "Klasik bir hile kodu açıyor.", en: "A classic cheat code unlocks it." },

  guideTitle: { tr: "Rehber: alet çantası", en: "Guide: the toolkit" },
  guideDeck: { tr: "Seviye ya da yüzde yok. Her satırda o aracı nerede kullandığım yazıyor.", en: "No levels or percentages. Each row says where I've actually used it." },
  guideCat: { tr: "Alan", en: "Area" },
  guideTools: { tr: "Araçlar", en: "Tools" },
  guideUsed: { tr: "Kullandığım yer", en: "Used in" },
  guideLangs: { tr: "Diller", en: "Languages" },

  lettersTitle: { tr: "Okur mektupları", en: "Letters" },
  lettersDeck: { tr: "Staj, ekip ya da proje için yazabilirsin. Her mektubu okuyorum.", en: "Write about internships, teams or projects. I read every letter." },
  copyEmail: { tr: "Adresi kopyala", en: "Copy address" },
  copied: { tr: "E-posta adresi kopyalandı", en: "Email address copied" },
  copyFailed: { tr: "Kopyalanamadı, adresi elle seç", en: "Couldn't copy, select the address instead" },
  cvTr: { tr: "CV'yi indir, Türkçe PDF", en: "Download CV, Turkish PDF" },
  cvEn: { tr: "CV'yi indir, İngilizce PDF", en: "Download CV, English PDF" },
  imprintTitle: { tr: "Künye", en: "Masthead" },
  imprint: [
    { k: { tr: "Sahibi ve genel yayın yönetmeni", en: "Owner and editor-in-chief" }, v: "Salih Yazıtaş" },
    { k: { tr: "Yazı işleri, kod ve tasarım", en: "Editorial, code and design" }, v: "Salih Yazıtaş" },
    { k: { tr: "Yayınevi", en: "Publisher" }, v: { tr: "Volpen, Çanakkale", en: "Volpen, Çanakkale" } },
    { k: { tr: "Okul", en: "School" }, v: { tr: "ÇOMÜ, Oyun Geliştirme ve Programlama, 2. sınıf", en: "ÇOMÜ, Game Development and Programming, 2nd year" } },
    { k: { tr: "Diller", en: "Languages" }, v: { tr: "Türkçe (ana dil), İngilizce (teknik)", en: "Turkish (native), English (technical)" } },
    { k: { tr: "Baskı", en: "Printed on" }, v: "GitHub Pages" },
  ],
  nextTitle: { tr: "Gelecek sayıda", en: "Next issue" },
  next: {
    tr: ["LAST DAWN: gündüz yağma, gece savunma", "Under the Counter: Steam Next Fest demosu yolda"],
    en: ["LAST DAWN: scavenge by day, defend by night", "Under the Counter: a Steam Next Fest demo on the way"],
  },
  footer: { tr: "Bu dergi elle dizildi: çerçeve yok, izleyici yok.", en: "Hand-set: no framework, no trackers." },
  footerHint: { tr: "Gizli rozet için: ↑ ↑ ↓ ↓ ← → ← → B A", en: "For the hidden badge: ↑ ↑ ↓ ↓ ← → ← → B A" },
  toastSecret: { tr: "Gizli rozet açıldı: Hile kodu", en: "Hidden badge unlocked: Cheat code" },
  // Okuyucu (sayfa çevirme)
  readerLabel: { tr: "Dergi sayfaları", en: "Magazine pages" },
  prevPage: { tr: "Önceki sayfa", en: "Previous page" },
  nextPage: { tr: "Sonraki sayfa", en: "Next page" },
  jumpTo: { tr: "Sayfaya git", en: "Go to page" },
  pageWord: { tr: "Sayfa", en: "Page" },
  pagesWord: { tr: "Sayfa", en: "Pages" },
  ofWord: { tr: "/", en: "/" },
  swipeHint: { tr: "Sayfa çevirmek için kaydır ya da ok tuşlarını kullan", en: "Swipe or use the arrow keys to turn pages" },
  backCover: { tr: "Arka kapak", en: "Back cover" },
  coverPage: { tr: "Kapak", en: "Cover" },
  adWord: { tr: "Reklam", en: "Advertisement" },
  ads: [
    {
      id: "volpen", href: "https://salihyzts.github.io/VolpenWeb/",
      title: "Volpen", line: { tr: "Oyun, yazılım ve tasarım. Bir tilkinin peşinde.", en: "Games, software and design. Following a fox." },
      small: { tr: "Velox: PC oyun · Lagopus: yazılım · Zerda: mobil oyun", en: "Velox: PC games · Lagopus: software · Zerda: mobile games" },
      cta: { tr: "Siteyi aç", en: "Visit the site" },
    },
    {
      id: "kralin-itch", href: "https://salihyzts.itch.io/kralin-sozu", image: "kralin-sozu-king_promise.webp",
      title: "Kralın Sözü", line: { tr: "Üç kış gecesi. Bir kapı. Bir söz.", en: "Three winter nights. One gate. One promise." },
      small: { tr: "Windows ve Linux için itch.io'da", en: "On itch.io for Windows and Linux" },
      cta: { tr: "itch.io'da indir", en: "Get it on itch.io" },
    },
    {
      id: "cv", cv: true,
      title: { tr: "CV hediye", en: "CV inside" }, line: { tr: "Bu sayıyla birlikte: Salih Yazıtaş'ın CV'si, Türkçe ve İngilizce.", en: "Free with this issue: Salih Yazıtaş's CV, in Turkish and English." },
      small: { tr: "PDF, iki sayfa", en: "PDF" },
      cta: { tr: "CV'yi indir", en: "Download the CV" },
    },
  ],
  inSection: { tr: "Bu bölümde", en: "In this section" },
  backLine: { tr: "Bir sonraki sayıda görüşmek üzere.", en: "See you in the next issue." },
  price: { tr: "Fiyatı: bir e-posta", en: "Price: one email" },
  links: {
    play: { tr: "itch.io'da oyna", en: "Play on itch.io" },
    open: { tr: "Siteyi aç", en: "Open the site" },
    source: { tr: "Kaynak kod", en: "Source code" },
    release: { tr: "İndir", en: "Download" },
  },
};

const meta = {
  title: { tr: "Salih Yazıtaş · Oyun ve Yazılım Geliştirici", en: "Salih Yazıtaş · Game & Software Developer" },
  description: {
    tr: "Salih Yazıtaş: oyun ve yazılım geliştirici. Unity oyunları (Kralın Sözü, Under the Counter), 19 dilde yayındaki MyEverythingList, açık kaynak NeRoBoT ve RaiPy. Volpen'in kurucusu.",
    en: "Salih Yazıtaş: game and software developer. Unity games (Kralın Sözü, Under the Counter), MyEverythingList live in 19 languages, open-source NeRoBoT and RaiPy. Founder of Volpen.",
  },
  ogAlt: {
    tr: "YAZITAŞ dergisinin kapağı: Kralın Sözü'nün karlı kapısı üstünde kırmızı logo, Salih Yazıtaş adı ve sarı rakamlar",
    en: "Cover of YAZITAŞ magazine: a red masthead over the snowy gate of Kralın Sözü, Salih Yazıtaş's name and yellow numbers",
  },
};

// Kapaktaki başlıklar (gerçek rakamlar, cv-data.js'den)
const coverLines = [
  { big: "19", text: { tr: "dilde yayında: MyEverythingList", en: "languages live: MyEverythingList" }, href: "#myeverythinglist" },
  { big: "614", text: { tr: "testli yapay zekâ motoru: RaiPy", en: "tests behind an AI engine: RaiPy" }, href: "#raipy" },
  { big: { tr: "1,6 ms", en: "1.6 ms" }, text: { tr: "kare süresi, RTX 4060'ta", en: "per frame on an RTX 4060" }, href: "#kralin-sozu" },
];

// Projeler data/projects.json içinde (yerel panelden düzenlenir: node admin/server.js)

// Görev günlüğü, en yeni üstte. status: active | done | locked
// { status: "locked" } yazılırsa içeriği gizli bir "yakında" kaydı çıkar.
// Kafe Finans reposu gizli: bağlantı verme.
const quests = [
  {
    status: "active", title: { tr: "Yazılım ve otomasyon danışmanı (serbest)", en: "Software & automation consultant (freelance)" },
    org: "Petra Cafe, Çanakkale", date: "2026",
    goals: {
      tr: [
        "Truva Teknoloji ile ortak bir arabirim: QR menü ve garson uygulamasından gelen siparişler birkaç saniyede kasadaki Akınsoft Wolvox'a işleniyor (Go, ~3.600 satır, tek Windows servisi)",
        "Aynı siparişin iki kez yazılmasını engelleyen iş kaydı; kesintiden sonra kendiliğinden toparlanma",
        "Kafe Finans: ciroyu POS gün sonuyla karşılaştıran gelir-gider uygulaması (Electron, React, SQLite)",
      ],
      en: [
        "An integration built with Truva Teknoloji: orders from the QR menu and waiter app reach Akınsoft Wolvox at the register within seconds (Go, ~3,600 lines, one Windows service)",
        "A job log that stops any order from being written twice; recovers by itself after outages",
        "Kafe Finans: an income and expense app that checks revenue against POS end-of-day totals (Electron, React, SQLite)",
      ],
    },
  },
  {
    status: "done", title: { tr: "Yazılım geliştirme stajyeri", en: "Software development intern" },
    org: "Stoneograph", date: { tr: "Ağustos 2026", en: "Aug 2026" },
    goals: {
      tr: ["Parsel'in backend'ini yazdım: yaklaşık 10 bin satır, 103 test", "Canlı açık artırma ve tapu doğrulama", "JWT ve Google OAuth ile giriş, TR/EN arayüz", "Danışmanım için sunucu maliyeti karşılaştırma raporu"],
      en: ["Wrote Parsel's backend: about 10k lines, 103 tests", "Live auctions and title-deed verification", "JWT and Google OAuth sign-in, TR/EN interface", "A hosting cost comparison for my mentor"],
    },
  },
  {
    status: "active", title: { tr: "Kurucu ve yazılım geliştirici", en: "Founder & software developer" },
    org: "Volpen", date: { tr: "2025'ten beri", en: "Since 2025" },
    goals: {
      tr: ["Ekibi kurdum: Velox (PC oyun), Lagopus (yazılım), Zerda (mobil oyun)", "Ekibin oyunlarının kodunu yazdım", "MyEverythingList'i tek başıma geliştirdim", "Tanıtım sitesini çerçevesiz yaptım"],
      en: ["Founded the studio: Velox (PC games), Lagopus (software), Zerda (mobile games)", "Wrote the code for the team's games", "Built MyEverythingList on my own", "Built the studio site without a framework"],
    },
  },
  {
    status: "done", title: { tr: "Görevli ve mentör", en: "Staff & mentor" },
    org: "Troia Game Jam 2026", date: { tr: "Mayıs 2026", en: "May 2026" },
    goals: {
      tr: ["48 saatlik jamde katılımcılara mentörlük yaptım", "Roll-up ve sertifikaları tasarladım"],
      en: ["Mentored participants at a 48-hour jam", "Designed the roll-up banner and certificates"],
    },
  },
  {
    status: "active", title: { tr: "Kurucu yönetici ve sayman", en: "Founding board member & treasurer" },
    org: { tr: "Oyun Tasarımı Kulübü, ÇOMÜ", en: "Game Design Club, ÇOMÜ" }, date: "",
    goals: {
      tr: ["Kulübü kurdum ve bütçesini yönetiyorum", "Kulübün sitesi Oyun Vitrini'ni geliştirdim"],
      en: ["Founded the club and manage its budget", "Built the club's website, Oyun Vitrini"],
    },
  },
  {
    status: "active", title: { tr: "Oyun Geliştirme ve Programlama (ön lisans)", en: "Game Development and Programming (associate degree)" },
    org: { tr: "Çanakkale Onsekiz Mart Üniversitesi", en: "Çanakkale Onsekiz Mart University" }, date: { tr: "2025 – 2027, 2. sınıf", en: "2025 – 2027, 2nd year" },
    goals: { tr: [], en: [] },
  },
  {
    status: "done", title: { tr: "Dizgici (typesetter)", en: "Typesetter" },
    org: { tr: "Manga fansub", en: "Manga fansub" }, date: "",
    goals: {
      tr: ["Çeviri metinlerini Photoshop'ta sayfaya yerleştirip kültürel uyarlamasını yaptım"],
      en: ["Placed translated text on pages in Photoshop and adapted it to the culture"],
    },
  },
  {
    status: "done", title: { tr: "Mekatronik", en: "Mechatronics" },
    org: { tr: "Yozgat Bilim Teknik Lisesi", en: "Yozgat Science and Technology High School" }, date: "",
    goals: { tr: [], en: [] },
  },
];

// Başarımlar. icon: assets içindeki piksel ikon adı (src/icons.js)
const achievements = [
  { icon: "globe", name: { tr: "Çok dilli", en: "Polyglot" }, how: { tr: "MyEverythingList'i 19 dilde yayına al", en: "Ship MyEverythingList in 19 languages" } },
  { icon: "star", name: { tr: "Yıldız avcısı", en: "Star collector" }, how: { tr: "NeRoBoT GitHub'da 7 yıldız topla", en: "Get 7 stars on GitHub for NeRoBoT" } },
  { icon: "flag", name: "Global Game Jam", how: { tr: "2026'da İstanbul @BUG'da bir oyun bitir", en: "Finish a game at Istanbul @BUG in 2026" } },
  { icon: "flag", name: { tr: "Yıldız Jam", en: "Yıldız Jam" }, how: { tr: "The Rolling Pizz'i jam süresinde yetiştir", en: "Finish The Rolling Pizz within the jam" } },
  { icon: "shield", name: { tr: "Mentör", en: "Mentor" }, how: { tr: "Troia Game Jam 2026'da takımlara yol göster", en: "Guide teams at Troia Game Jam 2026" } },
  { icon: "crown", name: { tr: "Lonca kurucusu", en: "Guild founder" }, how: { tr: "Volpen'i kur, üç dal aç", en: "Found Volpen with three branches" } },
  { icon: "key", name: { tr: "Kulüp kurucusu", en: "Club founder" }, how: { tr: "Oyun Tasarımı Kulübü'nü kur ve kasasını tut", en: "Found the Game Design Club and keep its books" } },
  { icon: "check", name: { tr: "Test ustası", en: "Test master" }, how: { tr: "RaiPy'de 614 test yaz", en: "Write 614 tests for RaiPy" } },
  { icon: "chip", name: { tr: "VRAM diyeti", en: "VRAM diet" }, how: { tr: "7820 MiB'yi 3035 MiB'ye indir", en: "Cut 7820 MiB down to 3035 MiB" } },
  { icon: "bolt", name: { tr: "Kare bütçesi", en: "Frame budget" }, how: { tr: "Kralın Sözü'nü kare başına 1,6 ms'de çalıştır", en: "Run Kralın Sözü at 1.6 ms per frame" } },
  { icon: "moon", name: { tr: "2000 gece", en: "2,000 nights" }, how: { tr: "Bir denge simülasyonunu 2000 gece çalıştır", en: "Run a balance simulation for 2,000 nights" } },
];

// Yetenek ağacı
const skills = [
  { branch: { tr: "Oyun", en: "Games" }, items: ["Unity 6", "URP", "NavMesh", "Input System", "Unreal (Blueprint)", "Ren'Py"], used: "Kralın Sözü, Under the Counter, LAST DAWN, RaiPy" },
  { branch: { tr: "Web ve backend", en: "Web & backend" }, items: ["React 19", "Next.js", "Vite", "Tailwind", "TanStack Query", "Zod", "Node.js", "FastAPI", "SQLAlchemy", "WebSocket", "JWT", "OAuth 2.0"], used: "MyEverythingList, Parsel, Heren Agent" },
  { branch: { tr: "Veri ve bulut", en: "Data & cloud" }, items: ["Supabase", "PostgreSQL", "SQLite", "Cloudflare Workers", "Docker", "GitHub Actions", "Render"], used: "MyEverythingList, Oyun Vitrini, Görevler" },
  { branch: { tr: "Masaüstü ve mobil", en: "Desktop & mobile" }, items: ["Electron", "Tauri v2", "Expo", "React Native", "Capacitor", "PWA"], used: "NeRoBoT, RaiPy, Pati Rotası, Kafe Finans" },
  { branch: { tr: "Yapay zekâ", en: "AI" }, items: ["LLM entegrasyonu|LLM integration", "Claude API", "Ollama", "diffusers", "ComfyUI", "faster-whisper", "Piper TTS"], used: "NeRoBoT, RaiPy, Heren Agent, Parsel" },
  { branch: { tr: "Test ve araçlar", en: "Testing & tools" }, items: ["Vitest", "pytest", "Playwright", "Git", "Linux", "ffmpeg"], used: "RaiPy, Kralın Sözü, Parsel" },
  { branch: { tr: "Tasarım", en: "Design" }, items: ["Photoshop", "Affinity", "VRoid Studio", "SolidWorks", "Arduino"], used: { tr: "Troia Game Jam, manga fansub", en: "Troia Game Jam, manga fansub" } },
];
const languages = ["TypeScript", "JavaScript", "C#", "Python", "SQL", "Go", "Rust", "Bash"];

const socials = [
  { name: "GitHub", handle: "SalihYzts", href: links.github },
  { name: "LinkedIn", handle: "salih-yazıtaş", href: links.linkedin },
  { name: "itch.io", handle: "salihyzts", href: links.itch },
  { name: "Volpen", handle: { tr: "ekip sitesi", en: "studio site" }, href: links.volpen },
];

// ---------- Üç sayı: Ben, Oyun, Yazılım. Masada üçü birden durur (index.html). ----------
// slug: adres (TR: /ben/, EN: /en/about/). cover: kapağın metni. editor: o sayının editör yazısı.
const issues = [
  {
    key: "ben", n: 1, slug: { tr: "ben", en: "about" },
    name: { tr: "Ben", en: "About me" },
    deck: { tr: "Profil, deneyim, okul ve topluluk, beceriler ve CV.", en: "Profile, work, school and community, skills and CV." },
    meta: {
      title: { tr: "Salih Yazıtaş · Ben: profil, deneyim ve CV", en: "Salih Yazıtaş · About me: profile, work and CV" },
      description: {
        tr: "Salih Yazıtaş'ın profili: Petra Cafe'de yazılım ve otomasyon danışmanlığı, Stoneograph stajı, Volpen'in kuruculuğu, ÇOMÜ Oyun Geliştirme ve Programlama, beceriler ve indirilebilir CV.",
        en: "Salih Yazıtaş's profile: software and automation consulting at Petra Cafe, an internship at Stoneograph, founder of Volpen, game development at ÇOMÜ, skills and a downloadable CV.",
      },
    },
    cover: {
      kicker: { tr: "Profil, deneyim, CV", en: "Profile, work, CV" },
      title: { tr: "Ben kimim?", en: "Who am I?" },
      deck: { tr: "7 yıldır kendi kendine yazılım geliştiren bir oyun programlama öğrencisi. Fikirden yayına ürün çıkarıyor.", en: "A game programming student, self-taught in software for 7 years, taking products from idea to release." },
      lines: [
        { big: "3", text: { tr: "iş, staj ve kurucu deneyimi", en: "jobs: consulting, internship, studio" }, href: "#is" },
        { big: "12", text: { tr: "rozet, biri gizli", en: "badges, one hidden" }, href: "#rozetler" },
      ],
      sticker: { top: { tr: "İçinde", en: "Inside" }, main: { tr: "CV indir", en: "Get the CV" }, cv: true },
    },
    editor: {
      title: { tr: "Editörden", en: "From the editor" },
      letter: {
        tr: [
          "Merhaba, ben Salih. Çanakkale Onsekiz Mart Üniversitesi'nde oyun geliştirme okuyorum ve 7 yıldır kendi kendime kod yazıyorum.",
          "Bu sayı beni anlatıyor: bir kafe için yaptığım işler, stajım, kurduğum ekip Volpen, okul ve kulüp. Oyunlarım ve yazılımlarım masadaki diğer iki sayıda. CV'yi buradan indirebilirsin.",
        ],
        en: [
          "Hi, I'm Salih. I study game development at Çanakkale Onsekiz Mart University and have been teaching myself to code for 7 years.",
          "This issue is about me: my work for a cafe, my internship, the studio I founded, school and the club. My games and software are in the other two issues on the desk. You can grab the CV right here.",
        ],
      },
    },
  },
  {
    key: "oyun", n: 2, slug: { tr: "oyun", en: "games" },
    name: { tr: "Oyun", en: "Games" },
    deck: { tr: "Kralın Sözü, ekip oyunları, jamler ve kulüp.", en: "Kralın Sözü, team games, jams and the club." },
    meta: {
      title: { tr: "Salih Yazıtaş · Oyun: Kralın Sözü ve diğer oyunlar", en: "Salih Yazıtaş · Games: Kralın Sözü and more" },
      description: {
        tr: "Salih Yazıtaş'ın oyunları: arayüzsüz nöbet oyunu Kralın Sözü, baş programcısı olduğu Under the Counter, LAST DAWN, Pati Rotası, jam oyunları ve Volpen'in oyunları.",
        en: "Games by Salih Yazıtaş: the HUD-less guard game Kralın Sözü, Under the Counter (lead programmer), LAST DAWN, Pati Rotası, jam games and Volpen's games.",
      },
    },
    cover: {
      kicker: { tr: "Kapak konusu", en: "Cover story" },
      title: ui.coverTitle,
      deck: ui.coverDeck,
      lines: [
        { big: "2000", text: { tr: "gecelik denge simülasyonu", en: "nights of balance simulation" }, href: "#kralin-sozu-yapim" },
        { big: "10", text: { tr: "son, 3 gece, 17 ziyaretçi", en: "endings, 3 nights, 17 visitors" }, href: "#kralin-sozu-oyun" },
        { big: { tr: "1,6 ms", en: "1.6 ms" }, text: { tr: "kare süresi, RTX 4060'ta", en: "per frame on an RTX 4060" }, href: "#kralin-sozu-yapim" },
      ],
      sticker: { top: { tr: "Ücretsiz", en: "Free" }, main: { tr: "itch.io'da oyna", en: "Play on itch.io" }, href: links.kralinItch },
    },
    editor: {
      title: { tr: "Oyun masasından", en: "From the game desk" },
      letter: {
        tr: [
          "Bu sayı oyunlara ayrıldı. Kapakta tek başıma yaptığım Kralın Sözü var: ekranında tek bir gösterge olmayan, bir halk hikâyesinden uyarlanmış bir nöbet oyunu.",
          "Ardından ekip oyunları geliyor: baş programcısı olduğum Under the Counter, Volpen'de yazılım ve pazarlamasını yürüttüğüm LAST DAWN ve jamlerde yaptığımız oyunlar. Hepsi Unity ve C# ile.",
        ],
        en: [
          "This issue is about games. On the cover is Kralın Sözü, which I made on my own: a guard game based on a folk tale, with not a single gauge on screen.",
          "Then come the team games: Under the Counter, where I'm lead programmer, LAST DAWN, where I run software and marketing at Volpen, and the games we made at jams. All in Unity and C#.",
        ],
      },
      numbers: [
        { v: "10", k: { tr: "oyun projesi", en: "game projects" } },
        { v: "3", k: { tr: "jam: GGJ, Yıldız, Troia", en: "jams: GGJ, Yıldız, Troia" } },
        { v: "88", k: { tr: "script, Under the Counter", en: "scripts, Under the Counter" } },
        { v: "21", k: { tr: "kulüp oyunu, Oyun Vitrini", en: "club games, Oyun Vitrini" } },
      ],
    },
    back: { image: "last-dawn.webp", next: ui.next },
  },
  {
    key: "yazilim", n: 3, slug: { tr: "yazilim", en: "software" },
    name: { tr: "Yazılım", en: "Software" },
    deck: { tr: "MyEverythingList, staj projesi Parsel, açık kaynak araçlar ve kafe işleri.", en: "MyEverythingList, the Parsel internship, open-source tools and cafe work." },
    meta: {
      title: { tr: "Salih Yazıtaş · Yazılım: MyEverythingList ve diğer projeler", en: "Salih Yazıtaş · Software: MyEverythingList and more" },
      description: {
        tr: "Salih Yazıtaş'ın yazılımları: 19 dilde yayındaki MyEverythingList, açık kaynak NeRoBoT, RaiPy, Heren Agent, Stoneograph stajında yazdığı Parsel ve Petra Cafe için yaptığı işler.",
        en: "Software by Salih Yazıtaş: MyEverythingList live in 19 languages, open-source NeRoBoT, RaiPy, Heren Agent, Parsel from a Stoneograph internship and work for Petra Cafe.",
      },
    },
    cover: {
      kicker: { tr: "Kapak konusu", en: "Cover story" },
      title: { tr: "MyEverythingList", en: "MyEverythingList" },
      deck: { tr: "Tek başına geliştirilip 19 dilde yayına alınan, reklamsız bir medya takip platformu.", en: "An ad-free media tracker, built by one person and live in 19 languages." },
      lines: [
        { big: { tr: "58 bin", en: "58k" }, text: { tr: "satır TypeScript", en: "lines of TypeScript" }, href: "#myeverythinglist-yapim" },
        { big: "614", text: { tr: "testli yapay zekâ motoru: RaiPy", en: "tests behind an AI engine: RaiPy" }, href: "#raipy" },
      ],
      sticker: { top: { tr: "Açık kaynak", en: "Open source" }, main: { tr: "NeRoBoT içeride", en: "NeRoBoT inside" }, href: "#nerobot" },
    },
    editor: {
      title: { tr: "Yazılım masasından", en: "From the software desk" },
      letter: {
        tr: [
          "Bu sayı yazılımlara ayrıldı. Kapakta Ağustos'tan Ekim'e tek başıma geliştirip 19 dilde yayına aldığım MyEverythingList var.",
          "Ardından açık kaynak masaüstü uygulamaları, Stoneograph stajında yazdığım açık artırma platformu Parsel ve bir kafenin kasasıyla konuşan servisler geliyor. React, Python, Go ve Rust ile.",
        ],
        en: [
          "This issue is about software. On the cover is MyEverythingList, which I built on my own from August to October and shipped in 19 languages.",
          "Then come open-source desktop apps, Parsel, the auction platform I built during my internship at Stoneograph, and services that talk to a cafe's register. In React, Python, Go and Rust.",
        ],
      },
      numbers: [
        { v: "13", k: { tr: "yazılım projesi", en: "software projects" } },
        { v: "19", k: { tr: "dilde yayında", en: "languages live" } },
        { v: "103", k: { tr: "test, Parsel backend", en: "tests, Parsel backend" } },
        { v: "7", k: { tr: "GitHub yıldızı, NeRoBoT", en: "GitHub stars, NeRoBoT" } },
      ],
    },
  },
];

// Ben sayısı: iş deneyimi (CV'deki maddeler). link: başka sayıdaki ilgili sayfa
const work = [
  {
    title: { tr: "Yazılım ve otomasyon danışmanı", en: "Software & automation consultant" }, org: { tr: "Petra Cafe, Çanakkale · serbest", en: "Petra Cafe, Çanakkale · freelance" }, date: "2026",
    meta: { tr: "Go, Windows servisleri, Akınsoft Wolvox Restoran, Electron, React, SQLite", en: "Go, Windows services, Akınsoft Wolvox Restaurant, Electron, React, SQLite" },
    bullets: {
      tr: [
        "Truva Teknoloji ile ortak bir arabirim geliştirdim: QR menüden ve garson uygulamasından gelen sipariş, iptal ve masa taşıma işlerini kasadaki Akınsoft Wolvox Restoran'a birkaç saniyede işliyor. Tek bir Windows servisi (Go, yaklaşık 3.600 satır), dışarıya yalnızca HTTPS ile bağlanıyor.",
        "Aynı siparişin iki kez yazılmasını engelleyen bir iş kaydı kurdum. Mutfak ve bar fişleri otomatik basılıyor, ürün ve masa listeleri her gün eşitleniyor; servis kesintiden sonra kendiliğinden toparlanıyor.",
        "Kafe için Kafe Finans adlı gelir-gider ve ciro uygulamasını geliştirdim. Menülendin QR menüsünden gelen siparişleri Akınsoft'a aktaran bir köprü de yazdım.",
      ],
      en: [
        "With Truva Teknoloji, I built an integration that writes orders, cancellations and table moves from the QR menu and waiter app into Akınsoft Wolvox Restaurant at the register within seconds. One Windows service (Go, about 3,600 lines) that connects out over HTTPS only.",
        "I built a job log that stops any order from being written twice. Kitchen and bar tickets print automatically, product and table lists sync daily, and the service recovers by itself after an outage.",
        "I built Kafe Finans, the cafe's income, expense and revenue app, and a bridge that moves orders from the Menülendin QR menu into Akınsoft.",
      ],
    },
    numbers: [
      { v: { tr: "~3.600", en: "~3,600" }, k: { tr: "satır Go, tek Windows servisi", en: "lines of Go, one Windows service" } },
      { v: "2", k: { tr: "QR menü köprüsü: Truva ve Menülendin", en: "QR menu bridges: Truva and Menülendin" } },
      { v: "240", k: { tr: "test, Kafe Finans", en: "tests, Kafe Finans" } },
    ],
    link: { issue: "yazilim", id: "kafe-finans" },
  },
  {
    title: { tr: "Yazılım geliştirme stajyeri", en: "Software development intern" }, org: "Stoneograph", date: { tr: "Ağustos 2026", en: "Aug 2026" },
    meta: { tr: "Python, FastAPI, SQLAlchemy, WebSocket, Shapely, Playwright", en: "Python, FastAPI, SQLAlchemy, WebSocket, Shapely, Playwright" },
    bullets: {
      tr: [
        "Emlak sektörü için Parsel'i geliştirdim: tapu doğrulamalı bir arsa pazaryeri ve açık artırma platformu. Yaklaşık 10 bin satır backend kodu ve 103 test.",
        "TKGM üzerinden “Tapu Doğrulanmış” rozeti, eğime göre düzeltilmiş alan analizi, son saniye teklifinde süreyi uzatan canlı açık artırma ve seslendirmeli sanal drone videoları.",
      ],
      en: [
        "I built Parsel for the real-estate sector: a land marketplace and auction platform with title-deed verification. About 10k lines of backend code and 103 tests.",
        "A “title-verified” badge via TKGM, slope-corrected area analysis, live auctions that extend on last-second bids, and narrated virtual drone videos.",
      ],
    },
    link: { issue: "yazilim", id: "parsel" },
  },
  {
    title: { tr: "Kurucu ve yazılım geliştirici", en: "Founder & software developer" }, org: "Volpen", date: { tr: "2025'ten beri", en: "Since 2025" },
    meta: { tr: "Velox (PC oyun), Lagopus (yazılım), Zerda (mobil oyun)", en: "Velox (PC games), Lagopus (software), Zerda (mobile games)" },
    bullets: {
      tr: [
        "Oyun, yazılım ve tasarım üreten bağımsız ekibi kurdum, projelerin yazılım tarafını yürütüyorum. Yazılım dalının ana ürünü MyEverythingList'i tek başıma geliştirdim.",
        "Ekibin oyunlarının kodunu yazdım: ColorLand (1 haftada, ilk 3D projem), ÜçKKeNİci (2 günde) ve Ağaçlaştırılmış Elma (2 ay). LAST DAWN'da yazılım ve pazarlamadan sorumluyum.",
        "Tanıtım sitesini framework kullanmadan yaptım: PWA, TR/EN, WCAG AA kontrast ve JSON-LD ile SEO.",
      ],
      en: [
        "I founded an independent team making games, software and design, and lead the software side of its projects. I built the software branch's main product, MyEverythingList, on my own.",
        "I wrote the code for the team's games: ColorLand (in one week, my first 3D project), ÜçKKeNİci (in two days) and Ağaçlaştırılmış Elma (two months). I handle software and marketing for LAST DAWN.",
        "I built the studio site without a framework: a PWA in TR/EN with WCAG AA contrast and JSON-LD for SEO.",
      ],
    },
    link: { issue: "oyun", id: "last-dawn" },
  },
];

// Ben sayısı: okul ve topluluk (en yeni üstte)
const school = [
  quests[5], quests[4], quests[3],
  {
    status: "done", title: { tr: "Katılımcı", en: "Participant" },
    org: "Global Game Jam 2026 (İstanbul @BUG) · Yıldız Jam 2026", date: "2026",
    goals: { tr: ["Let's Cook a Mask ve The Rolling Pizz'i jam süresinde ekiple bitirdik"], en: ["Finished Let's Cook a Mask and The Rolling Pizz with teams within the jams"] },
  },
  quests[6], quests[7],
];

// Oyun sayısı: kulüp ve jamler
const community = {
  title: { tr: "Topluluk: kulüp ve jamler", en: "Community: the club and jams" },
  deck: { tr: "Oyunları tek başına değil, bir topluluğun içinde yapmak.", en: "Making games inside a community, not alone." },
  entries: [
    { big: "21", title: { tr: "Oyun Tasarımı Kulübü", en: "Game Design Club" }, role: { tr: "Kurucu yönetici ve sayman, ÇOMÜ", en: "Founding board member & treasurer, ÇOMÜ" },
      text: { tr: "Kulübü kurdum, bütçesini yönetiyorum. Kulübün sitesi Oyun Vitrini, üyelerin jamlerde ve derslerde yaptığı 21 oyunu tanıtıyor: üye hesapları, puan tablosu, yönetim paneli ve iki ekranlı stant modu var.", en: "I founded the club and manage its budget. Its site, Oyun Vitrini, showcases 21 games members made at jams and in classes, with member accounts, a leaderboard, an admin panel and a two-screen booth mode." },
      link: { issue: "yazilim", id: "oyun-vitrini" } },
    { big: { tr: "48 sa", en: "48 h" }, title: { tr: "Troia Game Jam 2026", en: "Troia Game Jam 2026" }, role: { tr: "Görevli ve mentör, Mayıs 2026", en: "Staff & mentor, May 2026" },
      text: { tr: "ÇOMÜ Yazılım Geliştirme Kulübü ile Oyun Programlama Bölümü'nün düzenlediği 48 saatlik jamde görev aldım ve katılımcılara mentörlük yaptım. Roll-up'ı ve sertifikaları tasarladım.", en: "I worked at the 48-hour jam run by the ÇOMÜ Software Development Club and the Game Programming department, mentored teams, and designed the roll-up banner and certificates." } },
    { big: "GGJ", title: { tr: "Global Game Jam 2026", en: "Global Game Jam 2026" }, role: { tr: "Katılımcı, İstanbul @BUG", en: "Participant, Istanbul @BUG" },
      text: { tr: "Let's Cook a Mask'i jam süresinde ekiple bitirdik.", en: "We finished Let's Cook a Mask as a team within the jam." }, link: { issue: "oyun", id: "lets-cook-a-mask" } },
    { big: "4", title: { tr: "Yıldız Jam 2026", en: "Yıldız Jam 2026" }, role: { tr: "Unity geliştirici, Kozalak Çamları", en: "Unity developer, Kozalak Çamları" },
      text: { tr: "4 kişilik ekiple The Rolling Pizz'i yaptık; oyunun programlamasını üstlendim.", en: "We made The Rolling Pizz as a team of four; I programmed the game." }, link: { issue: "oyun", id: "the-rolling-pizz" } },
  ],
};

// Masa (giriş sayfası)
const desk = {
  heading: { tr: "Salih Yazıtaş: masada üç sayı var, birini seç", en: "Salih Yazıtaş: three issues on the desk, pick one" },
  note: { tr: "Hangisini okumak istersin?", en: "Which one would you like to read?" },
  noteSmall: { tr: "Bir sayıyı seç", en: "Pick an issue" },
  hint: { tr: "Bir sayı seç · ← → ile gez, Enter ile aç", en: "Pick an issue · ← → to browse, Enter to open" },
  hintTouch: { tr: "Okumak istediğin sayıya dokun", en: "Tap the issue you want to read" },
  cv: { tr: "Özgeçmiş", en: "Résumé" },
  cvLabel: { tr: "CV'yi indir, Türkçe PDF", en: "Download CV, English PDF" },
  openWord: { tr: "Aç", en: "Open" },
  back: { tr: "Masa", en: "Desk" },
  backLabel: { tr: "Masaya dön: üç sayının durduğu giriş", en: "Back to the desk with all three issues" },
  shelf: { tr: "Masadaki diğer sayılar", en: "Other issues on the desk" },
  issueWord: { tr: "Sayı", en: "Issue" },
};

module.exports = { links, ui, meta, coverLines, quests, achievements, skills, languages, socials, issues, work, school, community, desk };
