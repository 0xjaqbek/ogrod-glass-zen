// src/components/HistoryScreen.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, Droplets, Sprout, Grid3X3, Search, Filter, Calendar, Trash2 } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";

const HistoryScreen = () => {
  const { state, dispatch } = useGarden();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  // Filter and search activities
  const filteredActivities = useMemo(() => {
    let filtered = [...state.activities];

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(activity =>
        activity.action.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => {
        const action = activity.action.toLowerCase();
        switch (filterType) {
          case 'watering':
            return action.includes('podlano') || action.includes('podlej');
          case 'planting':
            return action.includes('posadzono') || action.includes('sadzenie');
          case 'harvesting':
            return action.includes('zebrano') || action.includes('zbiory');
          case 'garden':
            return action.includes('ogród') || action.includes('utworzono');
          case 'bed':
            return action.includes('grządka') || action.includes('grządkę');
          case 'task':
            return action.includes('zadanie') || action.includes('wykonano');
          default:
            return true;
        }
      });
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        default:
          cutoffDate.setFullYear(1970); // Show all
      }
      
      filtered = filtered.filter(activity => activity.date >= cutoffDate);
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [state.activities, searchTerm, filterType, dateRange]);

  const getActivityIcon = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('podlano') || actionLower.includes('podlej')) {
      return <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
    }
    if (actionLower.includes('posadzono') || actionLower.includes('sadzenie')) {
      return <Sprout className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
    }
    if (actionLower.includes('grządka') || actionLower.includes('grządkę')) {
      return <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />;
    }
    if (actionLower.includes('zadanie') || actionLower.includes('wykonano')) {
      return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />;
    }
    return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />;
  };

  const getActivityCategory = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('podlano')) return 'Podlewanie';
    if (actionLower.includes('posadzono')) return 'Sadzenie';
    if (actionLower.includes('zebrano')) return 'Zbiory';
    if (actionLower.includes('grządka')) return 'Grządka';
    if (actionLower.includes('ogród')) return 'Ogród';
    if (actionLower.includes('zadanie')) return 'Zadanie';
    return 'Inne';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Przed chwilą';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min temu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h temu`;
    
    const diffInDays = Math.floor(diffInSeconds / 86400);
    if (diffInDays === 1) return 'Wczoraj';
    if (diffInDays < 7) return `${diffInDays} dni temu`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tyg. temu`;
    
    return date.toLocaleDateString('pl-PL');
  };

  const formatDateGroup = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const activityDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (activityDate.getTime() === today.getTime()) return 'Dzisiaj';
    if (activityDate.getTime() === yesterday.getTime()) return 'Wczoraj';
    return date.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const clearOldActivities = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const oldActivities = state.activities.filter(activity => activity.date < oneMonthAgo);
    
    if (oldActivities.length > 0) {
      // Remove old activities
      const newActivities = state.activities.filter(activity => activity.date >= oneMonthAgo);
      dispatch({ 
        type: 'SET_INITIAL_DATA', 
        payload: { ...state, activities: newActivities }
      });
      
      toast({
        title: "Historia wyczyszczona ✨",
        description: `Usunięto ${oldActivities.length} starych aktywności`,
      });
    } else {
      toast({
        title: "Brak starych aktywności",
        description: "Nie ma aktywności starszych niż miesiąc",
      });
    }
  };

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups: { [key: string]: typeof filteredActivities } = {};
    
    filteredActivities.forEach(activity => {
      const dateKey = formatDateGroup(activity.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
    });
    
    return groups;
  }, [filteredActivities]);

  const getActivityStats = () => {
    const total = state.activities.length;
    const today = state.activities.filter(a => {
      const activityDate = new Date(a.date.getFullYear(), a.date.getMonth(), a.date.getDate());
      const today = new Date();
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return activityDate.getTime() === todayDate.getTime();
    }).length;
    
    const thisWeek = state.activities.filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return a.date >= weekAgo;
    }).length;

    return { total, today, thisWeek };
  };

  const stats = getActivityStats();

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-foreground">Historia</h1>
        <p className="text-sm sm:text-base text-foreground-secondary">
          {stats.total === 0 
            ? 'Brak aktywności w ogrodzie' 
            : `${stats.total} aktywności w ogrodzie`
          }
        </p>
      </div>

      {/* Stats Cards */}
      {stats.total > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card className="glass rounded-lg p-2 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-emerald">{stats.today}</div>
            <div className="text-xs sm:text-sm text-foreground-secondary">Dzisiaj</div>
          </Card>
          <Card className="glass rounded-lg p-2 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-emerald">{stats.thisWeek}</div>
            <div className="text-xs sm:text-sm text-foreground-secondary">Ten tydzień</div>
          </Card>
          <Card className="glass rounded-lg p-2 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-emerald">{stats.total}</div>
            <div className="text-xs sm:text-sm text-foreground-secondary">Łącznie</div>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      {state.activities.length > 0 && (
        <Card className="glass rounded-xl p-3 sm:p-4">
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-secondary" />
              <Input
                placeholder="Szukaj aktywności..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-2 gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Typ aktywności" />
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="watering">💧 Podlewanie</SelectItem>
                  <SelectItem value="planting">🌱 Sadzenie</SelectItem>
                  <SelectItem value="harvesting">🥕 Zbiory</SelectItem>
                  <SelectItem value="garden">🏡 Ogród</SelectItem>
                  <SelectItem value="bed">🌿 Grządki</SelectItem>
                  <SelectItem value="task">✅ Zadania</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Okres" />
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem value="all">Wszystko</SelectItem>
                  <SelectItem value="today">Dzisiaj</SelectItem>
                  <SelectItem value="week">Ostatni tydzień</SelectItem>
                  <SelectItem value="month">Ostatni miesiąc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear button */}
            {state.activities.length > 10 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearOldActivities}
                className="glass-button w-full"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Wyczyść stare aktywności (starsze niż miesiąc)
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Activities List */}
      {Object.keys(groupedActivities).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedActivities).map(([dateGroup, activities]) => (
            <div key={dateGroup} className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground-secondary px-2">
                {dateGroup}
              </h3>
              <div className="space-y-2">
                {activities.map((activity) => (
                  <Card key={activity.id} className="glass rounded-xl p-3 sm:p-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 rounded-lg bg-emerald/20 flex-shrink-0">
                        {getActivityIcon(activity.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-medium text-foreground">
                          {activity.action}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-foreground-secondary flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-foreground-secondary">
                            {formatTimeAgo(activity.date)}
                          </span>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="glass text-emerald border-emerald/30 text-xs flex-shrink-0"
                      >
                        {getActivityCategory(activity.action)}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : state.activities.length > 0 ? (
        /* No results from search/filter */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-foreground-secondary/20 mb-4">
            <Search className="h-8 w-8 text-foreground-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Brak wyników
          </h3>
          <p className="text-foreground-secondary mb-4 max-w-sm">
            Nie znaleziono aktywności pasujących do Twoich kryteriów wyszukiwania.
          </p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setDateRange('all');
            }}
            variant="ghost"
            className="glass-button"
          >
            Wyczyść filtry
          </Button>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-emerald/20 mb-4">
            <Clock className="h-8 w-8 text-emerald" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Brak aktywności
          </h3>
          <p className="text-foreground-secondary mb-4 max-w-sm">
            Twoja historia aktywności będzie wyświetlana tutaj, gdy zaczniesz korzystać z aplikacji.
          </p>
        </div>
      )}

      {/* Results count */}
      {filteredActivities.length > 0 && state.activities.length > 0 && (
        <div className="text-center text-xs text-foreground-secondary">
          Wyświetlanie {filteredActivities.length} z {state.activities.length} aktywności
        </div>
      )}
    </div>
  );
};

export default HistoryScreen;