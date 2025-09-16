// src/components/LunarGardenInfo.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { getCurrentLunarRecommendation, getPhaseName } from "@/utils/lunarUtils";
import { Moon, ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react";

const LunarGardenInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const recommendation = getCurrentLunarRecommendation();

  return (
    <Card className="glass rounded-xl border border-emerald/20">
      {/* Main Card - Clickable */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
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
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              recommendation.favorable ? 'bg-emerald' : 'bg-amber-500'
            }`} />
            {isExpanded ?
              <ChevronUp className="h-4 w-4 text-foreground-secondary" /> :
              <ChevronDown className="h-4 w-4 text-foreground-secondary" />
            }
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-emerald/10">
          {/* General Info */}
          <div className="pt-4 space-y-3">
            <p className="text-sm text-foreground-secondary leading-relaxed">
              {recommendation.detailed.general}
            </p>
            {recommendation.detailed.seasonalNote && (
              <div className="bg-emerald/5 border border-emerald/10 rounded-lg p-3">
                <p className="text-sm text-foreground font-medium">
                  📅 {recommendation.seasonal.season === 'spring' ? 'Wiosna' :
                       recommendation.seasonal.season === 'summer' ? 'Lato' :
                       recommendation.seasonal.season === 'autumn' ? 'Jesień' : 'Zima'} -
                  {' '}{recommendation.detailed.seasonalNote}
                </p>
              </div>
            )}
          </div>

          {/* Favorable Activities */}
          {recommendation.detailed.favorable.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-4 w-4 text-emerald" />
                <h4 className="text-sm font-semibold text-foreground">Zalecane działania</h4>
              </div>
              <div className="space-y-3">
                {recommendation.detailed.favorable.map((activity, index) => (
                  <div key={index} className="bg-emerald/5 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-foreground mb-2">{activity.category}</h5>
                    <div className="space-y-1">
                      {activity.activities.map((act, actIndex) => (
                        <p key={actIndex} className="text-xs text-foreground-secondary flex items-start">
                          <span className="w-1 h-1 bg-emerald rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {act}
                        </p>
                      ))}
                    </div>
                    {activity.plants.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-emerald mb-1">Rośliny:</p>
                        <p className="text-xs text-foreground-secondary">{activity.plants.join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities to Avoid */}
          {recommendation.detailed.avoid.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <XCircle className="h-4 w-4 text-amber-500" />
                <h4 className="text-sm font-semibold text-foreground">Unikaj</h4>
              </div>
              <div className="space-y-3">
                {recommendation.detailed.avoid.map((activity, index) => (
                  <div key={index} className="bg-amber-500/5 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-foreground mb-2">{activity.category}</h5>
                    <div className="space-y-1">
                      {activity.activities.map((act, actIndex) => (
                        <p key={actIndex} className="text-xs text-foreground-secondary flex items-start">
                          <span className="w-1 h-1 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {act}
                        </p>
                      ))}
                    </div>
                    {activity.plants.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-amber-500 mb-1">Dotyczy:</p>
                        <p className="text-xs text-foreground-secondary">{activity.plants.join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default LunarGardenInfo;