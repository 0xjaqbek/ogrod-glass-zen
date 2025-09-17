// src/components/BedDetail.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Plus, Droplets, Sprout, Clock, History, Calendar, CheckCircle } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface BedDetailProps {
  bedId: string;
  onBack: () => void;
  onPlantSelect: (plantId: string) => void;
}

const BedDetail = ({ bedId, onBack, onPlantSelect }: BedDetailProps) => {
  const { state, addPlant, addActivity } = useGarden();
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [newPlantData, setNewPlantData] = useState({
    name: '',
    emoji: '🌱',
    phase: 'planted' as 'planted' | 'growing' | 'flowering' | 'fruiting' | 'mature',
    progress: 10,
    variety: '',
    notes: '',
  });

  // Find the bed by searching through all gardens
  const bed = state.gardens
    .flatMap(garden => garden.beds.map(bed => ({ ...bed, gardenId: garden.id })))
    .find(bed => bed.id === bedId);
  
  const selectedGarden = bed ? state.gardens.find(g => g.id === bed.gardenId) : null;

  // Plant options with emojis
  const plantOptions = [
    { name: 'Pomidor', emoji: '🍅', tasks: ['Podlej roślinę', 'Podwiąż pędy', 'Usuń boczne pędy'] },
    { name: 'Ogórek', emoji: '🥒', tasks: ['Podlej roślinę', 'Podwiąż pędy', 'Zbierz owoce'] },
    { name: 'Papryka', emoji: '🌶️', tasks: ['Podlej roślinę', 'Przesadź do gruntu', 'Zbierz owoce'] },
    { name: 'Sałata', emoji: '🥬', tasks: ['Podlej roślinę', 'Przerzedź sadzonki', 'Zbierz liście'] },
    { name: 'Marchew', emoji: '🥕', tasks: ['Podlej roślinę', 'Przerzedź sadzonki', 'Zbierz korzenie'] },
    { name: 'Rzodkiewka', emoji: '🔴', tasks: ['Podlej roślinę', 'Przerzedź sadzonki', 'Zbierz korzenie'] },
    { name: 'Cebula', emoji: '🧅', tasks: ['Podlej roślinę', 'Odchwaszczanie', 'Zbierz cebule'] },
    { name: 'Ziemniak', emoji: '🥔', tasks: ['Podlej roślinę', 'Obsypywanie', 'Zbierz ziemniaki'] },
    { name: 'Fasolka', emoji: '🫘', tasks: ['Podlej roślinę', 'Podwiąż podpory', 'Zbierz strąki'] },
    { name: 'Groszek', emoji: '🟢', tasks: ['Podlej roślinę', 'Podwiąż podpory', 'Zbierz strąki'] },
    { name: 'Kapusta', emoji: '🥬', tasks: ['Podlej roślinę', 'Ochrona przed szkodnikami', 'Zbierz główki'] },
    { name: 'Brokuły', emoji: '🥦', tasks: ['Podlej roślinę', 'Nawożenie', 'Zbierz różyczki'] },
    { name: 'Pietruszka', emoji: '🌿', tasks: ['Podlej roślinę', 'Przerzedź sadzonki', 'Zbierz liście'] },
    { name: 'Koper', emoji: '🌿', tasks: ['Podlej roślinę', 'Przerzedź sadzonki', 'Zbierz liście'] },
    { name: 'Bazylia', emoji: '🌿', tasks: ['Podlej roślinę', 'Przycinanie', 'Zbierz liście'] },
    { name: 'Truskawka', emoji: '🍓', tasks: ['Podlej roślinę', 'Usuń rozłogi', 'Zbierz owoce'] },
  ];

  const phases = [
    { value: 'planted', label: 'Posadzone' },
    { value: 'growing', label: 'Wzrost' },
    { value: 'flowering', label: 'Kwitnienie' },
    { value: 'fruiting', label: 'Owocowanie' },
    { value: 'mature', label: 'Dojrzałe' }
  ] as const;

  if (!selectedGarden || !bed) {
    return (
      <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="glass-button h-8 w-8 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-foreground">Nie znaleziono grządki</h1>
            <p className="text-sm sm:text-base text-foreground-secondary">Wróć i wybierz grządkę</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddPlant = () => {
    if (newPlantData.name.trim() && selectedGarden) {
      addPlant(selectedGarden.id, bedId, {
        name: newPlantData.name.trim(),
        emoji: newPlantData.emoji,
        phase: newPlantData.phase,
        progress: newPlantData.progress,
        plantedDate: new Date(),
        variety: newPlantData.variety.trim() || undefined,
        notes: newPlantData.notes.trim() || undefined,
      });
      
      setNewPlantData({
        name: '',
        emoji: '🌱',
        phase: 'planted' as 'planted' | 'growing' | 'flowering' | 'fruiting' | 'mature',
        progress: 10,
        variety: '',
        notes: '',
      });
      setIsAddPlantOpen(false);
      
      toast({
        title: "Roślina dodana! 🌱",
        description: `Posadzono: ${newPlantData.emoji} ${newPlantData.name}`,
      });
    }
  };

  const handlePlantSelect = (plantName: string) => {
    const plant = plantOptions.find(p => p.name === plantName);
    if (plant) {
      setNewPlantData(prev => ({
        ...prev,
        name: plant.name,
        emoji: plant.emoji,
      }));
    }
  };

  const getPhaseColor = (phase: string) => {
    const phaseColors = {
      'planted': 'bg-green-500/20 text-green-500 border-green-500/30',
      'growing': 'bg-teal-500/20 text-teal-500 border-teal-500/30',
      'flowering': 'bg-purple-500/20 text-purple-500 border-purple-500/30',
      'fruiting': 'bg-orange-500/20 text-orange-500 border-orange-500/30',
      'mature': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    };
    return phaseColors[phase as keyof typeof phaseColors] || 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
  };

  const handleWaterBed = () => {
    if (selectedGarden && bed) {
      const now = new Date();

      // Add bed-level activity
      addActivity({
        action: `Podlano całą grządkę "${bed.name}"`,
        date: now,
        gardenId: selectedGarden.id,
        bedId: bed.id,
      });

      // Update lastWatered for all plants in the bed
      bed.plants.forEach(plant => {
        const updatedPlant = {
          ...plant,
          lastWatered: now
        };

        dispatch({
          type: 'UPDATE_PLANT',
          payload: {
            gardenId: selectedGarden.id,
            bedId: bed.id,
            plant: updatedPlant
          }
        });
      });

      toast({
        title: "Grządka podlana! 💧",
        description: `Podlano całą grządkę "${bed.name}" i wszystkie rośliny`,
      });
    }
  };

  const handleFertilizeBed = () => {
    if (selectedGarden && bed) {
      const now = new Date();

      // Add bed-level activity
      addActivity({
        action: `Nawożono całą grządkę "${bed.name}"`,
        date: now,
        gardenId: selectedGarden.id,
        bedId: bed.id,
      });

      // Update lastFertilized for all plants in the bed and add individual activities
      bed.plants.forEach(plant => {
        const updatedPlant = {
          ...plant,
          lastFertilized: now
        };

        dispatch({
          type: 'UPDATE_PLANT',
          payload: {
            gardenId: selectedGarden.id,
            bedId: bed.id,
            plant: updatedPlant
          }
        });

        addActivity({
          action: `Nawożono roślinę ${plant.emoji} ${plant.name}`,
          date: now,
          gardenId: selectedGarden.id,
          bedId: bed.id,
          plantId: plant.id,
        });
      });

      toast({
        title: "Grządka nawożona! 🌱",
        description: `Nawożono całą grządkę "${bed.name}" i wszystkie rośliny`,
      });
    }
  };

  // Get bed-specific activities and tasks
  const getBedActivities = () => {
    const activities = state.activities
      .filter(activity => activity.bedId === bedId)
      .map(activity => ({
        ...activity,
        type: 'activity' as const
      }));

    const tasks = state.tasks
      .filter(task => task.bedId === bedId)
      .map(task => ({
        id: task.id,
        action: task.completed
          ? `Ukończono zadanie: ${task.title}`
          : `Zadanie: ${task.title}`,
        date: task.dueDate,
        gardenId: task.gardenId,
        bedId: task.bedId,
        plantId: task.plantId,
        type: 'task' as const,
        completed: task.completed,
        taskType: task.type
      }));

    return [...activities, ...tasks]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const formatActivityDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="glass-button h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">
              {bed.name}
            </h1>
            <p className="text-sm sm:text-base text-foreground-secondary">
              {bed.plants.length === 0 
                ? 'Brak roślin w grządce' 
                : `${bed.plants.length} ${bed.plants.length === 1 ? 'roślina' : bed.plants.length < 5 ? 'rośliny' : 'roślin'} w grządce`
              }
            </p>
          </div>
        </div>
        
        <Dialog open={isAddPlantOpen} onOpenChange={setIsAddPlantOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="glass-button emerald-glow rounded-full h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Dodaj nową roślinę</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="plant-select">Wybierz roślinę</Label>
                <Select onValueChange={handlePlantSelect}>
                  <SelectTrigger className="glass">
                    <SelectValue placeholder="Wybierz typ rośliny" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    {plantOptions.map((plant) => (
                      <SelectItem key={plant.name} value={plant.name}>
                        {plant.emoji} {plant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plant-name">Nazwa rośliny *</Label>
                  <Input
                    id="plant-name"
                    value={newPlantData.name}
                    onChange={(e) => setNewPlantData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="np. Pomidor"
                    className="glass"
                  />
                </div>
                <div>
                  <Label htmlFor="plant-emoji">Emoji</Label>
                  <Input
                    id="plant-emoji"
                    value={newPlantData.emoji}
                    onChange={(e) => setNewPlantData(prev => ({ ...prev, emoji: e.target.value }))}
                    placeholder="🌱"
                    className="glass"
                    maxLength={2}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="plant-phase">Faza wzrostu</Label>
                <Select 
                  value={newPlantData.phase}
                  onValueChange={(value: any) => setNewPlantData(prev => ({ ...prev, phase: value }))}
                >
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    {phases.map((phase) => (
                      <SelectItem key={phase.value} value={phase.value}>
                        {phase.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="plant-variety">Odmiana (opcjonalnie)</Label>
                <Input
                  id="plant-variety"
                  value={newPlantData.variety}
                  onChange={(e) => setNewPlantData(prev => ({ ...prev, variety: e.target.value }))}
                  placeholder="np. Cherry, Malinowy Ożarowski"
                  className="glass"
                />
              </div>

              <div>
                <Label htmlFor="plant-notes">Notatki</Label>
                <Textarea
                  id="plant-notes"
                  value={newPlantData.notes}
                  onChange={(e) => setNewPlantData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Dodatkowe informacje o roślinie..."
                  className="glass"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handleAddPlant} 
                  className="flex-1"
                  disabled={!newPlantData.name.trim()}
                >
                  Dodaj roślinę
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsAddPlantOpen(false)}
                  className="flex-1"
                >
                  Anuluj
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bed Actions */}
      {bed.plants.length > 0 && (
        <Card className="glass rounded-xl p-3 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-3">
            Akcje dla całej grządki
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Button
              onClick={handleWaterBed}
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 text-xs sm:text-sm py-2 sm:py-3"
            >
              <Droplets className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Podlej całą grządkę</span>
              <span className="sm:hidden">Podlej</span>
            </Button>
            <Button
              onClick={handleFertilizeBed}
              className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 text-xs sm:text-sm py-2 sm:py-3"
            >
              <Sprout className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Nawieź całą grządkę</span>
              <span className="sm:hidden">Nawieź</span>
            </Button>
            <Button
              onClick={() => setIsHistoryOpen(true)}
              variant="outline"
              className="glass-button flex items-center justify-center gap-2 text-xs sm:text-sm py-2 sm:py-3"
            >
              <History className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Historia</span>
              <span className="sm:hidden">Historia</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Plants List */}
      {bed.plants.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Rośliny</h2>
          <div className="space-y-3">
            {bed.plants.map((plant) => (
              <Card 
                key={plant.id} 
                className="glass rounded-xl p-3 sm:p-6 glass-hover cursor-pointer"
                onClick={() => onPlantSelect(plant.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="text-2xl sm:text-3xl flex-shrink-0">
                      {plant.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-medium text-foreground">
                        {plant.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge 
                          variant="secondary" 
                          className={`glass text-xs ${getPhaseColor(plant.phase)}`}
                        >
                          {plant.phase}
                        </Badge>
                        {plant.lastWatered && (() => {
                          const wateredDate = new Date(plant.lastWatered);
                          const isValidDate = !isNaN(wateredDate.getTime());
                          const daysAgo = isValidDate ? Math.floor((Date.now() - wateredDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

                          return isValidDate && (
                            <Badge variant="outline" className="glass text-xs">
                              Podlano: {daysAgo} dni temu
                            </Badge>
                          );
                        })()}
                        {plant.lastFertilized && (() => {
                          const fertilizedDate = new Date(plant.lastFertilized);
                          const isValidDate = !isNaN(fertilizedDate.getTime());
                          const daysAgo = isValidDate ? Math.floor((Date.now() - fertilizedDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

                          return isValidDate && (
                            <Badge variant="outline" className="glass text-xs">
                              Nawożono: {daysAgo} dni temu
                            </Badge>
                          );
                        })()}
                      </div>
                      {plant.notes && (
                        <p className="text-xs text-foreground-secondary mt-1 truncate">
                          📝 {plant.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-foreground-secondary flex-shrink-0" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Brak roślin w grządce
          </h3>
          <p className="text-foreground-secondary mb-4 max-w-sm">
            Rozpocznij uprawę dodając pierwszą roślinę do tej grządki.
          </p>
          <Button 
            onClick={() => setIsAddPlantOpen(true)}
            className="emerald-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Dodaj pierwszą roślinę
          </Button>
        </div>
      )}

      {/* Bed Info Card */}
      <Card className="glass rounded-xl p-3 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-3">
          Informacje o grządce
        </h3>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-foreground-secondary">Lokalizacja:</span>
            <span className="text-foreground">{bed.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-secondary">Rozmiar:</span>
            <span className="text-foreground">{bed.size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-secondary">Rośliny:</span>
            <span className="text-foreground">{bed.plants.length}</span>
          </div>
          {bed.plants.length > 0 && (
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Średni postęp:</span>
              <span className="text-foreground">
                {Math.round(bed.plants.reduce((sum, plant) => sum + plant.progress, 0) / bed.plants.length)}%
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="glass max-h-[80vh] overflow-y-auto bg-background/95 dark:bg-background/90 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Historia grządki "{bed.name}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {getBedActivities().length > 0 ? (
              <div className="space-y-3">
                {getBedActivities().map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 bg-emerald/[0.02] dark:bg-emerald/[0.01] rounded-lg">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-emerald/20">
                      {item.type === 'task' ? (
                        item.taskType === 'watering' ? (
                          <Droplets className={`h-4 w-4 ${item.completed ? 'text-blue-500' : 'text-blue-300'}`} />
                        ) : item.taskType === 'fertilizing' ? (
                          <Sprout className={`h-4 w-4 ${item.completed ? 'text-green-500' : 'text-green-300'}`} />
                        ) : item.taskType === 'harvesting' ? (
                          <CheckCircle className={`h-4 w-4 ${item.completed ? 'text-orange-500' : 'text-orange-300'}`} />
                        ) : (
                          <Calendar className={`h-4 w-4 ${item.completed ? 'text-emerald' : 'text-foreground-secondary'}`} />
                        )
                      ) : item.action.includes('Podlano') ? (
                        <Droplets className="h-4 w-4 text-blue-500" />
                      ) : item.action.includes('Nawożono') ? (
                        <Sprout className="h-4 w-4 text-green-500" />
                      ) : item.action.includes('Posadzono') ? (
                        <Plus className="h-4 w-4 text-emerald" />
                      ) : (
                        <Clock className="h-4 w-4 text-foreground-secondary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        item.type === 'task' && !item.completed
                          ? 'text-foreground-secondary'
                          : 'text-foreground'
                      }`}>
                        {item.action}
                      </p>
                      <p className="text-xs text-foreground-secondary">
                        {formatActivityDate(item.date)}
                      </p>
                      {item.type === 'task' && (
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            item.completed
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {item.completed ? 'Ukończone' : 'Oczekuje'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 text-foreground-secondary mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Brak historii
                </h3>
                <p className="text-foreground-secondary">
                  Historia akcji dla tej grządki będzie wyświetlana tutaj.
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setIsHistoryOpen(false)}>
                Zamknij
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BedDetail;