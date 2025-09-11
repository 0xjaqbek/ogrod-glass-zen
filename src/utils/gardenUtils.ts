// src/utils/gardenUtils.ts
import { Plant, Task, Notification } from '@/contexts/GardenContext';

export const generatePlantTasks = (
  plant: Plant,
  gardenId: string,
  bedId: string,
  generateId: () => string
): Task[] => {
  const tasks: Task[] = [];
  const now = new Date();

  // Generate different tasks based on plant phase
  switch (plant.phase) {
    case 'Nasiona':
      tasks.push({
        id: generateId(),
        title: `Podlej nasiona ${plant.name}`,
        description: 'Delikatne podlewanie nasion',
        plantId: plant.id,
        bedId,
        gardenId,
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        completed: false,
        type: 'watering',
        priority: 'high',
      });
      break;

    case 'Sadzonki':
      tasks.push(
        {
          id: generateId(),
          title: `Podlej sadzonki ${plant.name}`,
          description: 'Regularne podlewanie młodych roślin',
          plantId: plant.id,
          bedId,
          gardenId,
          dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
          completed: false,
          type: 'watering',
          priority: 'high',
        },
        {
          id: generateId(),
          title: `Sprawdź wzrost ${plant.name}`,
          description: 'Ocena rozwoju sadzonek',
          plantId: plant.id,
          bedId,
          gardenId,
          dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
          completed: false,
          type: 'other',
          priority: 'medium',
        }
      );
      break;

    case 'Wzrost':
      tasks.push(
        {
          id: generateId(),
          title: `Podlej ${plant.name}`,
          description: 'Regularne podlewanie podczas wzrostu',
          plantId: plant.id,
          bedId,
          gardenId,
          dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          completed: false,
          type: 'watering',
          priority: 'medium',
        },
        {
          id: generateId(),
          title: `Nawóź ${plant.name}`,
          description: 'Dodanie nawozów dla lepszego wzrostu',
          plantId: plant.id,
          bedId,
          gardenId,
          dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          completed: false,
          type: 'fertilizing',
          priority: 'medium',
        }
      );
      break;

    case 'Kwitnienie':
      if (['Pomidor', 'Ogórek', 'Papryka'].includes(plant.name)) {
        tasks.push({
          id: generateId(),
          title: `Podwiąż ${plant.name}`,
          description: 'Podwiąż rośliny podczas kwitnienia',
          plantId: plant.id,
          bedId,
          gardenId,
          dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          completed: false,
          type: 'other',
          priority: 'medium',
        });
      }
      tasks.push({
        id: generateId(),
        title: `Podlej ${plant.name}`,
        description: 'Intensywne podlewanie podczas kwitnienia',
        plantId: plant.id,
        bedId,
        gardenId,
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        completed: false,
        type: 'watering',
        priority: 'high',
      });
      break;

    case 'Owocowanie':
      tasks.push({
        id: generateId(),
        title: `Podlej ${plant.name}`,
        description: 'Regularne podlewanie podczas owocowania',
        plantId: plant.id,
        bedId,
        gardenId,
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        completed: false,
        type: 'watering',
        priority: 'high',
      });
      break;

    case 'Dojrzewanie':
      tasks.push(
        {
          id: generateId(),
          title: `Sprawdź dojrzałość ${plant.name}`,
          description: 'Ocena stopnia dojrzałości owoców',
          plantId: plant.id,
          bedId,
          gardenId,
          dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          completed: false,
          type: 'other',
          priority: 'medium',
        },
        {
          id: generateId(),
          title: `Podlej ${plant.name}`,
          description: 'Umiarkowane podlewanie dojrzewających roślin',
          plantId: plant.id,
          bedId,
          gardenId,
          dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          completed: false,
          type: 'watering',
          priority: 'medium',
        }
      );
      break;

    case 'Zbiory':
      tasks.push({
        id: generateId(),
        title: `Zbierz ${plant.name}`,
        description: 'Czas na zbiory!',
        plantId: plant.id,
        bedId,
        gardenId,
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        completed: false,
        type: 'harvesting',
        priority: 'high',
      });
      break;
  }

  return tasks;
};

export const calculatePlantProgress = (plant: Plant): number => {
  const daysSincePlanted = Math.floor(
    (Date.now() - plant.plantedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Estimated days to maturity for different plants
  const maturityDays: { [key: string]: number } = {
    'Rzodkiewka': 30,
    'Sałata': 60,
    'Marchew': 80,
    'Ogórek': 90,
    'Papryka': 100,
    'Pomidor': 120,
    'Cebula': 140,
    'Kapusta': 150,
  };

  const estimatedDays = maturityDays[plant.name] || 90;
  const progress = Math.min(100, Math.max(5, (daysSincePlanted / estimatedDays) * 100));

  return Math.round(progress);
};

export const getNextPhase = (currentPhase: string): string => {
  const phases = [
    'Nasiona',
    'Sadzonki', 
    'Wschody',
    'Wzrost',
    'Kwitnienie',
    'Owocowanie',
    'Dojrzewanie',
    'Zbiory'
  ];

  const currentIndex = phases.indexOf(currentPhase);
  if (currentIndex < phases.length - 1) {
    return phases[currentIndex + 1];
  }
  return currentPhase; // Already at final phase
};

export const shouldAdvancePhase = (plant: Plant): boolean => {
  const progress = calculatePlantProgress(plant);
  const phases = [
    'Nasiona',
    'Sadzonki', 
    'Wschody',
    'Wzrost',
    'Kwitnienie',
    'Owocowanie',
    'Dojrzewanie',
    'Zbiory'
  ];

  const currentIndex = phases.indexOf(plant.phase);
  const thresholds = [10, 20, 35, 50, 65, 80, 95, 100];

  return progress >= thresholds[currentIndex] && currentIndex < phases.length - 1;
};

export const getPlantCareInstructions = (plant: Plant): string[] => {
  const instructions: string[] = [];

  switch (plant.phase) {
    case 'Nasiona':
      instructions.push('Utrzymuj stałą wilgotność gleby');
      instructions.push('Zapewnij odpowiednią temperaturę (18-22°C)');
      instructions.push('Nie narażaj na bezpośrednie słońce');
      break;

    case 'Sadzonki':
      instructions.push('Delikatne, ale regularne podlewanie');
      instructions.push('Stopniowo zwiększaj ekspozycję na słońce');
      instructions.push('Zabezpiecz przed mrozem');
      break;

    case 'Wzrost':
      instructions.push('Regularne podlewanie');
      instructions.push('Dodaj nawóz uniwersalny');
      instructions.push('Usuń chwasty wokół rośliny');
      break;

    case 'Kwitnienie':
      instructions.push('Intensywne podlewanie');
      instructions.push('Unikaj podlewania liści');
      instructions.push('Dodaj nawóz z fosforem');
      break;

    case 'Owocowanie':
      instructions.push('Regularne, głębokie podlewanie');
      instructions.push('Mulczuj glebę');
      instructions.push('Usuń nadmiar liści');
      break;

    case 'Dojrzewanie':
      instructions.push('Ogranicz podlewanie');
      instructions.push('Sprawdzaj codziennie stan owoców');
      instructions.push('Zabezpiecz przed szkodnikami');
      break;

    case 'Zbiory':
      instructions.push('Zbieraj regularnie');
      instructions.push('Zbieraj rano lub wieczorem');
      instructions.push('Przechowuj w odpowiednich warunkach');
      break;
  }

  // Add plant-specific instructions
  if (['Pomidor', 'Ogórek', 'Papryka'].includes(plant.name)) {
    instructions.push('Podwiąż do podpory');
  }

  if (plant.name === 'Pomidor') {
    instructions.push('Usuń boczne pędy');
  }

  return instructions;
};

export const generateHarvestNotification = (
  plant: Plant,
  generateId: () => string
): Notification | null => {
  if (plant.phase === 'Zbiory' || plant.progress >= 95) {
    return {
      id: generateId(),
      title: 'Czas na zbiory! 🎉',
      message: `${plant.emoji} ${plant.name} jest gotowe do zbioru`,
      type: 'alert',
      read: false,
      createdDate: new Date(),
      plantId: plant.id,
    };
  }
  return null;
};

export const getSeasonalRecommendations = (): string[] => {
  const month = new Date().getMonth(); // 0-11
  const recommendations: string[] = [];

  // Spring (March-May: months 2-4)
  if (month >= 2 && month <= 4) {
    recommendations.push('🌱 Czas na siew nasion w inspekcie');
    recommendations.push('🌿 Przygotuj grządki do sezonu');
    recommendations.push('💧 Zwiększ częstotliwość podlewania');
  }
  // Summer (June-August: months 5-7)
  else if (month >= 5 && month <= 7) {
    recommendations.push('☀️ Intensywne podlewanie w gorące dni');
    recommendations.push('🥒 Regularnie zbieraj warzywa');
    recommendations.push('🌿 Mulczuj glebę');
  }
  // Autumn (September-November: months 8-10)
  else if (month >= 8 && month <= 10) {
    recommendations.push('🍂 Czas na zbiory główne');
    recommendations.push('🌰 Przygotuj rośliny do zimy');
    recommendations.push('📦 Planuj przechowywanie plonów');
  }
  // Winter (December-February: months 11, 0, 1)
  else {
    recommendations.push('❄️ Zabezpiecz rośliny przed mrozem');
    recommendations.push('📚 Planuj następny sezon');
    recommendations.push('🛠️ Serwisuj narzędzia ogrodnicze');
  }

  return recommendations;
};

export const exportGardenData = (data: any): string => {
  const exportData = {
    ...data,
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    metadata: {
      totalGardens: data.gardens?.length || 0,
      totalPlants: data.gardens?.reduce((sum: number, garden: any) => 
        sum + garden.beds?.reduce((bedSum: number, bed: any) => 
          bedSum + (bed.plants?.length || 0), 0), 0) || 0,
      totalTasks: data.tasks?.length || 0,
      totalActivities: data.activities?.length || 0,
    }
  };

  return JSON.stringify(exportData, null, 2);
};

export const validateImportData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Nieprawidłowy format danych');
    return { valid: false, errors };
  }

  if (!Array.isArray(data.gardens)) {
    errors.push('Brak danych o ogrodach lub nieprawidłowy format');
  }

  if (data.tasks && !Array.isArray(data.tasks)) {
    errors.push('Nieprawidłowy format zadań');
  }

  if (data.activities && !Array.isArray(data.activities)) {
    errors.push('Nieprawidłowy format aktywności');
  }

  // Check for required fields in gardens
  if (Array.isArray(data.gardens)) {
    data.gardens.forEach((garden: any, index: number) => {
      if (!garden.id || !garden.name) {
        errors.push(`Ogród ${index + 1}: brak wymaganych pól (id, name)`);
      }
      if (!Array.isArray(garden.beds)) {
        errors.push(`Ogród ${index + 1}: nieprawidłowy format grządek`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getPlantEmoji = (plantName: string): string => {
  const emojiMap: { [key: string]: string } = {
    'Pomidor': '🍅',
    'Ogórek': '🥒',
    'Papryka': '🌶️',
    'Sałata': '🥬',
    'Marchew': '🥕',
    'Rzodkiewka': '🔴',
    'Cebula': '🧅',
    'Ziemniak': '🥔',
    'Fasolka': '🫘',
    'Groszek': '🟢',
    'Kapusta': '🥬',
    'Brokuły': '🥦',
    'Pietruszka': '🌿',
    'Koper': '🌿',
    'Bazylia': '🌿',
    'Truskawka': '🍓',
  };

  return emojiMap[plantName] || '🌱';
};