import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Droplets, CheckCircle } from "lucide-react";

const NotificationsScreen = () => {
  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-foreground">Powiadomienia</h1>
        <p className="text-sm sm:text-base text-foreground-secondary">Dzisiejsze przypomnienia</p>
      </div>

      {/* Today's Notification */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Dzisiaj</h2>
        <Card className="glass rounded-xl p-3 sm:p-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 rounded-lg bg-emerald/20 emerald-glow flex-shrink-0">
              <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-medium text-foreground">Czas podlać pomidory!</h3>
              <p className="text-xs sm:text-sm text-foreground-secondary mt-1">
                Rośliny w grządce wschodniej potrzebują wody
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                <Button 
                  size="sm" 
                  className="bg-emerald hover:bg-emerald-light emerald-glow text-xs sm:text-sm w-full sm:w-auto"
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Oznacz jako wykonane
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="glass-button text-xs sm:text-sm w-full sm:w-auto"
                >
                  Przypomni później
                </Button>
              </div>
            </div>
            <Badge variant="secondary" className="glass text-emerald border-emerald/30 text-xs flex-shrink-0">
              Nowe
            </Badge>
          </div>
        </Card>
      </div>

      {/* Empty State for Other Notifications */}
      <div className="flex flex-col items-center justify-center py-8 sm:py-12">
        <div className="p-3 sm:p-4 rounded-full bg-glass-hover mb-3 sm:mb-4">
          <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-foreground-secondary" />
        </div>
        <p className="text-sm sm:text-base text-foreground-secondary text-center">
          Brak innych powiadomień
        </p>
      </div>
    </div>
  );
};

export default NotificationsScreen;