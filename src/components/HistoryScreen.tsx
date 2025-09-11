import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Droplets } from "lucide-react";

const HistoryScreen = () => {
  const activities = [
    {
      id: "1",
      action: "Podlano pomidory",
      date: "Dzisiaj, 8:30",
      status: "completed"
    },
    {
      id: "2", 
      action: "Posadzono sałatę",
      date: "Wczoraj, 14:20",
      status: "completed"
    },
    {
      id: "3",
      action: "Podlano ogórki", 
      date: "2 dni temu",
      status: "completed"
    }
  ];

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-foreground">Historia</h1>
        <p className="text-sm sm:text-base text-foreground-secondary">Ostatnie aktywności w ogrodzie</p>
      </div>

      {/* Recent Activities */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Ostatnie aktywności</h2>
        <div className="space-y-3">
          {activities.map((activity) => (
            <Card key={activity.id} className="glass rounded-xl p-3 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 rounded-lg bg-emerald/20 flex-shrink-0">
                  {activity.action.includes("Podlano") ? (
                    <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
                  ) : (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium text-foreground">{activity.action}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-foreground-secondary flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-foreground-secondary">{activity.date}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="glass text-emerald border-emerald/30 text-xs flex-shrink-0">
                  Wykonano
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryScreen;