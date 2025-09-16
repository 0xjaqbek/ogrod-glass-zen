// src/utils/lunarUtils.ts
export type LunarPhase = 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';

export type GardenActivity = 'sow_above' | 'sow_below' | 'transplant' | 'harvest_above' | 'harvest_below' | 'prune' | 'fertilize' | 'rest';

export interface LunarRecommendation {
  phase: LunarPhase;
  activity: GardenActivity;
  title: string;
  description: string;
  icon: string;
  favorable: boolean;
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
      favorable: false
    },
    waxing_crescent: {
      phase: 'waxing_crescent',
      activity: 'sow_above',
      title: 'Siej rośliny nadziemne',
      description: 'Idealny czas na sadzenie liściastych roślin i ziół.',
      icon: '🌒',
      favorable: true
    },
    first_quarter: {
      phase: 'first_quarter',
      activity: 'transplant',
      title: 'Transplantuj',
      description: 'Przesadzaj rośliny. Energia wspiera wzrost korzeni.',
      icon: '🌓',
      favorable: true
    },
    waxing_gibbous: {
      phase: 'waxing_gibbous',
      activity: 'sow_above',
      title: 'Siej rośliny owocowe',
      description: 'Siej pomidory, papryki i inne rośliny owocowe.',
      icon: '🌔',
      favorable: true
    },
    full: {
      phase: 'full',
      activity: 'harvest_above',
      title: 'Zbieraj plony',
      description: 'Zbieraj warzywa nadziemne. Najwyższa energia w roślinach.',
      icon: '🌕',
      favorable: true
    },
    waning_gibbous: {
      phase: 'waning_gibbous',
      activity: 'harvest_above',
      title: 'Zbieraj i przechowuj',
      description: 'Zbieraj zioła i warzywa liściaste do suszenia.',
      icon: '🌖',
      favorable: true
    },
    last_quarter: {
      phase: 'last_quarter',
      activity: 'sow_below',
      title: 'Siej rośliny korzeniowe',
      description: 'Siej marchew, ziemniaki, buraki. Energia idzie w korzeń.',
      icon: '🌗',
      favorable: true
    },
    waning_crescent: {
      phase: 'waning_crescent',
      activity: 'prune',
      title: 'Przytnij i pielęgnuj',
      description: 'Tnij chwasty, przycinaj rośliny. Oczyszczaj ogród.',
      icon: '🌘',
      favorable: true
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