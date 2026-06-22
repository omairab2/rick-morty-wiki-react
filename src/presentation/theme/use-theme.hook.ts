import { useContext } from 'react';

import { ThemeContext } from '@/presentation/theme/theme-context';

/** Read the current theme and setter. Must be used within a {@link ThemeProvider}. */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
