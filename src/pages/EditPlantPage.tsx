import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { toast } from "@/hooks/use-toast";

const EditPlantPage = () => {
  const { gardenId, bedId, plantId } = useParams<{ gardenId: string; bedId: string; plantId: string }>();
  const navigate = useNavigate();
  const { state, updatePlant } = useGarden();
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🌱',
    phase: 'planted' as 'planted' | 'growing' | 'flowering' | 'fruiting' | 'mature',
    progress: 0,
    variety: '',
    notes: '',
  });

  const garden = gardenId ? state.gardens.find(g => g.id === gardenId) : null;
  const bed = garden && bedId ? garden.beds.find(b => b.id === bedId) : null;
  const plant = bed && plantId ? bed.plants.find(p => p.id === plantId) : null;

  const phases = [
    { value: 'planted', label: 'Posadzone' },
    { value: 'growing', label: 'Wzrost' },
    { value: 'flowering', label: 'Kwitnienie' },
    { value: 'fruiting', label: 'Owocowanie' },
    { value: 'mature', label: 'Dojrzałe' }
  ] as const;

  useEffect(() => {
    if (!gardenId || !bedId || !plantId) {
      navigate('/gardens');
      return;
    }

    if (plant) {
      setFormData({
        name: plant.name,
        emoji: plant.emoji,
        phase: plant.phase,
        progress: plant.progress,
        variety: plant.variety || '',
        notes: plant.notes || '',
      });
    } else {
      navigate(`/gardens/${gardenId}/beds/${bedId}`);
    }
  }, [plant, gardenId, bedId, plantId, navigate]);

  const handleSubmit = () => {
    if (!plant || !gardenId || !bedId) return;
    
    if (formData.name.trim()) {
      const updatedPlant = {
        ...plant,
        name: formData.name.trim(),
        emoji: formData.emoji,
        phase: formData.phase,
        progress: formData.progress,
        variety: formData.variety.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      };

      updatePlant(gardenId, bedId, updatedPlant);
      
      toast({
        title: "Roślina zaktualizowana! 🌱",
        description: `${formData.emoji} ${formData.name} została zaktualizowana`,
      });
      
      navigate(`/gardens/${gardenId}/beds/${bedId}/plants/${plantId}`);
    }
  };

  const handleCancel = () => {
    navigate(`/gardens/${gardenId}/beds/${bedId}/plants/${plantId}`);
  };

  if (!plant) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-foreground-secondary">Roślina nie znaleziona</p>
          <Button className="mt-4" onClick={() => navigate(`/gardens/${gardenId}/beds/${bedId}`)}>
            Powrót do grządki
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className=" p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleCancel}
          className="glass-button h-8 w-8 sm:h-10 sm:w-10"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Edytuj Roślinę</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">
            Zaktualizuj informacje o roślinie
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="glass rounded-xl p-3 sm:p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plant-name">Nazwa rośliny *</Label>
              <Input
                id="plant-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="np. Pomidor Cherry"
                className="glass"
              />
            </div>
            <div>
              <Label htmlFor="plant-emoji">Emoji</Label>
              <Input
                id="plant-emoji"
                value={formData.emoji}
                onChange={(e) => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
                placeholder="🍅"
                className="glass"
                maxLength={2}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="plant-variety">Odmiana (opcjonalnie)</Label>
            <Input
              id="plant-variety"
              value={formData.variety}
              onChange={(e) => setFormData(prev => ({ ...prev, variety: e.target.value }))}
              placeholder="np. Cherry, Malinowy Ożarowski"
              className="glass"
            />
          </div>

          <div>
            <Label htmlFor="plant-phase">Faza wzrostu</Label>
            <Select 
              value={formData.phase}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, phase: value }))}
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
            <Label htmlFor="plant-progress">Postęp (%)</Label>
            <div className="space-y-2">
              <Input
                id="plant-progress"
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                className="glass"
              />
              <div className="flex justify-between text-xs text-foreground-secondary">
                <span>0%</span>
                <span className="font-medium">{formData.progress}%</span>
                <span>100%</span>
              </div>
            </div>
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

          {/* Plant Info */}
          <Card className="bg-emerald/10 border-emerald/20 p-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{formData.emoji}</div>
              <div>
                <p className="font-medium text-foreground">{formData.name}</p>
                {formData.variety && (
                  <p className="text-sm text-foreground-secondary">Odmiana: {formData.variety}</p>
                )}
                <p className="text-sm text-foreground-secondary">
                  Faza: {phases.find(p => p.value === formData.phase)?.label}
                </p>
                <p className="text-sm text-foreground-secondary">
                  Postęp: {formData.progress}%
                </p>
              </div>
            </div>
          </Card>

          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={!formData.name.trim()}
            >
              Zapisz zmiany
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleCancel}
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

export default EditPlantPage;