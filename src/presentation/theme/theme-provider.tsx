import { useEffect, useState, type ReactNode } from 'react';

import { THEME_STORAGE_KEY, ThemeContext, type Theme } from '@/presentation/theme/theme-context';

const DARK_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const DARK_CLASS = 'dark';
const DEFAULT_THEME: Theme = 'system';

// Matches the `--background` oklch values in index.css so the mobile browser
// chrome (address bar) blends with the page in each theme.
const THEME_COLOR_DARK = '#0a0a0a';
const THEME_COLOR_LIGHT = '#ffffff';

function readStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);

  return stored === 'dark' || stored === 'light' || stored === 'system' ? stored : DEFAULT_THEME;
}

function prefersDark(): boolean {
  return window.matchMedia(DARK_COLOR_SCHEME_QUERY).matches;
}

/**
 * Reflect the resolved theme onto the document: toggle the `.dark` class shadcn's
 * CSS variables key off, set `color-scheme` for native controls, and keep the
 * `theme-color` meta in sync so the mobile browser chrome matches.
 */
function applyTheme(theme: Theme): void {
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark());
  const root = document.documentElement;

  root.classList.toggle(DARK_CLASS, isDark);
  root.style.colorScheme = isDark ? 'dark' : 'light';
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', isDark ? THEME_COLOR_DARK : THEME_COLOR_LIGHT);
}

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Custom theme provider (the shadcn/ui pattern for Vite — `next-themes` is
 * Next.js-specific). Persists the choice to localStorage and applies it to the
 * document; a no-flash script in `index.html` applies the same value before the
 * first paint so there is no flash of the wrong theme.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // While following the OS, react to the system theme changing under us.
  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const media = window.matchMedia(DARK_COLOR_SCHEME_QUERY);
    const handleChange = () => applyTheme('system');

    media.addEventListener('change', handleChange);

    return () => media.removeEventListener('change', handleChange);
  }, [theme]);

  function setTheme(next: Theme): void {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    setThemeState(next);
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
