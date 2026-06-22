import { Moon, Sun } from 'lucide-react';

import { Button } from '@/presentation/components/ui/button';
import { useTheme } from '@/presentation/theme/use-theme.hook';

const DARK_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

/**
 * Header theme switch. Flips between light and dark based on the currently
 * resolved theme (a `system` preference resolves via the OS). The Sun/Moon
 * cross-fade is driven purely by the `.dark` class, so it tracks the active
 * theme even when it changes elsewhere.
 */
export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  function handleToggle(): void {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia(DARK_COLOR_SCHEME_QUERY).matches);

    setTheme(isDark ? 'light' : 'dark');
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="relative"
    >
      <Sun
        className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
        aria-hidden="true"
      />
      <Moon
        className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
        aria-hidden="true"
      />
    </Button>
  );
}
