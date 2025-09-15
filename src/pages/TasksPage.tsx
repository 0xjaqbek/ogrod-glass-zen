import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, CheckCircle, Clock, AlertCircle, Droplets, Sprout } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { toast } from "@/hooks/use-toast";

const TasksPage = () => {
  const { state, completeTask, getTodaysTasks, getUpcomingTasks } = useGarden();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'overdue' | 'completed'>('all');

  // Use consistent date logic
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Use context functions for consistency
  const todayTasks = getTodaysTasks();
  const upcomingTasks = getUpcomingTasks();

  const overdueTasks = state.tasks.filter(task => {
    if (task.completed || !task.dueDate) return false;

    const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
    if (isNaN(taskDate.getTime())) return false;

    const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
    return taskDateOnly.getTime() < today.getTime();
  });

  const completedTasks = state.tasks.filter(task => task.completed);

  const filteredTasks = (() => {
    switch (filter) {
      case 'today':
        return todayTasks;
      case 'upcoming':
        return upcomingTasks;
      case 'overdue':
        return overdueTasks;
      case 'completed':
        return completedTasks;
      default:
        return [...todayTasks, ...upcomingTasks, ...overdueTasks];
    }
  })().sort((a, b) => {
    // For completed tasks, sort by completion date (most recent first)
    if (filter === 'completed') {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    // For other tasks, sort by due date (earliest first)
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const handleCompleteTask = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      completeTask(taskId, task.plantId, task.bedId);
      toast({
        title: "Zadanie wykonane! ✅",
        description: `Ukończono: ${task.title}`,
      });
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'watering':
        return <Droplets className="h-4 w-4" />;
      case 'fertilizing':
        return <Sprout className="h-4 w-4" />;
      case 'harvesting':
        return <CheckCircle className="h-4 w-4" />;
      case 'pruning':
        return <Sprout className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Wysoki';
      case 'medium': return 'Średni';
      case 'low': return 'Niski';
      default: return priority;
    }
  };

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case 'watering': return 'Podlewanie';
      case 'fertilizing': return 'Nawożenie';
      case 'harvesting': return 'Zbiory';
      case 'pruning': return 'Przycinanie';
      default: return 'Inne';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate: Date) => {
    if (!dueDate) return false;
    const taskDate = dueDate instanceof Date ? dueDate : new Date(dueDate);
    if (isNaN(taskDate.getTime())) return false;

    const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
    return taskDateOnly.getTime() < today.getTime();
  };

  const isToday = (dueDate: Date) => {
    if (!dueDate) return false;
    const taskDate = dueDate instanceof Date ? dueDate : new Date(dueDate);
    if (isNaN(taskDate.getTime())) return false;

    const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
    return taskDateOnly.getTime() === today.getTime();
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Zadania</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">
            Zarządzaj swoimi zadaniami ogrodniczymi
          </p>
        </div>
        <Link to="/tasks/new">
          <Button 
            variant="outline" 
            size="icon" 
            className="glass-button emerald-glow rounded-full h-8 w-8 sm:h-10 sm:w-10"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="glass rounded-xl p-3 sm:p-4">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-emerald">{todayTasks.length}</p>
            <p className="text-xs sm:text-sm text-foreground-secondary">Dzisiaj</p>
          </div>
        </Card>
        <Card className="glass rounded-xl p-3 sm:p-4">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-red-500">{overdueTasks.length}</p>
            <p className="text-xs sm:text-sm text-foreground-secondary">Zaległe</p>
          </div>
        </Card>
        <Card className="glass rounded-xl p-3 sm:p-4">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-500">{upcomingTasks.length}</p>
            <p className="text-xs sm:text-sm text-foreground-secondary">Nadchodzące</p>
          </div>
        </Card>
        <Card
          className={`glass rounded-xl p-3 sm:p-4 ${filter === 'completed' ? '' : 'cursor-pointer glass-hover'}`}
          onClick={filter !== 'completed' ? () => setFilter('completed') : undefined}
        >
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-emerald">
              {completedTasks.length}
            </p>
            <p className="text-xs sm:text-sm text-foreground-secondary">Ukończone</p>
          </div>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Wszystkie', count: filter === 'all' ? filteredTasks.length : todayTasks.length + upcomingTasks.length + overdueTasks.length },
          { key: 'today', label: 'Dzisiaj', count: todayTasks.length },
          { key: 'overdue', label: 'Zaległe', count: overdueTasks.length },
          { key: 'upcoming', label: 'Nadchodzące', count: upcomingTasks.length },
          { key: 'completed', label: 'Ukończone', count: completedTasks.length }
        ].map(({ key, label, count }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(key as any)}
            className={`glass-button text-xs sm:text-sm ${filter === key ? 'emerald-glow' : ''}`}
          >
            {label} ({count})
          </Button>
        ))}
      </div>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const garden = state.gardens.find(g => g.id === task.gardenId);
            const bed = garden?.beds.find(b => b.id === task.bedId);
            const plant = bed?.plants.find(p => p.id === task.plantId);

            return (
              <Card key={task.id} className="glass rounded-xl p-3 sm:p-6 glass-hover">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                    <div className={`p-2 sm:p-3 rounded-lg ${
                      isOverdue(task.dueDate) ? 'bg-red/20' : 
                      isToday(task.dueDate) ? 'bg-emerald/20' : 'bg-blue/20'
                    }`}>
                      {getTaskIcon(task.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link to={`/tasks/${task.id}`}>
                        <h3 className="text-sm sm:text-base font-medium text-foreground hover:text-emerald">
                          {task.title}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-foreground-secondary mb-2">
                        {task.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getTaskTypeLabel(task.type)}
                        </Badge>
                        {garden && (
                          <Badge variant="outline" className="text-xs">
                            {garden.name}
                          </Badge>
                        )}
                        {plant && (
                          <Badge variant="outline" className="text-xs">
                            {plant.emoji} {plant.name}
                          </Badge>
                        )}
                      </div>

                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-xs text-foreground-secondary">
                          {isOverdue(task.dueDate) && (
                            <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                          )}
                          {isToday(task.dueDate) && (
                            <Clock className="h-3 w-3 mr-1 text-emerald" />
                          )}
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className={isOverdue(task.dueDate) ? 'text-red-500 font-medium' : ''}>
                            Do wykonania {isOverdue(task.dueDate) ? 'od' : isToday(task.dueDate) ? 'dziś' : 'za'}: {formatDate(task.dueDate)}
                          </span>
                        </div>

                        {!task.completed && (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteTask(task.id)}
                            className="bg-emerald hover:bg-emerald-light emerald-glow text-xs h-7"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Oznacz jako gotowe
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {task.completed && (
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                      <CheckCircle className="h-4 w-4 text-emerald" />
                      <span className="text-xs text-emerald font-medium">Ukończone</span>
                    </div>
                  )}
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
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-emerald" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
              {filter === 'all' ? 'Brak zadań' :
               filter === 'today' ? 'Brak zadań na dziś' :
               filter === 'overdue' ? 'Brak zaległych zadań' :
               filter === 'upcoming' ? 'Brak nadchodzących zadań' :
               'Brak ukończonych zadań'}
            </h3>
            <p className="text-sm sm:text-base text-foreground-secondary mb-4">
              {filter === 'all' ? 'Dodaj nowe zadanie aby rozpocząć organizację prac w ogrodzie.' :
               filter === 'completed' ? 'Ukończ kilka zadań aby zobaczyć je tutaj.' :
               'Przejdź do innej kategorii lub dodaj nowe zadanie.'}
            </p>
            <Link to="/tasks/new">
              <Button className="emerald-glow">
                <Plus className="h-4 w-4 mr-2" />
                Dodaj zadanie
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TasksPage;