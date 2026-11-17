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

module.exports = { links, ui, meta, coverLines, quests, achievements, skills, languages, socials };
