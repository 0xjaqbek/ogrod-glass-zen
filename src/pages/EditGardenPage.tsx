import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { toast } from "@/hooks/use-toast";

const EditGardenPage = () => {
  const { gardenId } = useParams<{ gardenId: string }>();
  const navigate = useNavigate();
  const { state, updateGarden } = useGarden();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const garden = gardenId ? state.gardens.find(g => g.id === gardenId) : null;

  useEffect(() => {
    if (!gardenId) {
      navigate('/gardens');
      return;
    }

    if (garden) {
      setFormData({
        name: garden.name,
        description: garden.description || '',
      });
    } else {
      navigate('/gardens');
    }
  }, [garden, gardenId, navigate]);

  const handleSubmit = () => {
    if (!garden) return;
    
    if (formData.name.trim()) {
      const updatedGarden = {
        ...garden,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      };

      updateGarden(updatedGarden);
      
      toast({
        title: "Ogród zaktualizowany! 🌱",
        description: `Ogród "${formData.name}" został zaktualizowany`,
      });
      
      navigate(`/gardens/${gardenId}`);
    }
  };

  const handleCancel = () => {
    navigate(`/gardens/${gardenId}`);
  };

  if (!garden) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-foreground-secondary">Ogród nie znaleziony</p>
          <Button className="mt-4" onClick={() => navigate('/gardens')}>
            Powrót do ogrodów
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
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
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Edytuj Ogród</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">
            Zaktualizuj informacje o swoim ogrodzie
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="glass rounded-xl p-3 sm:p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="garden-name">Nazwa ogrodu *</Label>
            <Input
              id="garden-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="np. Mój ogród warzywny"
              className="glass"
            />
          </div>
          
          <div>
            <Label htmlFor="garden-description">Opis (opcjonalnie)</Label>
            <Textarea
              id="garden-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Opisz swój ogród..."
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

export default EditGardenPage;