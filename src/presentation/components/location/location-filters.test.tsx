import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  LocationFilters,
  type LocationFiltersValue,
} from '@/presentation/components/location/location-filters';

const EMPTY_VALUE: LocationFiltersValue = { name: '', type: '', dimension: '' };

describe('LocationFilters', () => {
  it('calls the matching handler for each free-text filter', () => {
    const onNameChange = vi.fn();
    const onTypeChange = vi.fn();
    const onDimensionChange = vi.fn();

    render(
      <LocationFilters
        value={EMPTY_VALUE}
        onNameChange={onNameChange}
        onTypeChange={onTypeChange}
        onDimensionChange={onDimensionChange}
      />,
    );

    fireEvent.change(screen.getByRole('searchbox', { name: /search locations by name/i }), {
      target: { value: 'Earth' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /filter by type/i }), {
      target: { value: 'Planet' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /filter by dimension/i }), {
      target: { value: 'C-137' },
    });

    expect(onNameChange).toHaveBeenCalledWith('Earth');
    expect(onTypeChange).toHaveBeenCalledWith('Planet');
    expect(onDimensionChange).toHaveBeenCalledWith('C-137');
  });
});
