// src/pages/CreateBedPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { toast } from "@/hooks/use-toast";

const CreateBedPage = () => {
  const { gardenId } = useParams<{ gardenId: string }>();
  const navigate = useNavigate();
  const { addBed } = useGarden();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
  });

  const handleSubmit = () => {
    if (formData.name.trim() && gardenId) {
      addBed(gardenId, {
        name: formData.name.trim(),
        location: formData.location.trim() || 'Nie określono',
        size: formData.size.trim() || 'Nie określono',
        plants: [],
      });
      
      toast({
        title: "Grządka dodana! 🌱",
        description: `Utworzono nową grządkę: ${formData.name}`,
      });
      
      navigate(`/gardens/${gardenId}`);
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(`/gardens/${gardenId}`)}
          className="glass-button h-8 w-8 sm:h-10 sm:w-10"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Nowa Grządka</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">Dodaj grządkę do ogrodu</p>
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
              Dodaj grządkę
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/gardens/${gardenId}`)}
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

export default CreateBedPage;