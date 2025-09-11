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
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="glass-button"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{plant.name}</h1>
          <Badge variant="secondary" className="glass text-emerald border-emerald/30">
            {plant.phase}
          </Badge>
        </div>
      </div>

      {/* Growth Progress */}
      <Card className="glass-card">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Faza wzrostu</h3>
            <span className="text-sm text-foreground-secondary">{plant.progress}%</span>
          </div>
          <Progress value={plant.progress} className="h-2" />
          <p className="text-sm text-foreground-secondary">
            Aktualnie w fazie: {plant.phase}
          </p>
        </div>
      </Card>

      {/* Next Task */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Najbliższe zadanie</h2>
        <Card className="glass-card">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-emerald/20">
              <Droplets className="h-5 w-5 text-emerald" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{plant.nextTask}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="h-4 w-4 text-foreground-secondary" />
                <span className="text-sm text-foreground-secondary">
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