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
  modeLabel: { tr: "Mod", en: "Mode" },
  modeGame: { tr: "Oyun", en: "Games" },
  modeCode: { tr: "Yazılım", en: "Software" },
  langSwitch: { tr: "English", en: "Türkçe" },
  langSwitchShort: { tr: "EN", en: "TR" },
  themeToggle: { tr: "Açık ya da koyu tema", en: "Light or dark theme" },
  soundOn: { tr: "Sesi aç", en: "Turn sound on" },
  soundOff: { tr: "Sesi kapat", en: "Turn sound off" },
  role: { tr: "Oyun ve yazılım geliştirici", en: "Game & software developer" },
  intro: {
    tr: "Çanakkale Onsekiz Mart Üniversitesi'nde oyun geliştirme okuyorum ve 7 yıldır kendi kendime kod yazıyorum. Unity'de oyun, React ve Python'la ürün geliştiriyorum, ikisini de yayına kadar götürüyorum. Bağımsız ekip Volpen'in kurucusuyum.",
    en: "I study game development at Çanakkale Onsekiz Mart University and have been teaching myself to code for 7 years. I make games in Unity and products with React and Python, and I take both all the way to release. I founded Volpen, an independent studio.",
  },
  pickMode: { tr: "Nereden başlamak istersin?", en: "Where do you want to start?" },
  pickGameTitle: { tr: "Oyunlar", en: "Games" },
  pickGameText: {
    tr: "Unity ve C#: Kralın Sözü, Under the Counter, LAST DAWN ve jam oyunları",
    en: "Unity and C#: Kralın Sözü, Under the Counter, LAST DAWN and jam games",
  },
  pickCodeTitle: { tr: "Yazılım", en: "Software" },
  pickCodeText: {
    tr: "Web, backend, masaüstü ve yapay zekâ: MyEverythingList, NeRoBoT, RaiPy",
    en: "Web, backend, desktop and AI: MyEverythingList, NeRoBoT, RaiPy",
  },
  terminalLine: { tr: "19 dilde yayında", en: "live in 19 languages" },
  menuLabel: { tr: "Ana menü", en: "Main menu" },
  hudLabel: { tr: "Kısa istatistikler", en: "Quick stats" },
  externalHint: { tr: "(yeni sekmede açılır)", en: "(opens in a new tab)" },

  levelsTitleGame: { tr: "Seviye seçimi", en: "Level select" },
  levelsTitleCode: { tr: "~/projeler", en: "~/projects" },
  levelsIntroGame: {
    tr: "Oyun modundasın: oyunlar ana görev, yazılım projeleri yan görev. Üstteki mod düğmesiyle sırayı değiştirebilirsin.",
    en: "You're in games mode: games are the main quest, software projects are side quests. Switch the order with the mode button at the top.",
  },
  levelsIntroCode: {
    tr: "Yazılım modundasın: yazılım projeleri ana görev, oyunlar yan görev. Üstteki mod düğmesiyle sırayı değiştirebilirsin.",
    en: "You're in software mode: software projects are the main quest, games are side quests. Switch the order with the mode button at the top.",
  },
  trackGame: { tr: "Oyunlar", en: "Games" },
  trackCode: { tr: "Yazılım", en: "Software" },
  mainQuest: { tr: "Ana görev", en: "Main quest" },
  sideQuest: { tr: "Yan görev", en: "Side quest" },
  stats: { tr: "İstatistikler", en: "Stats" },
  inventory: { tr: "Envanter", en: "Inventory" },
  moreGames: { tr: "Jam ve ekip oyunları", en: "Jam & team games" },
  moreCode: { tr: "Diğer araçlar ve siteler", en: "Other tools & sites" },

  questsTitleGame: { tr: "Görev günlüğü", en: "Quest log" },
  questsTitleCode: { tr: "git log", en: "git log" },
  questsIntro: {
    tr: "Deneyim, eğitim ve topluluk işleri. En yeni görev en üstte.",
    en: "Work, school and community roles. Newest quest first.",
  },
  status: {
    active: { tr: "Sürüyor", en: "Active" },
    done: { tr: "Tamamlandı", en: "Completed" },
    locked: { tr: "Kilitli", en: "Locked" },
  },
  lockedTitle: { tr: "Yeni görev yükleniyor", en: "New quest loading" },
  lockedText: { tr: "Bu kayıt yakında açılacak.", en: "This entry unlocks soon." },

  achTitleGame: { tr: "Başarımlar", en: "Achievements" },
  achTitleCode: { tr: "Kilometre taşları", en: "Milestones" },
  achIntro: {
    tr: "Her rozetin arkasında ölçülebilir bir şey var. Biri gizli.",
    en: "Every badge stands for something you can check. One is hidden.",
  },
  achUnlocked: { tr: "açıldı", en: "unlocked" },
  secretName: { tr: "???", en: "???" },
  secretHint: { tr: "Gizli başarım. Klasik bir hile kodu var.", en: "Hidden achievement. There's a classic cheat code." },

  skillsTitleGame: { tr: "Yetenek ağacı", en: "Skill tree" },
  skillsTitleCode: { tr: "package.json", en: "package.json" },
  skillsIntro: {
    tr: "Seviye ya da yüzde yok. Her dalın altında, o dalı nerede kullandığım yazıyor.",
    en: "No levels or percentages. Each branch shows where I've actually used it.",
  },
  usedIn: { tr: "Kullandığım yer", en: "Used in" },

  saveTitleGame: { tr: "Kayıt noktası", en: "Save point" },
  saveTitleCode: { tr: "İletişim", en: "Contact" },
  saveIntro: {
    tr: "Staj, ekip ya da proje için yazabilirsin. CV'mi buradan indirebilirsin.",
    en: "Write to me about internships, teams or projects. You can download my CV here.",
  },
  charClass: { tr: "Sınıf", en: "Class" },
  charGuild: { tr: "Lonca", en: "Guild" },
  charBase: { tr: "Üs", en: "Base" },
  charSchool: { tr: "Okul", en: "School" },
  charLang: { tr: "Diller", en: "Languages" },
  charClassValue: { tr: "Oyun ve yazılım geliştirici", en: "Game & software developer" },
  charGuildValue: { tr: "Volpen (kurucu)", en: "Volpen (founder)" },
  charBaseValue: { tr: "Çanakkale, Türkiye", en: "Çanakkale, Türkiye" },
  charSchoolValue: { tr: "ÇOMÜ, 2. sınıf", en: "ÇOMÜ, 2nd year" },
  charLangValue: { tr: "Türkçe (ana dil), İngilizce (teknik)", en: "Turkish (native), English (technical)" },
  photoAlt: { tr: "Salih Yazıtaş'ın fotoğrafı", en: "Photo of Salih Yazıtaş" },
  cvTr: { tr: "CV'yi indir (Türkçe, PDF)", en: "Download CV (Turkish, PDF)" },
  cvEn: { tr: "CV'yi indir (İngilizce, PDF)", en: "Download CV (English, PDF)" },
  copyEmail: { tr: "Kopyala", en: "Copy" },
  copied: { tr: "E-posta adresi kopyalandı", en: "Email address copied" },
  copyFailed: { tr: "Kopyalanamadı, adresi elle seç", en: "Couldn't copy, select the address instead" },
  footer: {
    tr: "Bu site elle yazıldı: çerçeve yok, izleyici yok.",
    en: "This site is handwritten: no framework, no trackers.",
  },
  footerHint: { tr: "İpucu: ↑ ↑ ↓ ↓ ← → ← → B A", en: "Hint: ↑ ↑ ↓ ↓ ← → ← → B A" },
  toastSecret: { tr: "Başarım açıldı: Hile kodu", en: "Achievement unlocked: Cheat code" },
  crtOn: { tr: "Tarama çizgileri açık", en: "Scanlines on" },
  crtOff: { tr: "Tarama çizgileri kapalı", en: "Scanlines off" },
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
    tr: "Salih Yazıtaş, oyun ve yazılım geliştirici: mod seçim ekranı",
    en: "Salih Yazıtaş, game and software developer: mode select screen",
  },
};

// Hero altındaki durum çubuğu
const hud = [
  { value: { tr: "7 yıl", en: "7 yrs" }, label: { tr: "kendi kendine kod", en: "self-taught coding" } },
  { value: "19", label: { tr: "dilde yayında", en: "languages live" } },
  { value: "614", label: { tr: "test, RaiPy", en: "tests, RaiPy" } },
  { value: { tr: "1,6 ms", en: "1.6 ms" }, label: { tr: "kare süresi, Kralın Sözü", en: "frame time, Kralın Sözü" } },
  { value: "3", label: { tr: "game jam", en: "game jams" } },
];

// Öne çıkan projeler. track: "game" | "code"
const projects = [
  // ---------- Oyunlar ----------
  {
    id: "kralin-sozu", track: "game", featured: true,
    title: "Kralın Sözü", subtitle: { tr: null, en: "The King's Promise" },
    kind: { tr: "Tek kişilik oyun", en: "Solo game" }, date: { tr: "Ekim 2026", en: "Oct 2026" },
    pitch: {
      tr: "Bir halk hikâyesinden uyarlanan, ekranda hiç arayüz olmayan birinci şahıs nöbet oyunu. Kralın unuttuğu nöbetçi sensin; üç kış gecesi boyunca kapıyı tutuyorsun.",
      en: "A first-person guard game based on a folk tale, with no on-screen interface. You're the sentry the king forgot, holding the gate for three winter nights.",
    },
    points: {
      tr: [
        "Sahnenin tamamı kodla kuruluyor. Kuralları Unity'den bağımsız bir çekirdekte yazdım.",
        "Oyunu 2000 gecelik bir denge simülasyonuyla ayarladım; ekran açmadan çalışan test botları var.",
      ],
      en: [
        "The whole scene is built in code. The rules live in a core that doesn't depend on Unity.",
        "Tuned with a 2,000-night balance simulation; automated test bots run without opening a window.",
      ],
    },
    stats: [
      { k: { tr: "Gece", en: "Nights" }, v: "3" },
      { k: { tr: "Ziyaretçi türü", en: "Visitor types" }, v: "17" },
      { k: { tr: "Son", en: "Endings" }, v: "10" },
      { k: { tr: "Denge simülasyonu", en: "Balance simulation" }, v: { tr: "2000 gece", en: "2,000 nights" } },
      { k: { tr: "Kare süresi (RTX 4060, 1080p)", en: "Frame time (RTX 4060, 1080p)" }, v: { tr: "1,6 ms", en: "1.6 ms" } },
    ],
    tech: ["Unity 6", "C#", "Vulkan", "Windows", "Linux"],
    image: { src: "kralin-sozu-gate_view.webp", w: 1200, h: 675, alt: { tr: "Kralın Sözü: karlı bir gecede iki nöbet kulesi arasındaki kapı", en: "Kralın Sözü: the gate between two watchtowers on a snowy night" } },
    gallery: [
      { src: "kralin-sozu-papers.webp", alt: { tr: "Ziyaretçinin belgelerini inceleme", en: "Checking a visitor's papers" } },
      { src: "kralin-sozu-wolves.webp", alt: { tr: "Karanlıkta yaklaşan kurtlar", en: "Wolves approaching in the dark" } },
      { src: "kralin-sozu-king_promise.webp", alt: { tr: "Kralın söz verdiği an", en: "The moment the king makes his promise" } },
    ],
    links: [
      { label: "play", href: links.kralinItch },
      { label: "source", href: links.kralinRepo },
    ],
  },
  {
    id: "under-the-counter", track: "game",
    title: "Under the Counter",
    kind: { tr: "Ekip oyunu, baş programcı", en: "Team game, lead programmer" }, date: { tr: "Temmuz 2026'dan beri", en: "Since Jul 2026" },
    pitch: {
      tr: "2000'lerde korsan CD satan küçük bir dükkânı işlettiğin, kara mizahlı birinci şahıs dükkân simülasyonu. Hedef: Steam Next Fest demosu.",
      en: "A dark-humour first-person shop sim: you run a small 2000s shop selling bootleg CDs. Target: a Steam Next Fest demo.",
    },
    points: {
      tr: ["Ekonomiyi, sabrı tükenen müşterileri, şüphe göstergesine bağlı polis baskınlarını, çökmeye dayanıklı kaydı ve TR/EN yerelleştirmeyi yazdım. Ekipteki commit'lerin çoğu benim."],
      en: ["I wrote the economy, impatient customers, police raids driven by a suspicion meter, crash-safe saving and TR/EN localization. Most of the team's commits are mine."],
    },
    stats: [
      { k: { tr: "Çalışma zamanı script'i", en: "Runtime scripts" }, v: "88" },
      { k: { tr: "Editör aracı", en: "Editor tools" }, v: "28" },
    ],
    tech: ["Unity 6", "URP", "NavMesh", "Input System", "C#"],
    art: "counter",
    links: [],
  },
  {
    id: "last-dawn", track: "game",
    title: "LAST DAWN",
    kind: { tr: "Volpen ekip oyunu, yazılım ve pazarlama", en: "Volpen team game, software & marketing" }, date: { tr: "Geliştiriliyor", en: "In development" },
    pitch: {
      tr: "Kıyamet sonrası bir dünyada gündüz yağmaya çıkıp gece üssünü savunduğun, hayatta kalma ile üs kurmayı birleştiren bir PC oyunu.",
      en: "A post-apocalyptic PC game that mixes survival and base building: scavenge by day, defend your base by night.",
    },
    points: {
      tr: ["Projede yazılım ve pazarlamadan sorumluyum. Gündüz/gece düğmesiyle bütün paleti değiştiren tanıtım sitesini ben yaptım."],
      en: ["I handle software and marketing. I built the promo site, whose day/night switch changes the whole palette."],
    },
    stats: [],
    tech: ["Unity", "C#", "HTML", "CSS"],
    art: "dawn",
    links: [{ label: "open", href: links.lastDawn }],
  },
  {
    id: "pati-rotasi", track: "game",
    title: "Pati Rotası",
    kind: { tr: "Mobil oyun", en: "Mobile game" }, date: "2026",
    pitch: {
      tr: "Yürüyüşü teşvik eden mobil oyun. Sokak kedilerini fotoğraflayıp koleksiyon yapıyorsun, haritadaki sis yürüdükçe açılıyor, adımların barınaklar için mama puanına dönüşüyor.",
      en: "A mobile game that gets you walking. Photograph street cats to build a collection, clear the fog on the map as you walk, and turn your steps into food points for animal shelters.",
    },
    points: { tr: [], en: [] },
    stats: [],
    tech: ["Expo", "React Native", "Leaflet"],
    image: { src: "pati-rotasi.webp", w: 960, h: 748, alt: { tr: "Pati Rotası tanıtım ekranı ve iki telefon görüntüsü", en: "Pati Rotası promo screen with two phone screenshots" } },
    links: [{ label: "source", href: links.pati }],
  },

  // ---------- Yazılım ----------
  {
    id: "myeverythinglist", track: "code", featured: true,
    title: "MyEverythingList",
    kind: { tr: "Web uygulaması, tek geliştirici", en: "Web app, solo developer" }, date: { tr: "Ağustos – Ekim 2026", en: "Aug – Oct 2026" },
    pitch: {
      tr: "Anime, manga, dizi, film, oyun, kitap ve müziği tek yerde takip etmeni sağlayan, reklamsız bir web uygulaması. Tek başıma geliştirip 19 dilde yayına aldım.",
      en: "An ad-free web app for tracking anime, manga, TV, films, games, books and music in one place. I built it on my own and shipped it in 19 languages.",
    },
    points: {
      tr: [
        "Supabase'de satır düzeyi güvenlik ve Edge Function'lar; paylaşılan bağlantıların önizleme kartlarını bir Cloudflare Worker üretiyor.",
        "Arama birden çok kaynağa soruyor, biri çökünce ötekine geçiyor. Kaynaklar arası eşleştirme Wikidata ile; katalog her gece kendiliğinden büyüyor.",
        "AniList, Steam, MyAnimeList, Goodreads ve Letterboxd'dan içe aktarma; takip, mesaj, inceleme, rozetler ve mini oyunlar.",
      ],
      en: [
        "Supabase with row-level security and Edge Functions; a Cloudflare Worker renders preview cards for shared links.",
        "Search queries several sources and falls back when one goes down. IDs are matched across sources with Wikidata; the catalog grows by itself every night.",
        "Imports from AniList, Steam, MyAnimeList, Goodreads and Letterboxd; follows, messages, reviews, badges and mini-games.",
      ],
    },
    stats: [
      { k: { tr: "Dil", en: "Languages" }, v: "19" },
      { k: { tr: "Satır TypeScript", en: "Lines of TypeScript" }, v: { tr: "~58 bin", en: "~58k" } },
      { k: "Commit", v: "261" },
      { k: "SQL migration", v: "148" },
      { k: "Edge Function", v: "20" },
    ],
    tech: ["React 19", "TypeScript", "Vite", "Tailwind", "TanStack Query", "Supabase", "Cloudflare Workers", "Tauri v2"],
    image: { src: "myeverythinglist.webp", w: 960, h: 748, alt: { tr: "MyEverythingList ana sayfası", en: "MyEverythingList home page" } },
    links: [{ label: "open", href: links.mel }],
  },
  {
    id: "nerobot", track: "code",
    title: "NeRoBoT",
    kind: { tr: "Açık kaynak masaüstü uygulaması", en: "Open-source desktop app" }, date: "2026",
    pitch: {
      tr: "Birden çok WhatsApp ve Telegram hesabında, her biri ayrı çalışan yapay zekâ botları yöneten masaüstü uygulaması.",
      en: "A desktop app that runs AI bots on several WhatsApp and Telegram accounts at once, each fully isolated.",
    },
    points: {
      tr: ["Sağlayıcıdan bağımsız bir AI katmanı yazdım: Ollama, LM Studio, llama.cpp, vLLM, OpenAI, OpenRouter, Groq ve Claude Code, Codex, Gemini CLI gibi ajanlar aynı arayüzle çalışıyor. GitHub Releases ile kendini güncelliyor."],
      en: ["I wrote a provider-agnostic AI layer: Ollama, LM Studio, llama.cpp, vLLM, OpenAI, OpenRouter, Groq and agents like Claude Code, Codex and Gemini CLI all work through one interface. Updates itself through GitHub Releases."],
    },
    stats: [
      { k: { tr: "GitHub yıldızı", en: "GitHub stars" }, v: "7" },
      { k: "Platform", v: "Windows, Linux" },
    ],
    tech: ["Electron", "Node.js", "whatsapp-web.js", "Telegram"],
    image: { src: "nerobot.webp", w: 960, h: 748, alt: { tr: "NeRoBoT sohbet ekranı", en: "NeRoBoT chat screen" } },
    links: [{ label: "source", href: links.nerobot }],
  },
  {
    id: "raipy", track: "code",
    title: "RaiPy",
    kind: { tr: "AI görsel roman motoru", en: "AI visual novel engine" }, date: { tr: "Eylül 2026", en: "Sep 2026" },
    pitch: {
      tr: "Tek cümlelik bir fikirden derlenip oynatılabilen bir Ren'Py oyunu çıkaran masaüstü uygulaması. Her aşama kullanıcı onayından geçiyor.",
      en: "A desktop app that turns a one-sentence idea into a Ren'Py game that compiles and runs. The user approves every stage.",
    },
    points: {
      tr: ["Görseller harici sunucu olmadan üretiliyor. Modelleri sırayla belleğe alıp boşaltarak 8 GB ekran kartında VRAM kullanımını 7820 MiB'den 3035 MiB'ye indirdim."],
      en: ["Images are generated with no external server. Loading and unloading models one at a time cut VRAM use on an 8 GB GPU from 7820 MiB to 3035 MiB."],
    },
    stats: [
      { k: "Test", v: "614" },
      { k: { tr: "Uçtan uca üretim", en: "End-to-end run" }, v: { tr: "150 sn", en: "150 s" } },
      { k: "VRAM", v: "7820 → 3035 MiB" },
      { k: { tr: "Uygulama boyutu", en: "App size" }, v: { tr: "4,2 MB", en: "4.2 MB" } },
    ],
    tech: ["Tauri v2", "Rust", "React 19", "TypeScript", "Python", "diffusers", "Ren'Py"],
    image: { src: "raipy.webp", w: 960, h: 748, alt: { tr: "RaiPy sahne düzenleyicisi", en: "RaiPy scene editor" } },
    links: [], // depo gizli
  },
  {
    id: "parsel", track: "code",
    title: "Parsel",
    kind: { tr: "Staj projesi, Stoneograph", en: "Internship project, Stoneograph" }, date: { tr: "Ağustos 2026", en: "Aug 2026" },
    pitch: {
      tr: "Tapu doğrulamalı arsa pazaryeri ve canlı açık artırma platformu.",
      en: "A land marketplace with title-deed verification and live auctions.",
    },
    points: {
      tr: [
        "Parselleri TKGM üzerinden sorgulayan \"Tapu Doğrulanmış\" rozeti, eğime göre düzeltilmiş alan ve yükseklik analizi.",
        "Son saniye teklifinde süreyi uzatan anti-sniping, yarış koşullarına karşı güvenli teklif işleme ve WebSocket ile canlı akış.",
        "3D harita üzerinde seslendirmeli, altyazılı sanal drone videosu üreten bir hat (Playwright, ffmpeg).",
      ],
      en: [
        "A \"title-verified\" badge that looks parcels up in Turkey's land registry (TKGM), plus slope-corrected area and elevation analysis.",
        "Anti-sniping (a last-second bid extends the timer), race-safe bid handling and real-time updates over WebSocket.",
        "A pipeline that renders narrated, subtitled virtual drone videos over a 3D map (Playwright, ffmpeg).",
      ],
    },
    stats: [
      { k: { tr: "Backend kodu", en: "Backend code" }, v: { tr: "~10 bin satır", en: "~10k lines" } },
      { k: "Test", v: "103" },
    ],
    tech: ["Python", "FastAPI", "SQLAlchemy", "WebSocket", "Shapely", "pyproj", "JavaScript"],
    art: "parcel",
    links: [],
  },
  {
    id: "heren-agent", track: "code",
    title: "Heren Agent",
    kind: { tr: "Ev sunucusu asistanı", en: "Home-server assistant" }, date: { tr: "Eylül 2026", en: "Sep 2026" },
    pitch: {
      tr: "Telefondan sesle ya da dokunarak ev sunucusunu ve bağlı makineleri yöneten bir panel. Konuşma tanıma ve seslendirme tamamen yerelde çalışıyor.",
      en: "A phone-first panel for running a home server and paired machines by voice or touch. Speech recognition and text-to-speech run fully on the local machine.",
    },
    points: {
      tr: ["Her makinede bir Go ajanı var. Ajanlar mesajlarını ed25519 ile imzalıyor ve tekrar oynatma saldırılarına karşı tek kullanımlık değer kullanıyor. Yüksek riskli komutlar arayüzde onay bekliyor."],
      en: ["Each machine runs a Go agent. Agents sign messages with ed25519 and use a one-time nonce against replay attacks. High-risk commands wait for approval in the UI."],
    },
    stats: [
      { k: { tr: "İmza", en: "Signing" }, v: "ed25519" },
      { k: { tr: "Ses", en: "Voice" }, v: { tr: "yerel STT + TTS", en: "local STT + TTS" } },
    ],
    tech: ["Python", "FastAPI", "Go", "TypeScript", "faster-whisper", "Piper TTS"],
    image: { src: "heren-agent.webp", w: 960, h: 748, alt: { tr: "Heren Agent ana ekranı", en: "Heren Agent main screen" } },
    links: [{ label: "source", href: links.heren }],
  },
];

// Küçük işler: kartsız liste
const minorGames = [
  { title: "Let's Cook a Mask", note: { tr: "Global Game Jam 2026, İstanbul @BUG", en: "Global Game Jam 2026, Istanbul @BUG" } },
  { title: "The Rolling Pizz", note: { tr: "Yıldız Jam 2026, ekip oyunu", en: "Yıldız Jam 2026, team game" }, href: links.rollingPizz },
  { title: "Ağaçlaştırılmış Elma", note: { tr: "Volpen, 2 ay. Kod, yönetim ve hikâye", en: "Volpen, 2 months. Code, project lead and story" } },
  { title: "ColorLand", note: { tr: "Volpen, 1 hafta. İlk 3D projem", en: "Volpen, 1 week. My first 3D project" } },
  { title: "ÜçKKeNİci", note: { tr: "Volpen, 2 gün", en: "Volpen, 2 days" } },
];

const minorCode = [
  { title: "Oyun Vitrini", note: { tr: "Oyun Tasarımı Kulübü'nün sitesi: 21 oyun, üye hesapları, iki ekranlı stant modu", en: "Game Design Club site: 21 games, member accounts, two-screen booth mode" } },
  { title: "Volpen", note: { tr: "Ekibin çerçevesiz sitesi: PWA, TR/EN, WCAG AA", en: "The studio's framework-free site: PWA, TR/EN, WCAG AA" }, href: links.volpen },
  { title: "Görevler", note: { tr: "Otomatik zamanlamalı görev ve zaman yöneticisi, Google Takvim entegrasyonu", en: "Task and time manager with auto-scheduling and Google Calendar sync" } },
  { title: "GDD Creator", note: { tr: "Türe göre soru soran, 7 biçimde dışa aktaran oyun tasarım dokümanı aracı", en: "Game design doc tool that asks genre-specific questions and exports to 7 formats" }, href: links.gdd },
  { title: "TurkOS", note: { tr: "R36S el konsolları için Türkçe tema ve 711 satırlık çeviri", en: "Turkish theme and 711-string translation for R36S handhelds" }, href: links.turkos },
];

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

module.exports = { links, ui, meta, hud, projects, minorGames, minorCode, quests, achievements, skills, languages, socials };
