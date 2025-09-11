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
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Historia</h1>
        <p className="text-foreground-secondary">Ostatnie aktywności w ogrodzie</p>
      </div>

      {/* Recent Activities */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Ostatnie aktywności</h2>
        <div className="space-y-3">
          {activities.map((activity) => (
            <Card key={activity.id} className="glass-card">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-emerald/20">
                  {activity.action.includes("Podlano") ? (
                    <Droplets className="h-5 w-5 text-emerald" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-emerald" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{activity.action}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4 text-foreground-secondary" />
                    <span className="text-sm text-foreground-secondary">{activity.date}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="glass text-emerald border-emerald/30">
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