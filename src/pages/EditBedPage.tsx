import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { toast } from "@/hooks/use-toast";

const EditBedPage = () => {
  const { gardenId, bedId } = useParams<{ gardenId: string; bedId: string }>();
  const navigate = useNavigate();
  const { state, updateBed } = useGarden();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
  });

  const garden = gardenId ? state.gardens.find(g => g.id === gardenId) : null;
  const bed = garden && bedId ? garden.beds.find(b => b.id === bedId) : null;

  useEffect(() => {
    if (!gardenId || !bedId) {
      navigate('/gardens');
      return;
    }

    if (bed) {
      setFormData({
        name: bed.name,
        location: bed.location || '',
        size: bed.size || '',
      });
    } else {
      navigate(`/gardens/${gardenId}`);
    }
  }, [bed, gardenId, bedId, navigate]);

  const handleSubmit = () => {
    if (!bed || !gardenId) return;
    
    if (formData.name.trim()) {
      const updatedBed = {
        ...bed,
        name: formData.name.trim(),
        location: formData.location.trim() || undefined,
        size: formData.size.trim() || undefined,
      };

      updateBed(gardenId, updatedBed);
      
      toast({
        title: "Grządka zaktualizowana! 🌱",
        description: `Grządka "${formData.name}" została zaktualizowana`,
      });
      
      navigate(`/gardens/${gardenId}/beds/${bedId}`);
    }
  };

  const handleCancel = () => {
    navigate(`/gardens/${gardenId}/beds/${bedId}`);
  };

  if (!bed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-foreground-secondary">Grządka nie znaleziona</p>
          <Button className="mt-4" onClick={() => navigate(`/gardens/${gardenId}`)}>
            Powrót do ogrodu
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
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Edytuj Grządkę</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">
            Zaktualizuj informacje o grządce
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="glass rounded-xl p-3 sm:p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="bed-name">Nazwa grządki *</Label>
            <Input
              id="bed-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="np. Grządka wschodnia"
              className="glass"
            />
          </div>
          
          <div>
            <Label htmlFor="bed-location">Lokalizacja</Label>
            <Input
              id="bed-location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="np. Słoneczne miejsce"
              className="glass"
            />
          </div>
          
          <div>
            <Label htmlFor="bed-size">Rozmiar</Label>
            <Input
              id="bed-size"
              value={formData.size}
              onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
              placeholder="np. 2x3m"
              className="glass"
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

export default EditBedPage;