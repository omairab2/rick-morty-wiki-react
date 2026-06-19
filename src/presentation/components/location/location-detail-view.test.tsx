import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  CharacterGender,
  CharacterStatus,
  type Character,
} from '@/core/domain/entities/character.entity';
import type { Location } from '@/core/domain/entities/location.entity';
import { LocationDetailView } from '@/presentation/components/location/location-detail-view';

const LOCATION: Location = {
  id: 1,
  name: 'Earth (C-137)',
  type: 'Planet',
  dimension: 'Dimension C-137',
  residentIds: [1],
};

const RESIDENTS: Character[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: CharacterStatus.Alive,
    species: 'Human',
    type: '',
    gender: CharacterGender.Male,
    origin: { name: 'Earth (C-137)', url: '' },
    location: { name: 'Citadel of Ricks', url: '' },
    imageUrl: 'https://example.com/rick.png',
    episodeCount: 1,
    episodeIds: [1],
  },
];

describe('LocationDetailView', () => {
  it('shows the location info and a grid of resident cards', () => {
    render(<LocationDetailView location={LOCATION} residents={RESIDENTS} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Earth (C-137)' })).toBeInTheDocument();
    expect(screen.getByText('Planet')).toBeInTheDocument();
    expect(screen.getByText('Dimension C-137')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /residents \(1\)/i })).toBeInTheDocument();
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });
});
