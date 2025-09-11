import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Droplets, Sprout, ArrowRight } from "lucide-react";

interface GardenDashboardProps {
  onGardenSelect?: () => void;
}

const GardenDashboard = ({ onGardenSelect }: GardenDashboardProps) => {
  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dzień dobry! 🌱</h1>
          <p className="text-foreground-secondary">Sprawdź swój ogród dziś</p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="glass-button emerald-glow rounded-full"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Today's Stats - Single Card */}
      <Card className="glass-card">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-emerald/20 emerald-glow">
            <Droplets className="h-6 w-6 text-emerald" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">1 Zadanie dzisiaj</h3>
            <p className="text-sm text-foreground-secondary">Do wykonania</p>
          </div>
        </div>
      </Card>

      {/* Today's Section - Single Task */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Dzisiaj</h2>
        <Card className="glass-card glass-hover cursor-pointer" onClick={onGardenSelect}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-emerald/20">
                <Droplets className="h-5 w-5 text-emerald" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Podlej pomidory</h3>
                <p className="text-sm text-foreground-secondary">Grządka wschodnią</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-foreground-secondary" />
          </div>
        </Card>
      </div>

      {/* Garden Section - Single Garden */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Ogród</h2>
        <Card className="glass-card glass-hover cursor-pointer" onClick={onGardenSelect}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-emerald/20">
                <Sprout className="h-5 w-5 text-emerald" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Mój pierwszy ogród</h3>
                <p className="text-sm text-foreground-secondary">3 grządki</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-foreground-secondary" />
          </div>
        </Card>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6">
        <Button 
          size="lg" 
          className="glass-button emerald-glow-strong rounded-full h-14 w-14 bg-emerald hover:bg-emerald-light shadow-2xl"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default GardenDashboard;