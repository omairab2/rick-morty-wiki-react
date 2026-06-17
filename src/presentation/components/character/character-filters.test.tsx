import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  CharacterFilters,
  type CharacterFiltersValue,
} from '@/presentation/components/character/character-filters';

const EMPTY_VALUE: CharacterFiltersValue = { search: '', status: '', gender: '' };

describe('CharacterFilters', () => {
  it('calls onSearchChange when the user edits the search field', () => {
    const onSearchChange = vi.fn();

    render(
      <CharacterFilters
        value={EMPTY_VALUE}
        onSearchChange={onSearchChange}
        onStatusChange={vi.fn()}
        onGenderChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole('searchbox', { name: /search characters by name/i }), {
      target: { value: 'Rick' },
    });

    expect(onSearchChange).toHaveBeenCalledWith('Rick');
  });

  it('renders the status and gender filter controls', () => {
    render(
      <CharacterFilters
        value={EMPTY_VALUE}
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onGenderChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('combobox', { name: /filter by status/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /filter by gender/i })).toBeInTheDocument();
  });
});
