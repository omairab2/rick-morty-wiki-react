import { describe, expect, it } from 'vitest';

import {
  CharacterGender,
  CharacterStatus,
  type Character,
} from '@/core/domain/entities/character.entity';
import type { Episode } from '@/core/domain/entities/episode.entity';
import type { EpisodeRepository } from '@/core/domain/repositories/episode.repository';

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

const EPISODE: Episode = {
  id: 1,
  name: 'Pilot',
  code: 'S01E01',
  airDate: 'December 2, 2013',
  characterIds: [1, 2],
};

describe('EpisodeRepository (port contract)', () => {
  it('can be implemented and resolves episodes and characters', async () => {
    const repository: EpisodeRepository = {
      getEpisodes: ({ page }) =>
        Promise.resolve({
          episodes: [],
          page,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }),
      getEpisodeById: ({ id }) => Promise.resolve({ ...EPISODE, id }),
      getCharactersByIds: ({ ids }) => Promise.resolve(ids.map((id) => ({ ...CHARACTER, id }))),
    };

    const page = await repository.getEpisodes({ page: 1, filters: {} });
    const episode = await repository.getEpisodeById({ id: 5 });
    const characters = await repository.getCharactersByIds({ ids: [1, 2] });

    expect(page).toMatchObject({ page: 1, episodes: [] });
    expect(episode.id).toBe(5);
    expect(characters).toHaveLength(2);
  });
});
