import { describe, expect, it } from 'vitest';

import { createGetCharacterDetailUseCase } from '@/application/use-cases/get-character-detail.use-case';
import {
  CharacterGender,
  CharacterStatus,
  type Character,
} from '@/core/domain/entities/character.entity';
import type { Episode } from '@/core/domain/entities/episode.entity';
import type {
  CharacterRepository,
  GetEpisodesByIdsQuery,
} from '@/core/domain/repositories/character.repository';
import { HttpError } from '@/shared/errors/http.error';

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

const EPISODES: Episode[] = [
  { id: 1, name: 'Pilot', code: 'S01E01', airDate: 'December 2, 2013' },
  { id: 2, name: 'Lawnmower Dog', code: 'S01E02', airDate: 'December 9, 2013' },
];

interface SetupOptions {
  getCharacterById: () => Promise<Character>;
  episodes?: Episode[];
}

function setup({ getCharacterById, episodes = [] }: SetupOptions) {
  const episodeQueries: GetEpisodesByIdsQuery[] = [];
  const repository: CharacterRepository = {
    getCharacters: () => {
      throw new Error('Not exercised by the detail use case.');
    },
    getCharacterById,
    getEpisodesByIds: (query) => {
      episodeQueries.push(query);
      return Promise.resolve(episodes);
    },
  };

  return { useCase: createGetCharacterDetailUseCase({ repository }), episodeQueries };
}

describe('createGetCharacterDetailUseCase', () => {
  it('returns no episodes and skips the second fetch when episodeIds is empty', async () => {
    const character: Character = { ...CHARACTER, episodeIds: [] };
    const { useCase, episodeQueries } = setup({
      getCharacterById: () => Promise.resolve(character),
    });

    const detail = await useCase.execute({ id: 1 });

    expect(detail.character).toEqual(character);
    expect(detail.episodes).toEqual([]);
    expect(episodeQueries).toHaveLength(0);
  });

  it('fetches the episodes for the character ids and forwards the signal', async () => {
    const controller = new AbortController();
    const { useCase, episodeQueries } = setup({
      getCharacterById: () => Promise.resolve(CHARACTER),
      episodes: EPISODES,
    });

    const detail = await useCase.execute({ id: 1, signal: controller.signal });

    expect(detail.episodes).toEqual(EPISODES);
    expect(episodeQueries).toHaveLength(1);
    expect(episodeQueries[0]?.ids).toEqual(CHARACTER.episodeIds);
    expect(episodeQueries[0]?.signal).toBe(controller.signal);
  });

  it('propagates a 404 from getCharacterById unchanged', async () => {
    const notFound = new HttpError(404, 'Character not found');
    const { useCase, episodeQueries } = setup({
      getCharacterById: () => Promise.reject(notFound),
    });

    const error = await useCase.execute({ id: 999 }).catch((reason: unknown) => reason);

    expect(error).toBe(notFound);
    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(404);
    expect(episodeQueries).toHaveLength(0);
  });
});
