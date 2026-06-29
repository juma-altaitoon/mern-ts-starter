import { createContext } from 'react';
import type { ThemeName } from './theme';

export type ThemeContextType = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);