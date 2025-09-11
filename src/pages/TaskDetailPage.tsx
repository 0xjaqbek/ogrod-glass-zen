import { useParams, useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, CheckCircle, Calendar, AlertCircle, Clock, Droplets, Sprout } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { toast } from "@/hooks/use-toast";

const TaskDetailPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { state, completeTask, deleteTask } = useGarden();

  const task = taskId ? state.tasks.find(t => t.id === taskId) : null;
  const garden = task ? state.gardens.find(g => g.id === task.gardenId) : null;
  const bed = garden && task?.bedId ? garden.beds.find(b => b.id === task.bedId) : null;
  const plant = bed && task?.plantId ? bed.plants.find(p => p.id === task.plantId) : null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!taskId) {
    navigate('/tasks');
    return null;
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-foreground-secondary">Zadanie nie znalezione</p>
          <Link to="/tasks">
            <Button className="mt-4">Powrót do zadań</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCompleteTask = () => {
    completeTask(taskId, task.plantId, task.bedId);
    toast({
      title: "Zadanie wykonane! ✅",
      description: `Ukończono: ${task.title}`,
    });
    navigate('/tasks');
  };

  const handleDeleteTask = () => {
    if (window.confirm(`Czy na pewno chcesz usunąć zadanie "${task.title}"?`)) {
      deleteTask(taskId);
      toast({
        title: "Zadanie usunięte",
        description: `Zadanie "${task.title}" zostało usunięte`,
      });
      navigate('/tasks');
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'watering':
        return <Droplets className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'fertilizing':
        return <Sprout className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'harvesting':
        return <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'pruning':
        return <Sprout className="h-5 w-5 sm:h-6 sm:w-6" />;
      default:
        return <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />;
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
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate: Date) => {
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  const isToday = (dueDate: Date) => {
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  };

  const getDaysUntilDue = () => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/tasks')}
          className="glass-button h-8 w-8 sm:h-10 sm:w-10"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">{task.title}</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">
            Szczegóły zadania
          </p>
        </div>
        {!task.completed && (
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="glass-button h-8 w-8 sm:h-10 sm:w-10">
              <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleDeleteTask}
              className="glass-button h-8 w-8 sm:h-10 sm:w-10 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Task Status */}
      {task.completed ? (
        <Card className="glass rounded-xl p-4 border-green-200 bg-green-50">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Zadanie ukończone</p>
              <p className="text-sm text-green-600">To zadanie zostało już wykonane</p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className={`glass rounded-xl p-4 ${
          isOverdue(task.dueDate) ? 'border-red-200 bg-red-50' : 
          isToday(task.dueDate) ? 'border-emerald-200 bg-emerald-50' : 
          'border-blue-200 bg-blue-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isOverdue(task.dueDate) && <AlertCircle className="h-6 w-6 text-red-600" />}
              {isToday(task.dueDate) && <Clock className="h-6 w-6 text-emerald-600" />}
              {!isOverdue(task.dueDate) && !isToday(task.dueDate) && <Calendar className="h-6 w-6 text-blue-600" />}
              <div>
                <p className={`font-medium ${
                  isOverdue(task.dueDate) ? 'text-red-800' : 
                  isToday(task.dueDate) ? 'text-emerald-800' : 'text-blue-800'
                }`}>
                  {isOverdue(task.dueDate) ? `Zaległe o ${Math.abs(daysUntilDue)} dni` :
                   isToday(task.dueDate) ? 'Do wykonania dzisiaj' :
                   `Do wykonania za ${daysUntilDue} dni`}
                </p>
                <p className={`text-sm ${
                  isOverdue(task.dueDate) ? 'text-red-600' : 
                  isToday(task.dueDate) ? 'text-emerald-600' : 'text-blue-600'
                }`}>
                  {formatDate(task.dueDate)}
                </p>
              </div>
            </div>
            <Button
              onClick={handleCompleteTask}
              className="bg-emerald hover:bg-emerald-light emerald-glow"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Oznacz jako gotowe
            </Button>
          </div>
        </Card>
      )}

      {/* Task Details */}
      <Card className="glass rounded-xl p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-emerald/20">
              {getTaskIcon(task.type)}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground mb-2">{task.title}</h2>
              <p className="text-foreground-secondary mb-4">{task.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={`text-sm ${getPriorityColor(task.priority)}`}>
                  Priorytet: {getPriorityLabel(task.priority)}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Typ: {getTaskTypeLabel(task.type)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Related Items */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Powiązane elementy</h2>
        
        {/* Garden */}
        {garden && (
          <Link to={`/gardens/${garden.id}`}>
            <Card className="glass rounded-xl p-4 glass-hover cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald/20">
                  <Sprout className="h-5 w-5 text-emerald" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Ogród: {garden.name}</p>
                  <p className="text-sm text-foreground-secondary">Kliknij aby przejść do ogrodu</p>
                </div>
              </div>
            </Card>
          </Link>
        )}

        {/* Bed */}
        {bed && (
          <Link to={`/gardens/${garden?.id}/beds/${bed.id}`}>
            <Card className="glass rounded-xl p-4 glass-hover cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald/20">
                  <Sprout className="h-5 w-5 text-emerald" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Grządka: {bed.name}</p>
                  <p className="text-sm text-foreground-secondary">Kliknij aby przejść do grządki</p>
                </div>
              </div>
            </Card>
          </Link>
        )}

        {/* Plant */}
        {plant && (
          <Link to={`/gardens/${garden?.id}/beds/${bed?.id}/plants/${plant.id}`}>
            <Card className="glass rounded-xl p-4 glass-hover cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald/20 text-lg">
                  {plant.emoji}
                </div>
                <div>
                  <p className="font-medium text-foreground">Roślina: {plant.name}</p>
                  <p className="text-sm text-foreground-secondary">
                    Faza: {plant.phase} • Postęp: {plant.progress}%
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      {!task.completed && (
        <Card className="glass rounded-xl p-4">
          <h3 className="font-medium text-foreground mb-3">Szybkie akcje</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleCompleteTask}
              className="bg-emerald hover:bg-emerald-light emerald-glow"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Oznacz jako gotowe
            </Button>
            <Button variant="outline" className="glass-button">
              <Edit className="h-4 w-4 mr-2" />
              Edytuj zadanie
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDeleteTask}
              className="glass-button text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Usuń zadanie
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TaskDetailPage;