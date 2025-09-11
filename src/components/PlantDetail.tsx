import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Droplets, Calendar } from "lucide-react";

interface PlantDetailProps {
  plantId: string;
  onBack: () => void;
}

const PlantDetail = ({ plantId, onBack }: PlantDetailProps) => {
  const plants = {
    "1": { 
      name: "🍅 Pomidor", 
      phase: "Wschody", 
      progress: 25,
      nextTask: "Podlej roślinę",
      daysUntilTask: 1
    },
    "2": { 
      name: "🥒 Ogórek", 
      phase: "Kwitnienie", 
      progress: 65,
      nextTask: "Podwiąż pędy",
      daysUntilTask: 3
    },
    "3": { 
      name: "🌶️ Papryka", 
      phase: "Sadzonki", 
      progress: 15,
      nextTask: "Przesadź do gruntu",
      daysUntilTask: 5
    },
    "4": { 
      name: "🥬 Sałata", 
      phase: "Dojrzewanie", 
      progress: 85,
      nextTask: "Zbierz liście",
      daysUntilTask: 2
    },
  };

  const plant = plants[plantId as keyof typeof plants] || plants["1"];

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
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">{plant.name}</h1>
          <Badge variant="secondary" className="glass text-emerald border-emerald/30 text-xs sm:text-sm">
            {plant.phase}
          </Badge>
        </div>
      </div>

      {/* Growth Progress */}
      <Card className="glass rounded-xl p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm sm:text-base font-semibold text-foreground">Faza wzrostu</h3>
            <span className="text-xs sm:text-sm text-foreground-secondary">{plant.progress}%</span>
          </div>
          <Progress value={plant.progress} className="h-2" />
          <p className="text-xs sm:text-sm text-foreground-secondary">
            Aktualnie w fazie: {plant.phase}
          </p>
        </div>
      </Card>

      {/* Next Task */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Najbliższe zadanie</h2>
        <Card className="glass rounded-xl p-3 sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 rounded-lg bg-emerald/20 flex-shrink-0">
              <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-medium text-foreground">{plant.nextTask}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-foreground-secondary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-foreground-secondary">
                  Za {plant.daysUntilTask} {plant.daysUntilTask === 1 ? 'dzień' : 'dni'}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlantDetail;