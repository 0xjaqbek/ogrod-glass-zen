// src/pages/CreateGardenPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { toast } from "@/hooks/use-toast";

const CreateGardenPage = () => {
  const navigate = useNavigate();
  const { addGarden } = useGarden();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = () => {
    if (formData.name.trim()) {
      addGarden({
        name: formData.name.trim(),
        beds: [],
      });
      
      toast({
        title: "Ogród utworzony! 🌱",
        description: `Dodano nowy ogród: ${formData.name}`,
      });
      
      navigate('/gardens');
    }
  };

  return (
    <div >
      {/* Header */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/gardens')}
          className="glass-button h-8 w-8 sm:h-10 sm:w-10"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Nowy Ogród</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">Utwórz swój ogród</p>
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
              Utwórz ogród
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/gardens')}
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

export default CreateGardenPage;


// src/pages/EditGardenPage.tsx
// src/pages/EditBedPage.tsx  
// src/pages/EditPlantPage.tsx
// (These would be similar to create pages but with pre-filled data and update actions)

const EditGardenPage = () => {
  return <div>Edit Garden Page - To be implemented</div>;
};

const EditBedPage = () => {
  return <div>Edit Bed Page - To be implemented</div>;
};

const EditPlantPage = () => {
  return <div>Edit Plant Page - To be implemented</div>;
};

export { EditGardenPage, EditBedPage, EditPlantPage };