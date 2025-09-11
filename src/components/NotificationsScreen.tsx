import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Droplets, CheckCircle } from "lucide-react";

const NotificationsScreen = () => {
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Powiadomienia</h1>
        <p className="text-foreground-secondary">Dzisiejsze przypomnienia</p>
      </div>

      {/* Today's Notification */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Dzisiaj</h2>
        <Card className="glass-card">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-emerald/20 emerald-glow">
              <Droplets className="h-5 w-5 text-emerald" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Czas podlać pomidory!</h3>
              <p className="text-sm text-foreground-secondary mt-1">
                Rośliny w grządce wschodniej potrzebują wody
              </p>
              <div className="flex items-center space-x-3 mt-4">
                <Button 
                  size="sm" 
                  className="bg-emerald hover:bg-emerald-light emerald-glow"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Oznacz jako wykonane
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="glass-button"
                >
                  Przypomni później
                </Button>
              </div>
            </div>
            <Badge variant="secondary" className="glass text-emerald border-emerald/30">
              Nowe
            </Badge>
          </div>
        </Card>
      </div>

      {/* Empty State for Other Notifications */}
      <div className="flex flex-col items-center justify-center py-12">
        <div className="p-4 rounded-full bg-glass-hover mb-4">
          <Bell className="h-8 w-8 text-foreground-secondary" />
        </div>
        <p className="text-foreground-secondary text-center">
          Brak innych powiadomień
        </p>
      </div>
    </div>
  );
};

export default NotificationsScreen;