import React, { useEffect, useMemo, useState } from 'react';
import { defaultTheme, themeConfig, themeNames, type ThemeName, themeStorageKey } from './theme';
import { ThemeContext } from './ThemeContext';


const toCssVariable = (key: string) => `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;

const applyCssVariables = (theme: ThemeName) => {
  const root = document.documentElement;

  const tokens = themeConfig[theme];
  Object.entries(tokens).forEach(([token, value]) => {
    root.style.setProperty(toCssVariable(token), value);
  });

  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setActiveTheme] = useState<ThemeName>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }

    const storedTheme = window.localStorage.getItem(themeStorageKey) as ThemeName | null;
    if (storedTheme && themeNames.includes(storedTheme)) {
      return storedTheme;
    }

    return defaultTheme;
  });

  useEffect(() => {
    applyCssVariables(theme);
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (nextTheme: ThemeName) => {
        if (themeNames.includes(nextTheme)) {
          setActiveTheme(nextTheme);
        }
      },
      toggleTheme: () => {
        setActiveTheme((current) => (current === 'dark' ? 'light' : 'dark'));
      },
      isDark: theme === 'dark',
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};


