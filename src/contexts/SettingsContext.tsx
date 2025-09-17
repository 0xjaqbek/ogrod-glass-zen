import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  showTooltips: boolean;
  setShowTooltips: (show: boolean) => void;
  // Add other global settings here as needed
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [showTooltips, setShowTooltipsState] = useState(() => {
    const saved = localStorage.getItem('ogrod-settings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        return parsedSettings.showTooltips !== false; // Default to true
      } catch {
        return true;
      }
    }
    return true;
  });

  const setShowTooltips = (show: boolean) => {
    setShowTooltipsState(show);
    // Update localStorage
    const saved = localStorage.getItem('ogrod-settings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        parsedSettings.showTooltips = show;
        localStorage.setItem('ogrod-settings', JSON.stringify(parsedSettings));
      } catch {
        // If there's an error, create a new settings object
        localStorage.setItem('ogrod-settings', JSON.stringify({ showTooltips: show }));
      }
    } else {
      localStorage.setItem('ogrod-settings', JSON.stringify({ showTooltips: show }));
    }
  };

  // Listen for localStorage changes from other tabs/components
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('ogrod-settings');
      if (saved) {
        try {
          const parsedSettings = JSON.parse(saved);
          setShowTooltipsState(parsedSettings.showTooltips !== false);
        } catch {
          setShowTooltipsState(true);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events from within the same tab
    const handleSettingsChange = () => handleStorageChange();
    window.addEventListener('settings-changed', handleSettingsChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('settings-changed', handleSettingsChange);
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ showTooltips, setShowTooltips }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};