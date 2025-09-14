// src/constants/gardenConstants.ts

export const PLANT_TYPES = [
  { 
    name: 'Pomidor', 
    emoji: '🍅', 
    category: 'Warzywa owocowe',
    growthDays: 120,
    phases: ['Nasiona', 'Sadzonki', 'Wschody', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Podwiąż pędy', 'Usuń boczne pędy', 'Zbierz owoce'],
    tips: [
      'Regularne podlewanie, ale nie na liście',
      'Podwiązuj do podpor',
      'Usuwaj boczne pędy dla lepszego plonu',
      'Zbieraj gdy owoce są jędrne ale nie przemiękłe'
    ]
  },
  { 
    name: 'Ogórek', 
    emoji: '🥒', 
    category: 'Warzywa owocowe',
    growthDays: 90,
    phases: ['Nasiona', 'Sadzonki', 'Wschody', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Podwiąż pędy', 'Zbierz owoce'],
    tips: [
      'Lubią ciepło i wilgoć',
      'Zbieraj młode ogórki dla ciągłego plonowania',
      'Podwiązuj do podpor lub siatek'
    ]
  },
  { 
    name: 'Papryka', 
    emoji: '🌶️', 
    category: 'Warzywa owocowe',
    growthDays: 100,
    phases: ['Nasiona', 'Sadzonki', 'Przesadzanie', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przesadź do gruntu', 'Zbierz owoce'],
    tips: [
      'Wymagają ciepła (min. 15°C)',
      'Przesadzaj po ostatnich przymrozkach',
      'Zbieraj gdy osiągną odpowiedni rozmiar'
    ]
  },
  { 
    name: 'Sałata', 
    emoji: '🥬', 
    category: 'Warzywa liściaste',
    growthDays: 60,
    phases: ['Nasiona', 'Wschody', 'Wzrost', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przerzedź sadzonki', 'Zbierz liście'],
    tips: [
      'Lubi chłodniejsze warunki',
      'Zbieraj zewnętrzne liście lub całe główki',
      'Siaj sukcesywnie co 2-3 tygodnie'
    ]
  },
  { 
    name: 'Marchew', 
    emoji: '🥕', 
    category: 'Warzywa korzeniowe',
    growthDays: 80,
    phases: ['Nasiona', 'Wschody', 'Wzrost', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przerzedź sadzonki', 'Zbierz korzenie'],
    tips: [
      'Wymaga głębokiej, przepuszczalnej gleby',
      'Przerzedzaj gdy rośliny mają 5cm',
      'Zbieraj gdy korzenie osiągną odpowiedni rozmiar'
    ]
  },
  {
    name: 'Rzodkiewka',
    emoji: '🫐',
    category: 'Warzywa korzeniowe',
    growthDays: 30,
    phases: ['Nasiona', 'Wschody', 'Wzrost', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przerzedź sadzonki', 'Zbierz korzenie'],
    tips: [
      'Bardzo szybki wzrost',
      'Lubi chłodniejsze warunki',
      'Zbieraj młode, zanim staną się gorzkie'
    ]
  },
  { 
    name: 'Cebula', 
    emoji: '🧅', 
    category: 'Warzywa cebulowe',
    growthDays: 140,
    phases: ['Sadzonki', 'Wzrost', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Odchwaszczanie', 'Zbierz cebule'],
    tips: [
      'Sadź sadzonki wiosną',
      'Odchwaszczaj regularnie',
      'Zbieraj gdy liście żółkną'
    ]
  },
  { 
    name: 'Ziemniak', 
    emoji: '🥔', 
    category: 'Warzywa bulwiaste',
    growthDays: 90,
    phases: ['Sadzenie', 'Wschody', 'Wzrost', 'Obsypywanie', 'Kwitnienie', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Obsypywanie', 'Zbierz ziemniaki'],
    tips: [
      'Obsypuj gdy rośliny mają 15-20cm',
      'Zbieraj 2 tygodnie po przekwitnięciu',
      'Przechowuj w ciemnym, chłodnym miejscu'
    ]
  },
  { 
    name: 'Fasolka', 
    emoji: '🫘', 
    category: 'Rośliny strączkowe',
    growthDays: 70,
    phases: ['Nasiona', 'Wschody', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Podwiąż podpory', 'Zbierz strąki'],
    tips: [
      'Siaj po ostatnich przymrozkach',
      'Fasolka pnąca wymaga podpór',
      'Zbieraj młode strąki dla lepszego plonowania'
    ]
  },
  {
    name: 'Groszek',
    emoji: '🫛', 
    category: 'Rośliny strączkowe',
    growthDays: 80,
    phases: ['Nasiona', 'Wschody', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Podwiąż podpory', 'Zbierz strąki'],
    tips: [
      'Lubi chłodniejsze warunki',
      'Wysokie odmiany wymagają podpór',
      'Zbieraj gdy strąki są wypełnione ale miękkie'
    ]
  },
  { 
    name: 'Kapusta', 
    emoji: '🥬', 
    category: 'Warzywa kapustne',
    growthDays: 150,
    phases: ['Sadzonki', 'Przesadzanie', 'Wzrost', 'Formowanie główek', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Ochrona przed szkodnikami', 'Zbierz główki'],
    tips: [
      'Przesadzaj sadzonki po 4-6 tygodniach',
      'Chroń przed mszycą kapuścianą',
      'Zbieraj gdy główki są zwarte i ciężkie'
    ]
  },
  { 
    name: 'Brokuły', 
    emoji: '🥦', 
    category: 'Warzywa kapustne',
    growthDays: 100,
    phases: ['Sadzonki', 'Przesadzanie', 'Wzrost', 'Formowanie różyczek', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Nawożenie', 'Zbierz różyczki'],
    tips: [
      'Lubi chłodniejsze warunki',
      'Regularnie nawożenia azotowe',
      'Zbieraj główne różyczki przed kwitnieniem'
    ]
  },
  { 
    name: 'Pietruszka', 
    emoji: '🌿', 
    category: 'Zioła',
    growthDays: 90,
    phases: ['Nasiona', 'Wschody', 'Wzrost', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przerzedź sadzonki', 'Zbierz liście'],
    tips: [
      'Długo kiełkuje (2-3 tygodnie)',
      'Zbieraj zewnętrzne liście',
      'Można uprawiać przez cały sezon'
    ]
  },
  { 
    name: 'Koper', 
    emoji: '🌿', 
    category: 'Zioła',
    growthDays: 70,
    phases: ['Nasiona', 'Wschody', 'Wzrost', 'Kwitnienie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przerzedź sadzonki', 'Zbierz liście'],
    tips: [
      'Siaj co 2-3 tygodnie dla ciągłych zbiorów',
      'Zbieraj młode liście',
      'Można zbierać nasiona do przypraw'
    ]
  },
  { 
    name: 'Bazylia', 
    emoji: '🌿', 
    category: 'Zioła',
    growthDays: 60,
    phases: ['Nasiona', 'Sadzonki', 'Wzrost', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przycinanie', 'Zbierz liście'],
    tips: [
      'Wymaga ciepła (min. 15°C)',
      'Przycinaj wierzchołki dla krzewienia',
      'Usuń kwiatostany dla lepszych liści'
    ]
  },
  {
    name: 'Truskawka',
    emoji: '🍓',
    category: 'Owoce',
    growthDays: 120,
    phases: ['Sadzonki', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Usuń rozłogi', 'Zbierz owoce'],
    tips: [
      'Sadź sadzonki we wrześniu lub wiosną',
      'Usuń pierwsze rozłogi',
      'Mulczuj słomą przed owocowaniem'
    ]
  },
  {
    name: 'Cukinia',
    emoji: '🥒',
    category: 'Warzywa owocowe',
    growthDays: 85,
    phases: ['Nasiona', 'Sadzonki', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Mulczowanie', 'Zbierz młode owoce'],
    tips: [
      'Wymaga dużo miejsca i żyznej gleby',
      'Zbieraj młode owoce regularnie',
      'Jedna roślina wystarczy dla rodziny'
    ]
  },
  {
    name: 'Dynia',
    emoji: '🎃',
    category: 'Warzywa owocowe',
    growthDays: 130,
    phases: ['Nasiona', 'Sadzonki', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Podłóż pod owoce', 'Zbierz dojrzałe owoce'],
    tips: [
      'Wymaga bardzo dużo miejsca',
      'Podkładaj deski pod dojrzewające owoce',
      'Zbieraj przed pierwszymi przymrozkami'
    ]
  },
  {
    name: 'Bakłażan',
    emoji: '🍆',
    category: 'Warzywa owocowe',
    growthDays: 110,
    phases: ['Sadzonki', 'Przesadzanie', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Podwiąż pędy', 'Zbierz owoce'],
    tips: [
      'Wymaga ciepła i słońca',
      'Przesadzaj po całkowitym ustąpieniu przymrozków',
      'Zbieraj gdy owoce są błyszczące'
    ]
  },
  {
    name: 'Szpinak',
    emoji: '🥬',
    category: 'Warzywa liściaste',
    growthDays: 50,
    phases: ['Nasiona', 'Wschody', 'Wzrost', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przerzedź sadzonki', 'Zbierz liście'],
    tips: [
      'Lubi chłodne warunki',
      'Siaj wiosną i jesienią',
      'Zbieraj zewnętrzne liście'
    ]
  },
  {
    name: 'Rukola',
    emoji: '🥬',
    category: 'Warzywa liściaste',
    growthDays: 40,
    phases: ['Nasiona', 'Wschody', 'Wzrost', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przerzedź sadzonki', 'Zbierz liście'],
    tips: [
      'Bardzo szybki wzrost',
      'Siaj sukcesywnie co 2 tygodnie',
      'Zbieraj młode liście dla lepszego smaku'
    ]
  },
  {
    name: 'Burak',
    emoji: '🟣',
    category: 'Warzywa korzeniowe',
    growthDays: 100,
    phases: ['Nasiona', 'Wschody', 'Wzrost', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przerzedź sadzonki', 'Zbierz korzenie'],
    tips: [
      'Młode liście również jadalne',
      'Zbieraj gdy korzenie mają 5-8cm średnicy',
      'Przechowuj w piasku w chłodnym miejscu'
    ]
  },
  {
    name: 'Rzepa',
    emoji: '🟡',
    category: 'Warzywa korzeniowe',
    growthDays: 75,
    phases: ['Nasiona', 'Wschody', 'Wzrost', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przerzedź sadzonki', 'Zbierz korzenie'],
    tips: [
      'Odporna na mróz',
      'Siaj latem na jesienne zbiory',
      'Młode liście również jadalne'
    ]
  },
  {
    name: 'Czosnek',
    emoji: '🧄',
    category: 'Warzywa cebulowe',
    growthDays: 240,
    phases: ['Sadzenie', 'Wzrost zimowy', 'Wzrost wiosenny', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Sadź ząbki', 'Odchwaszczanie', 'Zbierz główki'],
    tips: [
      'Sadź jesienią ząbki ozime',
      'Zbieraj gdy dolne liście żółkną',
      'Susź w przewiewnym, ciemnym miejscu'
    ]
  },
  {
    name: 'Por',
    emoji: '🥒',
    category: 'Warzywa cebulowe',
    growthDays: 150,
    phases: ['Sadzonki', 'Przesadzanie', 'Wzrost', 'Obsypywanie', 'Zbiory'],
    tasks: ['Przesadź sadzonki', 'Obsypywanie', 'Zbierz łodygi'],
    tips: [
      'Obsypuj regularnie dla białych łodyg',
      'Odporny na mróz',
      'Zbieraj przez całą jesień i zimę'
    ]
  },
  {
    name: 'Kalarepa',
    emoji: '🥬',
    category: 'Warzywa kapustne',
    growthDays: 80,
    phases: ['Sadzonki', 'Przesadzanie', 'Wzrost', 'Formowanie bulw', 'Zbiory'],
    tasks: ['Przesadź sadzonki', 'Podlewanie', 'Zbierz bulwy'],
    tips: [
      'Zbieraj gdy bulwy mają 6-8cm średnicy',
      'Nie pozostawiaj za długo na grządce',
      'Liście również jadalne'
    ]
  },
  {
    name: 'Brukselka',
    emoji: '🥬',
    category: 'Warzywa kapustne',
    growthDays: 120,
    phases: ['Sadzonki', 'Przesadzanie', 'Wzrost', 'Formowanie pączków', 'Zbiory'],
    tasks: ['Przesadź sadzonki', 'Podwiązywanie', 'Zbierz pączki'],
    tips: [
      'Zbieraj pączki od dołu ku górze',
      'Mróz poprawia smak',
      'Usuń górne liście przed zbiorem'
    ]
  },
  {
    name: 'Szczypiorek',
    emoji: '🌿',
    category: 'Zioła',
    growthDays: 60,
    phases: ['Nasiona', 'Wschody', 'Wzrost', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przycinanie', 'Zbierz liście'],
    tips: [
      'Roślina wieloletnia',
      'Przycinaj regularnie dla nowych pędów',
      'Można uprawiać w doniczkach'
    ]
  },
  {
    name: 'Oregano',
    emoji: '🌿',
    category: 'Zioła',
    growthDays: 80,
    phases: ['Sadzonki', 'Wzrost', 'Kwitnienie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przycinanie', 'Zbierz liście'],
    tips: [
      'Roślina wieloletnia',
      'Najlepszy smak przed kwitnieniem',
      'Suszyć do użytku zimowego'
    ]
  },
  {
    name: 'Rozmaryn',
    emoji: '🌿',
    category: 'Zioła',
    growthDays: 90,
    phases: ['Sadzonki', 'Wzrost', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przycinanie', 'Zbierz gałązki'],
    tips: [
      'Roślina wieloletnia, mało mrozoodporna',
      'Wymaga przepuszczalnej gleby',
      'Można uprawiać w doniczkach'
    ]
  },
  {
    name: 'Tymianek',
    emoji: '🌿',
    category: 'Zioła',
    growthDays: 75,
    phases: ['Sadzonki', 'Wzrost', 'Kwitnienie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przycinanie', 'Zbierz liście'],
    tips: [
      'Roślina wieloletnia',
      'Lubi słoneczne, suche stanowiska',
      'Zbieraj przed kwitnieniem'
    ]
  },
  {
    name: 'Mięta',
    emoji: '🌿',
    category: 'Zioła',
    growthDays: 70,
    phases: ['Sadzonki', 'Wzrost', 'Kwitnienie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Ograniczanie rozprzestrzeniania', 'Zbierz liście'],
    tips: [
      'Bardzo ekspansywna - sadź w ograniczeniach',
      'Lubi wilgotne stanowiska',
      'Zbieraj przed kwitnieniem'
    ]
  },
  {
    name: 'Majeranek',
    emoji: '🌿',
    category: 'Zioła',
    growthDays: 85,
    phases: ['Nasiona', 'Wschody', 'Wzrost', 'Kwitnienie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przycinanie', 'Zbierz liście'],
    tips: [
      'Lubi ciepłe, słoneczne stanowiska',
      'Siaj późną wiosną',
      'Suszyć na zimę w przewiewnym miejscu'
    ]
  }
] as const;

export const GROWTH_PHASES = [
  'Nasiona',
  'Sadzonki', 
  'Wschody',
  'Wzrost',
  'Kwitnienie',
  'Owocowanie',
  'Dojrzewanie',
  'Zbiory'
] as const;

export const TASK_TYPES = [
  { value: 'watering', label: 'Podlewanie', icon: '💧', color: 'blue' },
  { value: 'fertilizing', label: 'Nawożenie', icon: '🌱', color: 'green' },
  { value: 'pruning', label: 'Przycinanie', icon: '✂️', color: 'orange' },
  { value: 'harvesting', label: 'Zbiory', icon: '🥕', color: 'yellow' },
  { value: 'planting', label: 'Sadzenie', icon: '🌱', color: 'emerald' },
  { value: 'other', label: 'Inne', icon: '📝', color: 'gray' },
] as const;

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Niski', color: 'blue' },
  { value: 'medium', label: 'Średni', color: 'yellow' },
  { value: 'high', label: 'Wysoki', color: 'red' },
] as const;

export const NOTIFICATION_TYPES = [
  { value: 'task', label: 'Zadanie', icon: '📋', color: 'emerald' },
  { value: 'reminder', label: 'Przypomnienie', icon: '⏰', color: 'orange' },
  { value: 'alert', label: 'Alert', icon: '⚠️', color: 'red' },
] as const;

export const PLANT_CATEGORIES = [
  'Warzywa owocowe',
  'Warzywa liściaste',
  'Warzywa korzeniowe',
  'Warzywa cebulowe',
  'Warzywa bulwiaste',
  'Rośliny strączkowe',
  'Warzywa kapustne',
  'Zioła',
  'Owoce'
] as const;

export const SEASONAL_TASKS = {
  spring: [
    'Przygotuj grządki do sezonu',
    'Siaj nasiona w inspekcie',
    'Przesadzaj sadzonki po ostatnich przymrozkach',
    'Rozpocznij regularne podlewanie',
    'Usuń chwasty z grządek'
  ],
  summer: [
    'Intensywne podlewanie w gorące dni',
    'Regularnie zbieraj dojrzałe warzywa',
    'Mulczuj glebę wokół roślin',
    'Podwiązuj wysokie rośliny',
    'Chroń przed szkodnikami'
  ],
  autumn: [
    'Zbieraj główne plony',
    'Przygotuj rośliny do zimy',
    'Planuj przechowywanie plonów',
    'Siaj rośliny pod osłony',
    'Sprzątaj opadłe liście'
  ],
  winter: [
    'Zabezpiecz rośliny przed mrozem',
    'Planuj następny sezon',
    'Serwisuj narzędzia ogrodnicze',
    'Przygotuj nasiona i sadzonki',
    'Sprawdzaj przechowywane plony'
  ]
} as const;

export const COMMON_GARDEN_PROBLEMS = [
  {
    problem: 'Żółknące liście',
    causes: ['Nadmierne podlewanie', 'Niedobór azotu', 'Choroby grzybowe'],
    solutions: ['Ogranicz podlewanie', 'Dodaj nawóz azotowy', 'Usuń chore liście']
  },
  {
    problem: 'Wolny wzrost',
    causes: ['Niedobór światła', 'Niedobór składników pokarmowych', 'Zbyt zimno'],
    solutions: ['Przenieś w słoneczne miejsce', 'Dodaj nawóz', 'Zabezpiecz przed zimnem']
  },
  {
    problem: 'Brak owocowania',
    causes: ['Brak zapylenia', 'Nadmiar azotu', 'Stres wodny'],
    solutions: ['Zwiększ zapylenie', 'Ogranicz nawożenie azotowe', 'Regularne podlewanie']
  },
  {
    problem: 'Szkodniki',
    causes: ['Mszyce', 'Ślimaki', 'Gąsienice'],
    solutions: ['Użyj naturalnych odstraszaczy', 'Zbieraj ręcznie', 'Stosuj pułapki']
  }
] as const;

export const WATERING_SCHEDULE = {
  daily: ['Sadzonki', 'Rośliny w doniczkach', 'Młode przesadzonki'],
  every2days: ['Pomidory', 'Ogórki', 'Papryka w okresie owocowania'],
  every3days: ['Większość warzyw w okresie wzrostu'],
  weekly: ['Ustabilizowane rośliny', 'Rośliny w okresie spoczynku'],
  asNeeded: ['Rośliny w okresie dojrzewania', 'Przed zbiorem']
} as const;

export const COMPANION_PLANTING = {
  'Pomidor': {
    good: ['Bazylia', 'Pietruszka', 'Marchew'],
    bad: ['Ziemniak', 'Koper'],
    benefits: 'Bazylia odpędza szkodniki i poprawia smak'
  },
  'Ogórek': {
    good: ['Koper', 'Rzodkiewka', 'Sałata'],
    bad: ['Pomidor', 'Ziemniak'],
    benefits: 'Koper przyciąga pożyteczne owady'
  },
  'Marchew': {
    good: ['Cebula', 'Pietruszka', 'Pomidor'],
    bad: ['Koper'],
    benefits: 'Cebula odpędza szkodniki marchewki'
  },
  'Sałata': {
    good: ['Rzodkiewka', 'Ogórek', 'Pomidor'],
    bad: ['Pietruszka'],
    benefits: 'Rzodkiewka odstrasza szkodniki sałaty'
  }
} as const;

export const DEFAULT_SETTINGS = {
  notifications: {
    wateringReminders: true,
    taskReminders: true,
    harvestAlerts: true,
  },
  units: 'metric' as const,
  language: 'pl' as const,
  theme: 'dark' as const,
  autoAdvancePhases: true,
  reminderTime: '08:00',
  harvestWindow: 7, // days before/after estimated harvest
} as const;

export const APP_METADATA = {
  name: 'Ogród Glass Zen',
  version: '1.0.0',
  description: 'Nowoczesna aplikacja do zarządzania ogrodami',
  author: 'Ogród Glass Zen Team',
  supportedLanguages: ['pl', 'en'],
  dataVersion: '1.0',
  maxBackupFiles: 5,
  maxActivities: 100,
  maxNotifications: 50,
} as const;