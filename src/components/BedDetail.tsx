// src/components/BedDetail.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface BedDetailProps {
  bedId: string;
  onBack: () => void;
  onPlantSelect: (plantId: string) => void;
}

const BedDetail = ({ bedId, onBack, onPlantSelect }: BedDetailProps) => {
  const { state, addPlant } = useGarden();
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);
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

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
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
                        {plant.lastWatered && (
                          <Badge variant="outline" className="glass text-xs">
                            Podlano: {Math.floor((Date.now() - plant.lastWatered.getTime()) / (1000 * 60 * 60 * 24))} dni temu
                          </Badge>
                        )}
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
    </div>
  );
};

export default BedDetail;