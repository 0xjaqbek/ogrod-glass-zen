// src/utils/lunarUtils.ts
export type LunarPhase = 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';

export type GardenActivity = 'sow_above' | 'sow_below' | 'transplant' | 'harvest_above' | 'harvest_below' | 'prune' | 'fertilize' | 'rest';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonalContext {
  season: Season;
  month: number;
  canGrowOutside: boolean;
  frostRisk: boolean;
  mainActivities: string[];
}

export interface DetailedActivity {
  category: string;
  activities: string[];
  plants: string[];
}

export interface LunarRecommendation {
  phase: LunarPhase;
  activity: GardenActivity;
  title: string;
  description: string;
  icon: string;
  favorable: boolean;
  seasonal: SeasonalContext;
  detailed: {
    favorable: DetailedActivity[];
    avoid: DetailedActivity[];
    general: string;
    seasonalNote: string;
  };
}

// Calculate lunar phase based on date
export function getLunarPhase(date: Date = new Date()): LunarPhase {
  // Known new moon: January 11, 2024
  const knownNewMoon = new Date('2024-01-11T11:57:00.000Z');
  const lunarCycle = 29.530588853; // days

  const daysSinceKnownNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const phase = ((daysSinceKnownNewMoon % lunarCycle) + lunarCycle) % lunarCycle;

  if (phase < 1.84566) return 'new';
  else if (phase < 5.53699) return 'waxing_crescent';
  else if (phase < 9.22831) return 'first_quarter';
  else if (phase < 12.91963) return 'waxing_gibbous';
  else if (phase < 16.61096) return 'full';
  else if (phase < 20.30228) return 'waning_gibbous';
  else if (phase < 23.99361) return 'last_quarter';
  else return 'waning_crescent';
}

// Get seasonal context for Polish climate
export function getSeasonalContext(date: Date = new Date()): SeasonalContext {
  const month = date.getMonth() + 1; // 1-12

  // Polish climate seasons
  if (month >= 3 && month <= 5) {
    return {
      season: 'spring',
      month,
      canGrowOutside: month >= 4, // After mid-April
      frostRisk: month <= 4, // Risk until end of April
      mainActivities: month === 3
        ? ['Przygotowanie grządek', 'Siew w inspekcie', 'Planowanie ogrodu']
        : month === 4
        ? ['Siew wczesnych warzyw', 'Przygotowanie gleby', 'Sadzenie sadzonek']
        : ['Sadzenie ciepłolubnych', 'Transplantacja', 'Regularne podlewanie']
    };
  } else if (month >= 6 && month <= 8) {
    return {
      season: 'summer',
      month,
      canGrowOutside: true,
      frostRisk: false,
      mainActivities: month === 6
        ? ['Sadzenie letnich warzyw', 'Pierwsze zbiory', 'Pielęgnacja']
        : month === 7
        ? ['Regularne zbiory', 'Podlewanie', 'Walka ze szkodnikami']
        : ['Ciągłe zbiory', 'Przygotowanie na jesień', 'Susz ziół']
    };
  } else if (month >= 9 && month <= 11) {
    return {
      season: 'autumn',
      month,
      canGrowOutside: month <= 10,
      frostRisk: month >= 10,
      mainActivities: month === 9
        ? ['Zbiór głównych plonów', 'Siew ozimin', 'Przygotowanie przetworów']
        : month === 10
        ? ['Ostatnie zbiory', 'Zabezpieczanie roślin', 'Przygotowanie ogrodu na zimę']
        : ['Sprzątanie ogrodu', 'Kompostowanie', 'Planowanie przyszłego roku']
    };
  } else {
    return {
      season: 'winter',
      month,
      canGrowOutside: false,
      frostRisk: true,
      mainActivities: month === 12
        ? ['Planowanie', 'Przygotowanie narzędzi', 'Studiowanie katalogów']
        : month === 1
        ? ['Planowanie nastąrzeń', 'Przygotowanie nasion', 'Prace domowe']
        : ['Pierwsze siewy w domu', 'Przygotowanie grządek', 'Planowanie ogrodu']
    };
  }
}

// Get season-specific plant recommendations
export function getSeasonalPlants(season: Season, month: number): {
  sow: string[];
  transplant: string[];
  harvest: string[];
} {
  const seasonalPlants = {
    spring: {
      3: {
        sow: ['Rzodkiewka', 'Sałata', 'Szpinak (w inspekcie)'],
        transplant: [],
        harvest: []
      },
      4: {
        sow: ['Marchew', 'Pietruszka', 'Koper', 'Rukola', 'Groch'],
        transplant: ['Kapusta wczesna', 'Sałata'],
        harvest: ['Szczypiorek', 'Pierwsze rzodkiewki']
      },
      5: {
        sow: ['Fasola', 'Ogórek', 'Cukinia', 'Koper włoski'],
        transplant: ['Pomidory', 'Papryka', 'Baklażan', 'Bazylia'],
        harvest: ['Rzodkiewka', 'Sałata', 'Szpinak', 'Szczypiorek']
      }
    },
    summer: {
      6: {
        sow: ['Brokuły', 'Kalafior', 'Sałata letnia', 'Koper'],
        transplant: ['Por', 'Seler', 'Kapusta jesień'],
        harvest: ['Truskawki', 'Groszek', 'Pierwsze ogórki', 'Sałata']
      },
      7: {
        sow: ['Rzodkiewka', 'Rukola', 'Sałata', 'Szpinak na jesień'],
        transplant: ['Kapusta pekińska', 'Endywia'],
        harvest: ['Pomidory', 'Ogórki', 'Papryka', 'Cukinia', 'Fasola']
      },
      8: {
        sow: ['Sałata zimowa', 'Szpinak', 'Rzodkiewka'],
        transplant: [],
        harvest: ['Pomidory', 'Papryka', 'Ogórki', 'Cebula', 'Czosnek']
      }
    },
    autumn: {
      9: {
        sow: ['Szpinak', 'Sałata zimowa', 'Rzodkiewka'],
        transplant: [],
        harvest: ['Marchew', 'Pietruszka', 'Burak', 'Kapusta', 'Brokuły']
      },
      10: {
        sow: ['Czosnek ozimy', 'Cebula ozima'],
        transplant: [],
        harvest: ['Ziemniaki', 'Dynia', 'Kapusta', 'Por', 'Seler']
      },
      11: {
        sow: [],
        transplant: [],
        harvest: ['Ostatnia marchew', 'Kapusta', 'Brukselka', 'Por']
      }
    },
    winter: {
      12: {
        sow: [],
        transplant: [],
        harvest: ['Brukselka', 'Kapusta', 'Sałata z tunelu']
      },
      1: {
        sow: ['Papryka (w domu)', 'Pomidory (w domu)', 'Baklażan (w domu)'],
        transplant: [],
        harvest: ['Kiełki', 'Micro-greens']
      },
      2: {
        sow: ['Seler (w domu)', 'Kapusta (w domu)', 'Sałata (w inspekcie)'],
        transplant: [],
        harvest: ['Kiełki', 'Szczypiorek z doniczek']
      }
    }
  };

  return seasonalPlants[season][month as keyof typeof seasonalPlants[typeof season]] || { sow: [], transplant: [], harvest: [] };
}

// Get seasonal note for lunar phase
function getSeasonalNote(seasonal: SeasonalContext, activity: GardenActivity): string {
  const { season, month, canGrowOutside, frostRisk } = seasonal;

  if (season === 'winter') {
    if (activity === 'sow_above' || activity === 'sow_below') {
      return month <= 2 ? 'Siej w domu lub w ogrzewanej szklarni.' : 'Przygotuj grządki pod przykrywami.';
    }
    return 'Ograniczaj prace zewnętrzne. Skup się na planowaniu i przygotowaniach.';
  }

  if (season === 'spring' && frostRisk) {
    return 'Uwaga na przymrozki! Używaj agrowłókniny lub tuneli foliowych.';
  }

  if (season === 'summer') {
    if (activity === 'harvest_above') {
      return 'Zbieraj rano lub wieczorem. Regularne podlewanie obowiązkowo.';
    }
    return 'Zapewnij regularną podtotkę. W upały prace wykonuj rano lub wieczorem.';
  }

  if (season === 'autumn') {
    if (activity === 'harvest_above' || activity === 'harvest_below') {
      return 'Ostatni dzwonek na zbiory przed mrozami. Przygotuj przetwory.';
    }
    return 'Przygotuj rośliny na zimę. Ściółkuj grządki.';
  }

  return '';
}

// Get garden recommendations based on Maria Thun's biodynamic principles with seasonal context
export function getLunarRecommendation(phase: LunarPhase, date: Date = new Date()): LunarRecommendation {
  const seasonal = getSeasonalContext(date);
  const seasonalPlants = getSeasonalPlants(seasonal.season, seasonal.month);

  // Helper function to adapt activities to season
  const getSeasonalActivities = (baseActivities: DetailedActivity[], isAvoid: boolean = false): DetailedActivity[] => {
    return baseActivities.map(activity => {
      let adaptedPlants = [...activity.plants];
      let adaptedActivities = [...activity.activities];

      // Add seasonal plants where appropriate
      if (!isAvoid) {
        if (activity.category.includes('liściaste') || activity.category.includes('Rośliny liściaste')) {
          adaptedPlants = [...new Set([...adaptedPlants, ...seasonalPlants.sow, ...seasonalPlants.harvest])];
        }
        if (activity.category.includes('Transplantacja')) {
          adaptedPlants = [...new Set([...adaptedPlants, ...seasonalPlants.transplant])];
        }
        if (activity.category.includes('Zbiór')) {
          adaptedPlants = [...new Set([...adaptedPlants, ...seasonalPlants.harvest])];
        }
      }

      // Adapt activities for winter
      if (seasonal.season === 'winter' && !isAvoid) {
        adaptedActivities = adaptedActivities.map(act =>
          act.includes('Siej') ? `${act} (w domu lub szklarni)` : act
        );
      }

      // Add frost warnings for spring
      if (seasonal.frostRisk && !isAvoid) {
        adaptedActivities = adaptedActivities.map(act =>
          act.includes('Siej') || act.includes('Przesadzaj')
            ? `${act} (chroń przed przymrozkami)`
            : act
        );
      }

      return {
        ...activity,
        activities: adaptedActivities,
        plants: adaptedPlants.filter(plant => plant.length > 0)
      };
    });
  };

  const recommendations: Record<LunarPhase, Omit<LunarRecommendation, 'seasonal'>> = {
    new: {
      phase: 'new',
      activity: 'rest',
      title: 'Odpoczynek',
      description: 'Czas na planowanie. Unikaj sadzenia i transplantacji.',
      icon: '🌑',
      favorable: false,
      detailed: {
        favorable: [
          {
            category: 'Planowanie',
            activities: ['Planuj przyszłe nasadzenia', 'Studiuj katalogi nasion', 'Przygotuj narzędzia'],
            plants: []
          }
        ],
        avoid: [
          {
            category: 'Sadzenie',
            activities: ['Unikaj sadzenia nasion', 'Nie przesadzaj roślin', 'Nie siaj żadnych nasion'],
            plants: ['Wszystkie rośliny']
          }
        ],
        general: 'Nów to czas refleksji i planowania. Energia jest na najniższym poziomie, więc lepiej skupić się na przygotowaniach niż na aktywnych pracach w ogrodzie.',
        seasonalNote: getSeasonalNote(seasonal, 'rest')
      }
    },
    waxing_crescent: {
      phase: 'waxing_crescent',
      activity: 'sow_above',
      title: 'Siej rośliny nadziemne',
      description: 'Idealny czas na sadzenie liściastych roślin i ziół.',
      icon: '🌒',
      favorable: true,
      detailed: {
        favorable: [
          {
            category: 'Rośliny liściaste',
            activities: ['Siej nasiona', 'Przesadzaj sadzonki', 'Podlewaj delikatnie'],
            plants: ['Sałata', 'Szpinak', 'Kapusta', 'Rukola', 'Jarmuż']
          },
          {
            category: 'Zioła liściaste',
            activities: ['Siej zioła', 'Dziel kępy', 'Zbieraj młode liście'],
            plants: ['Bazylia', 'Pietruszka naciowa', 'Koper', 'Szczypiorek', 'Oregano']
          }
        ],
        avoid: [
          {
            category: 'Rośliny korzeniowe',
            activities: ['Unikaj sadzenia korzeniówek'],
            plants: ['Marchew', 'Rzodkiewka', 'Burak', 'Ziemniak']
          }
        ],
        general: 'Rosnąca energia księżyca wspiera wzrost części nadziemnych roślin. To idealny czas na wszystkie rośliny, które hodujemy dla liści.',
        seasonalNote: getSeasonalNote(seasonal, 'sow_above')
      }
    },
    first_quarter: {
      phase: 'first_quarter',
      activity: 'transplant',
      title: 'Transplantuj',
      description: 'Przesadzaj rośliny. Energia wspiera wzrost korzeni.',
      icon: '🌓',
      favorable: true,
      detailed: {
        favorable: [
          {
            category: 'Transplantacja',
            activities: ['Przesadzaj sadzonki', 'Dziel byliny', 'Sadzenie z doniczek do gruntu'],
            plants: ['Pomidory', 'Papryka', 'Bakłażan', 'Kwiaty jednoroczne']
          },
          {
            category: 'Pielęgnacja',
            activities: ['Podlewanie', 'Lekkie nawożenie', 'Spulchnianie gleby'],
            plants: ['Wszystkie rośliny']
          }
        ],
        avoid: [
          {
            category: 'Drastyczne cięcie',
            activities: ['Unikaj silnego przycinania', 'Nie tnij głównych pędów'],
            plants: ['Rośliny owocujące']
          }
        ],
        general: 'Równowaga energii księżycowej sprzyja rozwojowi systemu korzeniowego. Rośliny łatwiej przyjmują się po przesadzeniu.',
        seasonalNote: getSeasonalNote(seasonal, 'transplant')
      }
    },
    waxing_gibbous: {
      phase: 'waxing_gibbous',
      activity: 'sow_above',
      title: 'Siej rośliny owocowe',
      description: 'Siej pomidory, papryki i inne rośliny owocowe.',
      icon: '🌔',
      favorable: true,
      detailed: {
        favorable: [
          {
            category: 'Rośliny owocowe',
            activities: ['Siej nasiona', 'Przesadzaj sadzonki', 'Zapylaj ręcznie'],
            plants: ['Pomidor', 'Papryka', 'Ogórek', 'Cukinia', 'Dynia', 'Fasola']
          },
          {
            category: 'Owoce drzew',
            activities: ['Szczep owocowe', 'Nawóż drzewa owocowe', 'Usuń odrosty korzeniowe'],
            plants: ['Jabłoń', 'Śliwa', 'Wiśnia', 'Brzoskwinia']
          }
        ],
        avoid: [
          {
            category: 'Zbiory długoterminowe',
            activities: ['Nie zbieraj owoców do długiego przechowywania'],
            plants: ['Jabłka na zimę', 'Gruszki do przechowania']
          }
        ],
        general: 'Narastająca energia skupia się w częściach owocowych roślin. Wszystkie prace związane z owocowaniem będą teraz najskuteczniejsze.',
        seasonalNote: getSeasonalNote(seasonal, 'sow_above')
      }
    },
    full: {
      phase: 'full',
      activity: 'harvest_above',
      title: 'Zbieraj plony',
      description: 'Zbieraj warzywa nadziemne. Najwyższa energia w roślinach.',
      icon: '🌕',
      favorable: true,
      detailed: {
        favorable: [
          {
            category: 'Zbiór natychmiastowy',
            activities: ['Zbieraj do bezpośredniego spożycia', 'Rób soki i smoothie', 'Przygotuj sałatki'],
            plants: ['Sałaty', 'Pomidory', 'Ogórki', 'Zioła', 'Owoce']
          },
          {
            category: 'Nasiona',
            activities: ['Zbieraj nasiona do siewu', 'Suszy nasiona', 'Przechowuj materiał siewny'],
            plants: ['Pomidor', 'Papryka', 'Fasola', 'Groch']
          }
        ],
        avoid: [
          {
            category: 'Przechowywanie',
            activities: ['Unikaj zbioru do długiego przechowania', 'Nie rób przetworów długoterminowych'],
            plants: ['Warzywa korzeniowe do składowania']
          }
        ],
        general: 'Pełnia to szczyt energii w roślinach. Wszystko zebrane teraz będzie miało maksymalną zawartość witamin i składników odżywczych, ale szybko się zepsuje.',
        seasonalNote: getSeasonalNote(seasonal, 'harvest_above')
      }
    },
    waning_gibbous: {
      phase: 'waning_gibbous',
      activity: 'harvest_above',
      title: 'Zbieraj i przechowuj',
      description: 'Zbieraj zioła i warzywa liściaste do suszenia.',
      icon: '🌖',
      favorable: true,
      detailed: {
        favorable: [
          {
            category: 'Suszenie ziół',
            activities: ['Zbieraj zioła do suszenia', 'Wiąż bukiety', 'Przygotuj oleje ziołowe'],
            plants: ['Lawendy', 'Rozmaryn', 'Tymianek', 'Oregano', 'Mięta']
          },
          {
            category: 'Przetwory',
            activities: ['Rób przetwory', 'Marynuj warzywa', 'Kwaś kapustę'],
            plants: ['Kapusta', 'Ogórki', 'Pomidory', 'Papryka']
          }
        ],
        avoid: [
          {
            category: 'Sadzenie nowego',
            activities: ['Unikaj siewu nowych roślin', 'Nie zakładaj nowych grządek'],
            plants: ['Rośliny nadziemne']
          }
        ],
        general: 'Malejąca energia księżyca sprzyja konserwacji i przechowywaniu. To najlepszy czas na robienie zapasów na zimę.',
        seasonalNote: getSeasonalNote(seasonal, 'harvest_above')
      }
    },
    last_quarter: {
      phase: 'last_quarter',
      activity: 'sow_below',
      title: 'Siej rośliny korzeniowe',
      description: 'Siej marchew, ziemniaki, buraki. Energia idzie w korzeń.',
      icon: '🌗',
      favorable: true,
      detailed: {
        favorable: [
          {
            category: 'Warzywa korzeniowe',
            activities: ['Siej nasiona', 'Sadź bulwy', 'Przygotuj grządki'],
            plants: ['Marchew', 'Pietruszka korzeniowa', 'Seler', 'Burak', 'Rzodkiewka']
          },
          {
            category: 'Cebulowe',
            activities: ['Sadź cebulki', 'Dziel kępy', 'Przygotuj do zimy'],
            plants: ['Cebula', 'Czosnek', 'Szalotka', 'Por']
          },
          {
            category: 'Bulwy',
            activities: ['Sadź ziemniaki', 'Dziel georginie', 'Przechowuj bulwy'],
            plants: ['Ziemniak', 'Topinambur', 'Georginia']
          }
        ],
        avoid: [
          {
            category: 'Rośliny nadziemne',
            activities: ['Unikaj siewu liści i owoców', 'Nie przesadzaj roślin liściastych'],
            plants: ['Sałata', 'Kapusta', 'Pomidory']
          }
        ],
        general: 'Energia księżyca koncentruje się w korzeniach. Wszystkie prace związane z częściami podziemnymi roślin będą teraz najskuteczniejsze.',
        seasonalNote: getSeasonalNote(seasonal, 'sow_below')
      }
    },
    waning_crescent: {
      phase: 'waning_crescent',
      activity: 'prune',
      title: 'Przytnij i pielęgnuj',
      description: 'Tnij chwasty, przycinaj rośliny. Oczyszczaj ogród.',
      icon: '🌘',
      favorable: true,
      detailed: {
        favorable: [
          {
            category: 'Pielenie',
            activities: ['Usuń chwasty', 'Oczyść grządki', 'Przygotuj kompost'],
            plants: ['Wszystkie obszary ogrodu']
          },
          {
            category: 'Przycinanie',
            activities: ['Przycinaj krzewы', 'Usuń chore części', 'Formuj krzewy'],
            plants: ['Róże', 'Krzewы owocowe', 'Żywopłoty']
          },
          {
            category: 'Przygotowanie gleby',
            activities: ['Spulchniaj ziemię', 'Dodaj kompost', 'Przygotuj nowe grządki'],
            plants: []
          }
        ],
        avoid: [
          {
            category: 'Sadzenie',
            activities: ['Unikaj sadzenia nowych roślin', 'Nie siaj nasion'],
            plants: ['Wszystkie nowe nasiona']
          }
        ],
        general: 'To czas oczyszczenia i przygotowań. Malejąca energia sprzyja usuwaniu niepożądanych elementów i przygotowaniu miejsca dla nowego wzrostu.',
        seasonalNote: getSeasonalNote(seasonal, 'prune')
      }
    }
  };

  const baseRecommendation = recommendations[phase];
  return {
    ...baseRecommendation,
    seasonal,
    detailed: {
      ...baseRecommendation.detailed,
      favorable: getSeasonalActivities(baseRecommendation.detailed.favorable),
      avoid: getSeasonalActivities(baseRecommendation.detailed.avoid, true)
    }
  };
}

// Get current lunar recommendation
export function getCurrentLunarRecommendation(): LunarRecommendation {
  const phase = getLunarPhase();
  return getLunarRecommendation(phase);
}

// Get phase name in Polish
export function getPhaseName(phase: LunarPhase): string {
  const names: Record<LunarPhase, string> = {
    new: 'Nów',
    waxing_crescent: 'Przybywający sierp',
    first_quarter: 'Pierwsza kwadra',
    waxing_gibbous: 'Przybywający garb',
    full: 'Pełnia',
    waning_gibbous: 'Ubywający garb',
    last_quarter: 'Ostatnia kwadra',
    waning_crescent: 'Ubywający sierp'
  };

  return names[phase];
}