import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Grid3X3 } from "lucide-react";

interface GardenDetailProps {
  onBack: () => void;
  onBedSelect: (bedId: string) => void;
}

const GardenDetail = ({ onBack, onBedSelect }: GardenDetailProps) => {
  const beds = [
    { id: "1", name: "Grządka wschodnia", plants: 4 },
    { id: "2", name: "Grządka zachodnia", plants: 3 },
    { id: "3", name: "Grządka centralna", plants: 2 },
  ];

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
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
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Mój pierwszy ogród</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">3 grządki do zarządzania</p>
        </div>
      </div>

      {/* Beds List */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Grządki</h2>
        <div className="space-y-3">
          {beds.map((bed) => (
            <Card 
              key={bed.id} 
              className="glass rounded-xl p-3 sm:p-6 glass-hover cursor-pointer"
              onClick={() => onBedSelect(bed.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 rounded-lg bg-emerald/20">
                    <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-medium text-foreground">{bed.name}</h3>
                    <p className="text-xs sm:text-sm text-foreground-secondary">{bed.plants} roślin</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-foreground-secondary flex-shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GardenDetail;