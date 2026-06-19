import { describe, expect, it } from 'vitest';

import {
  CharacterGender,
  CharacterStatus,
  type Character,
} from '@/core/domain/entities/character.entity';
import type { CharacterRepository } from '@/core/domain/repositories/character.repository';

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
  episodeCount: 2,
  episodeIds: [1, 2],
};

describe('CharacterRepository (port contract)', () => {
  it('can be implemented and resolves characters and episodes', async () => {
    const repository: CharacterRepository = {
      getCharacters: ({ page }) =>
        Promise.resolve({
          characters: [],
          page,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }),
      getCharacterById: ({ id }) => Promise.resolve({ ...CHARACTER, id }),
      getEpisodesByIds: ({ ids }) =>
        Promise.resolve(
          ids.map((id) => ({
            id,
            name: `Episode ${id}`,
            code: 'S01E01',
            airDate: '',
            characterIds: [],
          })),
        ),
    };

    const page = await repository.getCharacters({ page: 1, filters: {} });
    const character = await repository.getCharacterById({ id: 5 });
    const episodes = await repository.getEpisodesByIds({ ids: [1, 2] });

    expect(page).toMatchObject({ page: 1, characters: [] });
    expect(character.id).toBe(5);
    expect(episodes).toHaveLength(2);
  });
});
