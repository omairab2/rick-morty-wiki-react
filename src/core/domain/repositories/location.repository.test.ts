import { describe, expect, it } from 'vitest';

import {
  CharacterGender,
  CharacterStatus,
  type Character,
} from '@/core/domain/entities/character.entity';
import type { Location } from '@/core/domain/entities/location.entity';
import type { LocationRepository } from '@/core/domain/repositories/location.repository';

const CHARACTER: Character = {
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
};

const LOCATION: Location = {
  id: 1,
  name: 'Earth (C-137)',
  type: 'Planet',
  dimension: 'Dimension C-137',
  residentIds: [1, 2],
};

describe('LocationRepository (port contract)', () => {
  it('can be implemented and resolves locations and residents', async () => {
    const repository: LocationRepository = {
      getLocations: ({ page }) =>
        Promise.resolve({
          locations: [],
          page,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }),
      getLocationById: ({ id }) => Promise.resolve({ ...LOCATION, id }),
      getCharactersByIds: ({ ids }) => Promise.resolve(ids.map((id) => ({ ...CHARACTER, id }))),
    };

    const page = await repository.getLocations({ page: 1, filters: {} });
    const location = await repository.getLocationById({ id: 5 });
    const residents = await repository.getCharactersByIds({ ids: [1, 2] });

    expect(page).toMatchObject({ page: 1, locations: [] });
    expect(location.id).toBe(5);
    expect(residents).toHaveLength(2);
  });
});
