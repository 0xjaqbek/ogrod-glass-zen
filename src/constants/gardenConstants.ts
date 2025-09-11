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
    emoji: '🔴', 
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
    emoji: '🟢', 
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