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
    name: 'Malina',
    emoji: '🫐',
    category: 'Owoce',
    growthDays: 365,
    phases: ['Sadzonki', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przycinanie pędów', 'Zbierz owoce'],
    tips: [
      'Roślina wieloletnia - owocuje w drugim roku',
      'Przycinaj stare pędy po zbiorach',
      'Podwiązuj do kratownic lub słupów'
    ]
  },
  {
    name: 'Porzeczka',
    emoji: '🫐',
    category: 'Owoce',
    growthDays: 730,
    phases: ['Sadzonki', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przycinanie krzewu', 'Zbierz grona'],
    tips: [
      'Krzew wieloletni - plonuje od 3 roku',
      'Przycinaj stare gałęzie zimą',
      'Lubi wilgotne, żyzne stanowiska'
    ]
  },
  {
    name: 'Agrest',
    emoji: '🫐',
    category: 'Owoce',
    growthDays: 730,
    phases: ['Sadzonki', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Zbiory'],
    tasks: ['Podlej roślinę', 'Przycinanie krzewu', 'Zbierz owoce'],
    tips: [
      'Krzew wieloletni z kolcami',
      'Zbieraj gdy owoce są miękkie',
      'Chrońić przed amerykańskim mączniakiem'
    ]
  },
  {
    name: 'Borówka',
    emoji: '🫐',
    category: 'Owoce',
    growthDays: 1095,
    phases: ['Sadzonki', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Zbiory'],
    tasks: ['Podlej miękką wodą', 'Okwasić glebę', 'Zbierz owoce'],
    tips: [
      'Wymaga kwaśnej gleby (pH 4,5-5,5)',
      'Podlewaj wodą bez wapnia',
      'Mulczuj korą iglastą lub torfem'
    ]
  },
  {
    name: 'Winogrono',
    emoji: '🍇',
    category: 'Owoce',
    growthDays: 1460,
    phases: ['Sadzonki', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Przycinanie winorośli', 'Podwiązywanie pędów', 'Zbierz grona'],
    tips: [
      'Wymaga słonecznego, osłoniętego stanowiska',
      'Przycinaj zimą lub wczesną wiosną',
      'Zabezpiecz na zimę w pierwszych latach'
    ]
  },
  {
    name: 'Jabłoń',
    emoji: '🍎',
    category: 'Owoce',
    growthDays: 1825,
    phases: ['Sadzonki', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Przycinanie drzewa', 'Nawożenie', 'Zbierz jabłka'],
    tips: [
      'Drzewo wieloletnie - plonuje od 3-5 roku',
      'Przycinaj zimą w bezlistnej porze',
      'Przerzedzaj owoce dla lepszej jakości'
    ]
  },
  {
    name: 'Grusza',
    emoji: '🍐',
    category: 'Owoce',
    growthDays: 1825,
    phases: ['Sadzonki', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Przycinanie drzewa', 'Nawożenie', 'Zbierz gruszki'],
    tips: [
      'Wymaga ciepłego, osłoniętego stanowiska',
      'Zbieraj niedojrzałe - dojrzewają po zerwaniu',
      'Chrońć przed zarazą ogniową'
    ]
  },
  {
    name: 'Śliwka',
    emoji: '🍇',
    category: 'Owoce',
    growthDays: 1460,
    phases: ['Sadzonki', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Dojrzewanie', 'Zbiory'],
    tasks: ['Przycinanie drzewa', 'Nawożenie', 'Zbierz śliwki'],
    tips: [
      'Przycinaj latem po zbiorach',
      'Przerzedzaj owoce gdy są małe',
      'Niektóre odmiany wymagają zapylaczy'
    ]
  },
  {
    name: 'Wiśnia',
    emoji: '🍒',
    category: 'Owoce',
    growthDays: 1460,
    phases: ['Sadzonki', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Zbiory'],
    tasks: ['Przycinanie drzewa', 'Ochrona przed ptakami', 'Zbierz wiśnie'],
    tips: [
      'Przycinaj bezpośrednio po zbiorach',
      'Chroń dojrzewające owoce przed ptakami',
      'Zbieraj z ogonkami dla dłuższej świeżości'
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
  { value: 'watering', label: 'Podlewanie', icon: '💧', color: 'blue' },
  { value: 'harvest', label: 'Zbiory', icon: '🥕', color: 'yellow' },
  { value: 'weather', label: 'Pogoda', icon: '🌤️', color: 'gray' },
  { value: 'phase', label: 'Faza wzrostu', icon: '🌱', color: 'green' },
] as const;

export const NOTIFICATION_FREQUENCIES = [
  { value: 'daily', label: 'Codziennie', description: 'Powiadomienia każdego dnia' },
  { value: 'every2days', label: 'Co 2 dni', description: 'Powiadomienia co drugi dzień' },
  { value: 'weekly', label: 'Tygodniowo', description: 'Powiadomienia raz w tygodniu' },
  { value: 'custom', label: 'Niestandardowo', description: 'Ustaw własną liczbę dni' },
] as const;

export const NOTIFICATION_ADVANCE_OPTIONS = [
  { value: 0, label: 'W dniu zadania' },
  { value: 1, label: '1 dzień wcześniej' },
  { value: 2, label: '2 dni wcześniej' },
  { value: 3, label: '3 dni wcześniej' },
  { value: 7, label: '1 tydzień wcześniej' },
] as const;

export const SNOOZE_TIME_OPTIONS = [
  { value: 15, label: '15 minut' },
  { value: 30, label: '30 minut' },
  { value: 60, label: '1 godzina' },
  { value: 120, label: '2 godziny' },
  { value: 240, label: '4 godziny' },
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
    // Basic notification types
    wateringReminders: true,
    taskReminders: true,
    harvestAlerts: true,
    weatherAlerts: true,
    plantPhaseAlerts: true,

    // Timing settings
    reminderTime: '08:00',
    snoozeTime: 30, // minutes
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',

    // Frequency settings
    customWateringDays: 3, // days between watering notifications
    taskAdvanceNotice: 1, // days before task due
    harvestAdvanceNotice: 3, // days before estimated harvest

    // Priority and display settings
    highPrioritySound: true,
    showBadgeCount: true,
    groupSimilarNotifications: true,

    // Specific plant notifications
    enablePlantSpecificTiming: false,
    plantNotificationCategories: {
      vegetables: true,
      fruits: true,
      herbs: true,
      flowers: false,
    },
  },
  units: 'metric' as const,
  language: 'pl' as const,
  theme: 'dark' as const,
  autoAdvancePhases: true,
  reminderTime: '08:00', // Deprecated - moved to notifications.reminderTime
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