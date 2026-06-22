import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { ModeToggle } from '@/presentation/components/mode-toggle';
import { ThemeProvider } from '@/presentation/theme/theme-provider';

const THEME_STORAGE_KEY = 'rick-morty-theme';
const DARK_CLASS = 'dark';
const TOGGLE_NAME = /toggle theme/i;

function renderToggle() {
  return render(
    <ThemeProvider>
      <ModeToggle />
    </ThemeProvider>,
  );
}

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove(DARK_CLASS);
});

describe('ModeToggle', () => {
  it('exposes an accessible toggle button', () => {
    renderToggle();

    expect(screen.getByRole('button', { name: TOGGLE_NAME })).toBeInTheDocument();
  });

  it('switches to dark mode and persists the choice', async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole('button', { name: TOGGLE_NAME }));

    expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('toggles back to light mode on a second click', async () => {
    const user = userEvent.setup();
    renderToggle();
    const button = screen.getByRole('button', { name: TOGGLE_NAME });

    await user.click(button);
    await user.click(button);

    expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(false);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });
});
