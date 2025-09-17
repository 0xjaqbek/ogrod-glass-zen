import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/contexts/SettingsContext";

interface TooltipPlusProps {
  children: React.ReactNode;
  text: string;
  showOnMobile?: boolean;
  className?: string;
}

export const TooltipPlus = ({ children, text, showOnMobile = false, className }: TooltipPlusProps) => {
  const { showTooltips } = useSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (showTooltips && showOnMobile && isMobile) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 1000);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showTooltips, showOnMobile, isMobile]);

  return (
    <div className="relative">
      <div
        onMouseEnter={() => showTooltips && !isMobile && setIsVisible(true)}
        onMouseLeave={() => !isMobile && setIsVisible(false)}
      >
        {children}
      </div>

      {showTooltips && isVisible && (
        <div className={cn(
          "absolute right-full top-1/2 transform -translate-y-1/2 mr-2 z-50",
          "glass rounded-lg px-3 py-2 text-xs font-medium text-foreground whitespace-nowrap",
          "animate-in fade-in-50 slide-in-from-right-1 duration-200",
          "pointer-events-none",
          className
        )}>
          {text}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0">
            <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-white/20"></div>
          </div>
        </div>
      )}
    </div>
  );
};