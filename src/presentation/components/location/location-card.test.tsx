import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Location } from '@/core/domain/entities/location.entity';
import { LocationCard } from '@/presentation/components/location/location-card';

const LOCATION: Location = {
  id: 1,
  name: 'Earth (C-137)',
  type: 'Planet',
  dimension: 'Dimension C-137',
  residentIds: [1, 2],
};

describe('LocationCard', () => {
  it('shows the name, type, and dimension', () => {
    render(<LocationCard location={LOCATION} />);

    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Planet')).toBeInTheDocument();
    expect(screen.getByText('Dimension C-137')).toBeInTheDocument();
  });

  it('shows the resident count', () => {
    render(<LocationCard location={LOCATION} />);

    expect(screen.getByText('Residents')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
