import { useEffect, useState } from 'react';

type ColorScheme = 'normal' | 'reversed';

const getColorSchemeFromStorage = (): ColorScheme => {
  const saved = localStorage.getItem('ogrod-settings');
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      return settings.colorScheme || 'normal';
    } catch {
      return 'normal';
    }
  }
  return 'normal';
};

export const useTheme = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(getColorSchemeFromStorage);

  // Apply theme class to body
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    console.log('Applying theme:', colorScheme); // Debug log

    if (colorScheme === 'reversed') {
      body.classList.add('theme-reversed');
      html.classList.add('theme-reversed');
    } else {
      body.classList.remove('theme-reversed');
      html.classList.remove('theme-reversed');
    }

    console.log('Body classes:', body.className); // Debug log
    console.log('HTML classes:', html.className); // Debug log

    // Also listen for changes in localStorage from other components
    const handleStorageChange = () => {
      const newColorScheme = getColorSchemeFromStorage();
      if (newColorScheme !== colorScheme) {
        console.log('Theme changed via storage:', newColorScheme); // Debug log
        setColorScheme(newColorScheme);
      }
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);

    // Check for localStorage changes more frequently (for same tab changes)
    const interval = setInterval(handleStorageChange, 50);

    // Also check immediately when the effect runs
    handleStorageChange();

    return () => {
      body.classList.remove('theme-reversed');
      html.classList.remove('theme-reversed');
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [colorScheme]);

  return { colorScheme, setColorScheme };
};