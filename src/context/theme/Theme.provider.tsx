import { useState, type ReactNode, useEffect } from 'react';
import { THEME_KEY } from '@/constants';
import { ThemeContext, type ThemeMode } from '.';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return (savedTheme as ThemeMode) || 'light';
  });

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, newTheme);
      return newTheme;
    });
  };

  // Apply theme class to document body when theme changes
  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext>
  );
};
