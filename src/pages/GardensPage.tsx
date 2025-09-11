// src/pages/GardensPage.tsx
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Sprout, ArrowRight } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";

const GardensPage = () => {
  const { state } = useGarden();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Moje Ogrody</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">
            {state.gardens.length === 0 
              ? 'Utwórz swój pierwszy ogród' 
              : `${state.gardens.length} ${state.gardens.length === 1 ? 'ogród' : state.gardens.length < 5 ? 'ogrody' : 'ogrodów'}`
            }
          </p>
        </div>
        <Link to="/gardens/new">
          <Button 
            variant="outline" 
            size="icon" 
            className="glass-button emerald-glow rounded-full h-8 w-8 sm:h-10 sm:w-10"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
      </div>

      {/* Gardens List */}
      {state.gardens.length > 0 ? (
        <div className="space-y-3">
          {state.gardens.map((garden) => {
            const bedCount = garden.beds.length;
            const plantCount = garden.beds.reduce((sum, bed) => sum + bed.plants.length, 0);
            
            return (
              <Link key={garden.id} to={`/gardens/${garden.id}`}>
                <Card className="glass rounded-xl p-3 sm:p-6 glass-hover cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 rounded-lg bg-emerald/20">
                        <Sprout className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-medium text-foreground">
                          {garden.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-foreground-secondary">
                          {bedCount === 0 
                            ? 'Brak grządek' 
                            : `${bedCount} ${bedCount === 1 ? 'grządka' : bedCount < 5 ? 'grządki' : 'grządek'}, ${plantCount} ${plantCount === 1 ? 'roślina' : plantCount < 5 ? 'rośliny' : 'roślin'}`
                          }
                        </p>
                        <p className="text-xs text-foreground-secondary">
                          {garden.description || 'Brak opisu'}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-foreground-secondary flex-shrink-0" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-emerald/20 mb-4">
            <Sprout className="h-8 w-8 text-emerald" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Brak ogrodów
          </h3>
          <p className="text-foreground-secondary mb-4 max-w-sm">
            Rozpocznij swoją przygodę z ogrodnictwem tworząc pierwszy ogród.
          </p>
          <Link to="/gardens/new">
            <Button className="emerald-glow">
              <Plus className="h-4 w-4 mr-2" />
              Utwórz pierwszy ogród
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default GardensPage;

