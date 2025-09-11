import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Droplets, Sprout, ArrowRight } from "lucide-react";

interface GardenDashboardProps {
  onGardenSelect?: () => void;
}

const GardenDashboard = ({ onGardenSelect }: GardenDashboardProps) => {
  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dzień dobry! 🌱</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">Sprawdź swój ogród dziś</p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="glass-button emerald-glow rounded-full h-8 w-8 sm:h-10 sm:w-10"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      {/* Today's Stats - Single Card */}
      <Card className="glass rounded-xl p-3 sm:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 rounded-lg bg-emerald/20 emerald-glow">
            <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-emerald" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground">1 Zadanie dzisiaj</h3>
            <p className="text-xs sm:text-sm text-foreground-secondary">Do wykonania</p>
          </div>
        </div>
      </Card>

      {/* Today's Section - Single Task */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Dzisiaj</h2>
        <Card className="glass rounded-xl p-3 sm:p-6 glass-hover cursor-pointer" onClick={onGardenSelect}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 rounded-lg bg-emerald/20">
                <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-foreground">Podlej pomidory</h3>
                <p className="text-xs sm:text-sm text-foreground-secondary">Grządka wschodnią</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-foreground-secondary flex-shrink-0" />
          </div>
        </Card>
      </div>

      {/* Garden Section - Single Garden */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Ogród</h2>
        <Card className="glass rounded-xl p-3 sm:p-6 glass-hover cursor-pointer" onClick={onGardenSelect}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 rounded-lg bg-emerald/20">
                <Sprout className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-foreground">Mój pierwszy ogród</h3>
                <p className="text-xs sm:text-sm text-foreground-secondary">3 grządki</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-foreground-secondary flex-shrink-0" />
          </div>
        </Card>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-16 sm:bottom-24 right-3 sm:right-6">
        <Button 
          size="lg" 
          className="glass-button emerald-glow-strong rounded-full h-12 w-12 sm:h-14 sm:w-14 bg-emerald hover:bg-emerald-light shadow-2xl"
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>
    </div>
  );
};

export default GardenDashboard;