export type ThemeName = 'light' | 'dark';

export interface ThemeTokens {
  background: string;
  surface: string;
  surfaceStrong: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  accentHover: string;
  accentMuted: string;
  card: string;
  shadow: string;
}

export const themeConfig: Record<ThemeName, ThemeTokens> = {
  light: {
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceStrong: '#e2e8f0',
    text: '#0f172a',
    muted: '#475569',
    border: '#e2e8f0',
    accent: '#020617',//'#22d3ee',
    accentHover: '#0891b2',
    accentMuted: '#bae6fd',
    card: '#f8fafc',
    shadow: '0 30px 80px rgba(15, 23, 42, 0.08)',
  },
  dark: {
    background: '#020617',
    surface: '#0f172a',
    surfaceStrong: '#111827',
    text: '#f8fafc',
    muted: '#94a3b8',
    border: '#334155',
    accent: '#22d3ee',
    accentHover: '#0ea5e9',
    accentMuted: '#0f172a',
    card: '#111827',
    shadow: '0 30px 80px rgba(15, 23, 42, 0.35)',
  },
};

export const themeNames: ThemeName[] = ['light', 'dark'];
export const defaultTheme: ThemeName = 'dark';
export const themeLabels: Record<ThemeName, string> = {
  light: 'Light',
  dark: 'Dark',
};
export const themeStorageKey = 'mern_starter_theme';
