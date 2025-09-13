// src/components/NotificationsScreen.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Droplets, CheckCircle, X, Calendar, AlertTriangle, Trash2, Check } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";

const NotificationsScreen = () => {
  const { state, dispatch, completeTask, getTodaysTasks, getUpcomingTasks } = useGarden();
  const [filter, setFilter] = useState<'all' | 'unread' | 'tasks' | 'reminders' | 'alerts'>('all');

  const todaysTasks = getTodaysTasks();
  const upcomingTasks = getUpcomingTasks();

  // Filter notifications based on current filter
  const filteredNotifications = useMemo(() => {
    let filtered = [...state.notifications];

    switch (filter) {
      case 'unread':
        filtered = filtered.filter(n => !n.read);
        break;
      case 'tasks':
        filtered = filtered.filter(n => n.type === 'task');
        break;
      case 'reminders':
        filtered = filtered.filter(n => n.type === 'reminder');
        break;
      case 'alerts':
        filtered = filtered.filter(n => n.type === 'alert');
        break;
      default:
        // 'all' - no filtering
        break;
    }

    return filtered.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
  }, [state.notifications, filter]);

  // Use only real notifications
  const allNotifications = useMemo(() => {
    return filteredNotifications.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
  }, [filteredNotifications]);

  const handleMarkAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
    toast({
      title: "Oznaczono jako przeczytane ✓",
    });
  };

  const handleDeleteNotification = (notificationId: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
    toast({
      title: "Powiadomienie usunięte",
    });
  };

  const handleCompleteTaskFromNotification = (notificationId: string, taskId: string) => {
    const task = [...todaysTasks, ...upcomingTasks].find(t => t.id === taskId);
    if (task) {
      completeTask(taskId, task.plantId, task.bedId);
      dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
      toast({
        title: "Zadanie wykonane! ✅",
        description: `Ukończono: ${task.title}`,
      });
    }
  };

  const markAllAsRead = () => {
    const unreadNotifications = state.notifications.filter(n => !n.read);
    unreadNotifications.forEach(notification => {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id });
    });
    
    if (unreadNotifications.length > 0) {
      toast({
        title: "Wszystkie oznaczone jako przeczytane ✓",
        description: `Oznaczono ${unreadNotifications.length} powiadomień`,
      });
    }
  };

  const clearAllRead = () => {
    const readNotifications = state.notifications.filter(n => n.read);
    readNotifications.forEach(notification => {
      dispatch({ type: 'DELETE_NOTIFICATION', payload: notification.id });
    });
    
    if (readNotifications.length > 0) {
      toast({
        title: "Powiadomienia wyczyszczone",
        description: `Usunięto ${readNotifications.length} przeczytanych powiadomień`,
      });
    }
  };

  const getNotificationIcon = (type: string, taskType?: string) => {
    if (type === 'alert') {
      return <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
    }
    if (type === 'reminder') {
      return <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />;
    }
    if (type === 'task') {
      if (taskType === 'watering') {
        return <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
      }
      return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />;
    }
    return <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />;
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'reminder':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'task':
        return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
      default:
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
    }
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
    
    return date.toLocaleDateString('pl-PL');
  };

  const unreadCount = state.notifications.filter(n => !n.read).length;

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Powiadomienia</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">
            {unreadCount === 0 
              ? 'Brak nowych powiadomień' 
              : `${unreadCount} ${unreadCount === 1 ? 'nowe powiadomienie' : unreadCount < 5 ? 'nowe powiadomienia' : 'nowych powiadomień'}`
            }
          </p>
        </div>
        
        {state.notifications.length > 0 && (
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="glass-button text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Wszystkie
              </Button>
            )}
            {state.notifications.filter(n => n.read).length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllRead}
                className="glass-button text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Wyczyść
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      {state.notifications.length > 0 && (
        <Card className="glass rounded-xl p-2">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { key: 'all', label: 'Wszystkie', count: allNotifications.length },
              { key: 'unread', label: 'Nieprzeczytane', count: unreadCount },
              { key: 'tasks', label: 'Zadania', count: state.notifications.filter(n => n.type === 'task').length },
              { key: 'reminders', label: 'Przypomnienia', count: state.notifications.filter(n => n.type === 'reminder').length },
              { key: 'alerts', label: 'Alerty', count: state.notifications.filter(n => n.type === 'alert').length },
            ].map(tab => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(tab.key as any)}
                className={`text-xs whitespace-nowrap ${
                  filter === tab.key 
                    ? 'bg-emerald text-white' 
                    : 'glass-button'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className={`ml-1 text-xs ${
                      filter === tab.key 
                        ? 'bg-white/20 text-white border-white/30' 
                        : 'bg-emerald/20 text-emerald border-emerald/30'
                    }`}
                  >
                    {tab.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Notifications List */}
      {allNotifications.length > 0 ? (
        <div className="space-y-3">
          {allNotifications.map((notification) => {
            const task = [...todaysTasks, ...upcomingTasks].find(t => t.id === notification.taskId);

            return (
              <Card 
                key={notification.id} 
                className={`glass rounded-xl p-3 sm:p-6 ${
                  !notification.read ? 'ring-2 ring-emerald/30' : ''
                }`}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                    notification.type === 'alert'
                      ? 'bg-red-500/20'
                      : notification.type === 'reminder'
                      ? 'bg-orange-500/20'
                      : 'bg-emerald/20'
                  }`}>
                    {getNotificationIcon(notification.type, task?.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-medium text-foreground">
                          {notification.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-foreground-secondary mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-foreground-secondary">
                            {formatTimeAgo(notification.createdDate)}
                          </span>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getNotificationBadgeColor(notification.type)}`}
                          >
                            {notification.type === 'alert' ? 'Alert'
                             : notification.type === 'reminder' ? 'Przypomnienie'
                             : notification.type === 'task' ? 'Zadanie'
                             : 'Powiadomienie'}
                          </Badge>
                          {!notification.read && (
                            <Badge variant="secondary" className="bg-emerald/20 text-emerald border-emerald/30 text-xs">
                              Nowe
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        {notification.taskId && task && (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteTaskFromNotification(notification.id, notification.taskId!)}
                            className="bg-emerald hover:bg-emerald-light emerald-glow text-xs"
                          >
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Gotowe
                          </Button>
                        )}

                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="glass-button text-xs"
                          >
                            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="glass-button text-xs hover:text-red-500"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : state.notifications.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-emerald/20 mb-4">
            <Bell className="h-8 w-8 text-emerald" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Brak powiadomień
          </h3>
          <p className="text-foreground-secondary mb-4 max-w-sm">
            Tutaj będą wyświetlane przypomnienia o zadaniach i ważne informacje o Twoim ogrodzie.
          </p>
        </div>
      ) : (
        /* No results from filter */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-foreground-secondary/20 mb-4">
            <Bell className="h-8 w-8 text-foreground-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Brak powiadomień w tej kategorii
          </h3>
          <p className="text-foreground-secondary mb-4 max-w-sm">
            Spróbuj wybrać inną kategorię lub wyczyść filtry.
          </p>
          <Button 
            onClick={() => setFilter('all')}
            variant="ghost"
            className="glass-button"
          >
            Pokaż wszystkie
          </Button>
        </div>
      )}

      {/* Summary */}
      {allNotifications.length > 0 && (
        <div className="text-center text-xs text-foreground-secondary">
          Wyświetlanie {allNotifications.length} powiadomień
          {filter !== 'all' && ` (${filter})`}
        </div>
      )}
    </div>
  );
};

export default NotificationsScreen;