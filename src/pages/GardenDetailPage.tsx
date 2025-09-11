import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit, Trash2, Sprout, Droplets, Calendar } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { toast } from "@/hooks/use-toast";

const GardenDetailPage = () => {
  const { gardenId } = useParams<{ gardenId: string }>();
  const { state, dispatch, deleteGarden, getTodaysTasks, getTasksForGarden } = useGarden();
  const navigate = useNavigate();

  const garden = gardenId ? state.gardens.find(g => g.id === gardenId) : null;
  const todaysTasks = garden ? getTodaysTasks().filter(task => task.gardenId === gardenId) : [];
  const allGardenTasks = garden ? getTasksForGarden(gardenId).filter(task => !task.completed) : [];

  useEffect(() => {
    if (gardenId && garden) {
      dispatch({ type: 'SELECT_GARDEN', payload: garden });
    } else if (gardenId && !garden) {
      navigate('/gardens');
    }
  }, [gardenId, garden, dispatch, navigate]);

  const handleDeleteGarden = () => {
    if (garden && window.confirm(`Czy na pewno chcesz usunąć ogród "${garden.name}"?`)) {
      deleteGarden(garden.id);
      toast({
        title: "Ogród usunięty",
        description: `Ogród "${garden.name}" został usunięty`,
      });
      navigate('/gardens');
    }
  };

  const handleBedSelect = (bedId: string) => {
    navigate(`/gardens/${gardenId}/beds/${bedId}`);
  };

  if (!gardenId) {
    navigate('/gardens');
    return null;
  }

  if (!garden) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-foreground-secondary">Ogród nie znaleziony</p>
          <Link to="/gardens">
            <Button className="mt-4">Powrót do ogrodów</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalBeds = garden.beds.length;
  const totalPlants = garden.beds.reduce((sum, bed) => sum + bed.plants.length, 0);

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
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
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">{garden.name}</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">
            {totalBeds === 0 
              ? 'Brak grządek' 
              : `${totalBeds} ${totalBeds === 1 ? 'grządka' : totalBeds < 5 ? 'grządki' : 'grządek'}, ${totalPlants} ${totalPlants === 1 ? 'roślina' : totalPlants < 5 ? 'rośliny' : 'roślin'}`
            }
          </p>
        </div>
        <div className="flex space-x-2">
          <Link to={`/gardens/${gardenId}/edit`}>
            <Button variant="outline" size="icon" className="glass-button h-8 w-8 sm:h-10 sm:w-10">
              <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleDeleteGarden}
            className="glass-button h-8 w-8 sm:h-10 sm:w-10 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Garden Description */}
      {garden.description && (
        <Card className="glass rounded-xl p-3 sm:p-6">
          <p className="text-sm sm:text-base text-foreground-secondary">{garden.description}</p>
        </Card>
      )}

      {/* Today's Tasks for this Garden */}
      {todaysTasks.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Dzisiejsze zadania</h2>
          <div className="space-y-3">
            {todaysTasks.slice(0, 3).map((task) => (
              <Card key={task.id} className="glass rounded-xl p-3 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 rounded-lg bg-emerald/20">
                    {task.type === 'watering' ? (
                      <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
                    ) : (
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-medium text-foreground">{task.title}</h3>
                    <p className="text-xs sm:text-sm text-foreground-secondary">{task.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {todaysTasks.length > 3 && (
            <p className="text-xs text-foreground-secondary text-center">
              ...i {todaysTasks.length - 3} więcej zadań
            </p>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card className="glass rounded-xl p-3 sm:p-6">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-emerald">{totalBeds}</p>
            <p className="text-xs sm:text-sm text-foreground-secondary">
              {totalBeds === 1 ? 'Grządka' : totalBeds < 5 ? 'Grządki' : 'Grządek'}
            </p>
          </div>
        </Card>
        <Card className="glass rounded-xl p-3 sm:p-6">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-emerald">{totalPlants}</p>
            <p className="text-xs sm:text-sm text-foreground-secondary">
              {totalPlants === 1 ? 'Roślina' : totalPlants < 5 ? 'Rośliny' : 'Roślin'}
            </p>
          </div>
        </Card>
      </div>

      {/* Beds List */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Grządki {totalBeds > 0 && `(${totalBeds})`}
          </h2>
          <Link to={`/gardens/${gardenId}/beds/new`}>
            <Button 
              variant="outline" 
              size="sm"
              className="glass-button emerald-glow h-8 px-3 sm:h-10 sm:px-4"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Dodaj grządkę
            </Button>
          </Link>
        </div>

        {totalBeds > 0 ? (
          <div className="space-y-3">
            {garden.beds.map((bed) => {
              const plantsInBed = bed.plants.length;
              
              return (
                <Card 
                  key={bed.id} 
                  className="glass rounded-xl p-3 sm:p-6 glass-hover cursor-pointer"
                  onClick={() => handleBedSelect(bed.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 rounded-lg bg-emerald/20">
                        <Sprout className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-medium text-foreground">
                          {bed.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-foreground-secondary">
                          {plantsInBed === 0 
                            ? 'Brak roślin' 
                            : `${plantsInBed} ${plantsInBed === 1 ? 'roślina' : plantsInBed < 5 ? 'rośliny' : 'roślin'}`
                          }
                        </p>
                        {bed.size && (
                          <p className="text-xs text-foreground-secondary">Rozmiar: {bed.size}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Show plant emojis preview */}
                      <div className="flex -space-x-1">
                        {bed.plants.slice(0, 3).map((plant) => (
                          <div 
                            key={plant.id}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/80 flex items-center justify-center text-xs sm:text-sm border-2 border-white"
                            title={plant.name}
                          >
                            {plant.emoji}
                          </div>
                        ))}
                        {bed.plants.length > 3 && (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald/20 flex items-center justify-center text-xs font-medium border-2 border-white">
                            +{bed.plants.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <Card className="glass rounded-xl p-6 sm:p-12">
            <div className="text-center">
              <div className="p-4 rounded-full bg-emerald/20 mx-auto mb-4 w-fit">
                <Sprout className="h-6 w-6 sm:h-8 sm:w-8 text-emerald" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                Brak grządek
              </h3>
              <p className="text-sm sm:text-base text-foreground-secondary mb-4">
                Dodaj pierwszą grządkę do swojego ogrodu, aby rozpocząć uprawę roślin.
              </p>
              <Link to={`/gardens/${gardenId}/beds/new`}>
                <Button className="emerald-glow">
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj pierwszą grządkę
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Active Tasks */}
      {allGardenTasks.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Aktywne zadania ({allGardenTasks.length})
          </h2>
          <div className="space-y-2">
            {allGardenTasks.slice(0, 5).map((task) => (
              <Card key={task.id} className="glass rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-foreground-secondary">
                      Termin: {new Date(task.dueDate).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority === 'high' ? 'Wysoki' :
                     task.priority === 'medium' ? 'Średni' : 'Niski'}
                  </div>
                </div>
              </Card>
            ))}
            {allGardenTasks.length > 5 && (
              <Link to="/tasks" className="block">
                <Button variant="ghost" className="w-full text-sm">
                  Zobacz wszystkie zadania ({allGardenTasks.length - 5} więcej)
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GardenDetailPage;