import { useContext } from 'react';
import { ThemeContext } from '@/theme/ThemeContext';
import { type ThemeContextType } from '@/theme/ThemeContext';

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
