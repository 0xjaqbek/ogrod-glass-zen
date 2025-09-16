// src/utils/lunarUtils.ts
export type LunarPhase = 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';

export type GardenActivity = 'sow_above' | 'sow_below' | 'transplant' | 'harvest_above' | 'harvest_below' | 'prune' | 'fertilize' | 'rest';

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
  detailed: {
    favorable: DetailedActivity[];
    avoid: DetailedActivity[];
    general: string;
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

// Get garden recommendations based on Maria Thun's biodynamic principles
export function getLunarRecommendation(phase: LunarPhase): LunarRecommendation {
  const recommendations: Record<LunarPhase, LunarRecommendation> = {
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
        general: 'Nów to czas refleksji i planowania. Energia jest na najniższym poziomie, więc lepiej skupić się na przygotowaniach niż na aktywnych pracach w ogrodzie.'
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
        general: 'Rosnąca energia księżyca wspiera wzrost części nadziemnych roślin. To idealny czas na wszystkie rośliny, które hodujemy dla liści.'
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
        general: 'Równowaga energii księżycowej sprzyja rozwojowi systemu korzeniowego. Rośliny łatwiej przyjmują się po przesadzeniu.'
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
        general: 'Narastająca energia skupia się w częściach owocowych roślin. Wszystkie prace związane z owocowaniem będą teraz najskuteczniejsze.'
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
        general: 'Pełnia to szczyt energii w roślinach. Wszystko zebrane teraz będzie miało maksymalną zawartość witamin i składników odżywczych, ale szybko się zepsuje.'
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
        general: 'Malejąca energia księżyca sprzyja konserwacji i przechowywaniu. To najlepszy czas na robienie zapasów na zimę.'
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
        general: 'Energia księżyca koncentruje się w korzeniach. Wszystkie prace związane z częściami podziemnymi roślin będą teraz najskuteczniejsze.'
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
        general: 'To czas oczyszczenia i przygotowań. Malejąca energia sprzyja usuwaniu niepożądanych elementów i przygotowaniu miejsca dla nowego wzrostu.'
      }
    }
  };

  return recommendations[phase];
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