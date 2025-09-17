// src/components/GardenDetail.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Grid3X3, Plus } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { TooltipPlus } from "@/components/ui/tooltip-plus";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface GardenDetailProps {
  onBack: () => void;
  onBedSelect: (bedId: string) => void;
}

const GardenDetail = ({ onBack, onBedSelect }: GardenDetailProps) => {
  const { state, addBed } = useGarden();
  const [isAddBedOpen, setIsAddBedOpen] = useState(false);
  const [newBedData, setNewBedData] = useState({
    name: '',
    location: '',
    size: '',
  });

  const selectedGarden = state.selectedGarden;

  if (!selectedGarden) {
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
            <h1 className="text-lg sm:text-2xl font-bold text-foreground">Nie wybrano ogrodu</h1>
            <p className="text-sm sm:text-base text-foreground-secondary">Wróć i wybierz ogród</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddBed = () => {
    if (newBedData.name.trim()) {
      addBed(selectedGarden.id, {
        name: newBedData.name.trim(),
        location: newBedData.location.trim() || 'Nie określono',
        size: newBedData.size.trim() || 'Nie określono',
        plants: [],
      });
      
      setNewBedData({ name: '', location: '', size: '' });
      setIsAddBedOpen(false);
      
      toast({
        title: "Grządka dodana! 🌱",
        description: `Utworzono nową grządkę: ${newBedData.name}`,
      });
    }
  };

  const handleBedSelect = (bedId: string) => {
    onBedSelect(bedId);
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
              {selectedGarden.name}
            </h1>
            <p className="text-sm sm:text-base text-foreground-secondary">
              {selectedGarden.beds.length === 0 
                ? 'Brak grządek' 
                : `${selectedGarden.beds.length} ${selectedGarden.beds.length === 1 ? 'grządka' : selectedGarden.beds.length < 5 ? 'grządki' : 'grządek'} do zarządzania`
              }
            </p>
          </div>
        </div>
        
        <Dialog open={isAddBedOpen} onOpenChange={setIsAddBedOpen}>
          <DialogTrigger asChild>
            <TooltipPlus text="Dodaj nową grządkę" showOnMobile>
              <Button
                variant="outline"
                size="icon"
                className="glass-button emerald-glow rounded-full h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </TooltipPlus>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>Dodaj nową grządkę</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bed-name">Nazwa grządki *</Label>
                <Input
                  id="bed-name"
                  value={newBedData.name}
                  onChange={(e) => setNewBedData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="np. Grządka wschodnia"
                  className="glass"
                />
              </div>
              <div>
                <Label htmlFor="bed-location">Lokalizacja</Label>
                <Input
                  id="bed-location"
                  value={newBedData.location}
                  onChange={(e) => setNewBedData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="np. Słoneczne miejsce"
                  className="glass"
                />
              </div>
              <div>
                <Label htmlFor="bed-size">Rozmiar</Label>
                <Input
                  id="bed-size"
                  value={newBedData.size}
                  onChange={(e) => setNewBedData(prev => ({ ...prev, size: e.target.value }))}
                  placeholder="np. 2x3m"
                  className="glass"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleAddBed} 
                  className="flex-1"
                  disabled={!newBedData.name.trim()}
                >
                  Dodaj grządkę
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsAddBedOpen(false)}
                  className="flex-1"
                >
                  Anuluj
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Beds List */}
      {selectedGarden.beds.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Grządki</h2>
          <div className="space-y-3">
            {selectedGarden.beds.map((bed) => {
              const plantCount = bed.plants.length;
              
              return (
                <Card 
                  key={bed.id} 
                  className="glass rounded-xl p-3 sm:p-6 glass-hover cursor-pointer"
                  onClick={() => handleBedSelect(bed.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 rounded-lg bg-emerald/20 flex-shrink-0">
                        <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-medium text-foreground">
                          {bed.name}
                        </h3>
                        <div className="text-xs sm:text-sm text-foreground-secondary space-y-1">
                          <p>
                            {plantCount === 0 
                              ? 'Brak roślin' 
                              : `${plantCount} ${plantCount === 1 ? 'roślina' : plantCount < 5 ? 'rośliny' : 'roślin'}`
                            }
                          </p>
                          {bed.location !== 'Nie określono' && (
                            <p>📍 {bed.location}</p>
                          )}
                          {bed.size !== 'Nie określono' && (
                            <p>📏 {bed.size}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-foreground-secondary flex-shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-emerald/20 mb-4">
            <Grid3X3 className="h-8 w-8 text-emerald" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Brak grządek w ogrodzie
          </h3>
          <p className="text-foreground-secondary mb-4 max-w-sm">
            Rozpocznij organizację swojego ogrodu dodając pierwszą grządkę.
          </p>
          <Button 
            onClick={() => setIsAddBedOpen(true)}
            className="emerald-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Dodaj pierwszą grządkę
          </Button>
        </div>
      )}

      {/* Garden Info Card */}
      <Card className="glass rounded-xl p-3 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-3">
          Informacje o ogrodzie
        </h3>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-foreground-secondary">Utworzony:</span>
            <span className="text-foreground">
              {selectedGarden.createdDate.toLocaleDateString('pl-PL')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-secondary">Grządki:</span>
            <span className="text-foreground">{selectedGarden.beds.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-secondary">Rośliny:</span>
            <span className="text-foreground">
              {selectedGarden.beds.reduce((sum, bed) => sum + bed.plants.length, 0)}
            </span>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      {selectedGarden.beds.length > 0 && (
        <Card className="glass rounded-xl p-3 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-3">
            Szybkie akcje
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="glass-button text-xs sm:text-sm"
              onClick={() => setIsAddBedOpen(true)}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Dodaj grządkę
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="glass-button text-xs sm:text-sm"
              disabled
            >
              <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Planowanie
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GardenDetail;