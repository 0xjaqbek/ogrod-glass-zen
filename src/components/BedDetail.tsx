import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface BedDetailProps {
  bedId: string;
  onBack: () => void;
  onPlantSelect: (plantId: string) => void;
}

const BedDetail = ({ bedId, onBack, onPlantSelect }: BedDetailProps) => {
  const bedNames = {
    "1": "Grządka wschodnia",
    "2": "Grządka zachodnia", 
    "3": "Grządka centralna"
  };

  const plants = [
    { id: "1", name: "🍅 Pomidor", phase: "Wschody" },
    { id: "2", name: "🥒 Ogórek", phase: "Kwitnienie" },
    { id: "3", name: "🌶️ Papryka", phase: "Sadzonki" },
    { id: "4", name: "🥬 Sałata", phase: "Dojrzewanie" },
  ];

  const bedPlants = plants.slice(0, bedId === "1" ? 4 : bedId === "2" ? 3 : 2);

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
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">
            {bedNames[bedId as keyof typeof bedNames]}
          </h1>
          <p className="text-sm sm:text-base text-foreground-secondary">{bedPlants.length} roślin w grządce</p>
        </div>
      </div>

      {/* Plants List */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Rośliny</h2>
        <div className="space-y-3">
          {bedPlants.map((plant) => (
            <Card 
              key={plant.id} 
              className="glass rounded-xl p-3 sm:p-6 glass-hover cursor-pointer"
              onClick={() => onPlantSelect(plant.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="text-2xl sm:text-3xl flex-shrink-0">{plant.name.split(' ')[0]}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-medium text-foreground">{plant.name}</h3>
                    <Badge variant="secondary" className="glass text-emerald border-emerald/30 text-xs">
                      {plant.phase}
                    </Badge>
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

export default BedDetail;