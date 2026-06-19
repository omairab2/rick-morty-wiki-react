import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  EpisodeFilters,
  type EpisodeFiltersValue,
} from '@/presentation/components/episode/episode-filters';

const EMPTY_VALUE: EpisodeFiltersValue = { search: '', season: '' };

describe('EpisodeFilters', () => {
  it('calls onSearchChange when the user edits the search field', () => {
    const onSearchChange = vi.fn();

    render(
      <EpisodeFilters
        value={EMPTY_VALUE}
        onSearchChange={onSearchChange}
        onSeasonChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole('searchbox', { name: /search episodes by name/i }), {
      target: { value: 'Pilot' },
    });

    expect(onSearchChange).toHaveBeenCalledWith('Pilot');
  });

  it('renders the season filter control', () => {
    render(
      <EpisodeFilters value={EMPTY_VALUE} onSearchChange={vi.fn()} onSeasonChange={vi.fn()} />,
    );

    expect(screen.getByRole('combobox', { name: /filter by season/i })).toBeInTheDocument();
  });
});
