import { createContext } from 'react';

export type Theme = 'dark' | 'light' | 'system';

export interface ThemeContextValue {
  /** The user's chosen preference (`system` follows the OS setting). */
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/** localStorage key the no-flash script in `index.html` reads on first paint. */
export const THEME_STORAGE_KEY = 'rick-morty-theme';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
