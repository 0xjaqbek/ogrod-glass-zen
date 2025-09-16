// src/components/LunarGardenInfo.tsx
import { Card } from "@/components/ui/card";
import { getCurrentLunarRecommendation, getPhaseName } from "@/utils/lunarUtils";
import { Moon } from "lucide-react";

const LunarGardenInfo = () => {
  const recommendation = getCurrentLunarRecommendation();

  return (
    <Card className="glass rounded-xl p-4 border border-emerald/20">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-lg bg-emerald/20 emerald-glow">
          <span className="text-2xl" role="img" aria-label="moon phase">
            {recommendation.icon}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Moon className="h-4 w-4 text-emerald" />
            <h3 className="text-sm font-semibold text-foreground">
              {getPhaseName(recommendation.phase)}
            </h3>
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            {recommendation.title}
          </p>
          <p className="text-xs text-foreground-secondary">
            {recommendation.description}
          </p>
        </div>
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
          recommendation.favorable ? 'bg-emerald' : 'bg-amber-500'
        }`} />
      </div>
    </Card>
  );
};

export default LunarGardenInfo;