


// src/pages/CreatePlantPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { toast } from "@/hooks/use-toast";
import { PLANT_TYPES } from "@/constants/gardenConstants";

const CreatePlantPage = () => {
  const { gardenId, bedId } = useParams<{ gardenId: string; bedId: string }>();
  const navigate = useNavigate();
  const { addPlant } = useGarden();
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🌱',
    phase: 'Sadzonki',
    progress: 10,
    nextTask: 'Podlej roślinę',
    daysUntilTask: 1,
    notes: '',
  });

  const phases = ['Nasiona', 'Sadzonki', 'Wschody', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Dojrzewanie', 'Zbiory'];

  const handlePlantSelect = (plantName: string) => {
    const plant = PLANT_TYPES.find(p => p.name === plantName);
    if (plant) {
      setFormData(prev => ({
        ...prev,
        name: plant.name,
        emoji: plant.emoji,
        nextTask: plant.tasks[0] || 'Podlej roślinę',
      }));
    }
  };

  const handleSubmit = () => {
    if (formData.name.trim() && gardenId && bedId) {
      addPlant(gardenId, bedId, {
        name: formData.name.trim(),
        emoji: formData.emoji,
        phase: formData.phase,
        progress: formData.progress,
        nextTask: formData.nextTask,
        daysUntilTask: formData.daysUntilTask,
        notes: formData.notes.trim(),
      });
      
      toast({
        title: "Roślina dodana! 🌱",
        description: `Posadzono: ${formData.emoji} ${formData.name}`,
      });
      
      navigate(`/gardens/${gardenId}/beds/${bedId}`);
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(`/gardens/${gardenId}/beds/${bedId}`)}
          className="glass-button h-8 w-8 sm:h-10 sm:w-10"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Nowa Roślina</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">Dodaj roślinę do grządki</p>
        </div>
      </div>

      {/* Form */}
      <Card className="glass rounded-xl p-3 sm:p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="plant-select">Wybierz roślinę</Label>
            <Select onValueChange={handlePlantSelect}>
              <SelectTrigger className="glass">
                <SelectValue placeholder="Wybierz typ rośliny" />
              </SelectTrigger>
              <SelectContent className="glass">
                {PLANT_TYPES.map((plant) => (
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
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="np. Pomidor"
                className="glass"
              />
            </div>
            <div>
              <Label htmlFor="plant-emoji">Emoji</Label>
              <Input
                id="plant-emoji"
                value={formData.emoji}
                onChange={(e) => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
                placeholder="🌱"
                className="glass"
                maxLength={2}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="plant-phase">Faza wzrostu</Label>
            <Select 
              value={formData.phase}
              onValueChange={(value) => setFormData(prev => ({ ...prev, phase: value }))}
            >
              <SelectTrigger className="glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass">
                {phases.map((phase) => (
                  <SelectItem key={phase} value={phase}>
                    {phase}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="plant-notes">Notatki</Label>
            <Textarea
              id="plant-notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Dodatkowe informacje o roślinie..."
              className="glass"
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={!formData.name.trim()}
            >
              Dodaj roślinę
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/gardens/${gardenId}/beds/${bedId}`)}
              className="flex-1"
            >
              Anuluj
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreatePlantPage;