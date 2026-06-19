import { describe, expect, it } from 'vitest';

import { createGetEpisodeDetailUseCase } from '@/application/use-cases/get-episode-detail.use-case';
import {
  CharacterGender,
  CharacterStatus,
  type Character,
} from '@/core/domain/entities/character.entity';
import type { Episode } from '@/core/domain/entities/episode.entity';
import type {
  EpisodeRepository,
  GetCharactersByIdsQuery,
} from '@/core/domain/repositories/episode.repository';
import { HttpError } from '@/shared/errors/http.error';

const EPISODE: Episode = {
  id: 1,
  name: 'Pilot',
  code: 'S01E01',
  airDate: 'December 2, 2013',
  characterIds: [1, 2],
};

const CHARACTERS: Character[] = [
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

interface SetupOptions {
  getEpisodeById: () => Promise<Episode>;
  characters?: Character[];
}

function setup({ getEpisodeById, characters = [] }: SetupOptions) {
  const characterQueries: GetCharactersByIdsQuery[] = [];
  const repository: EpisodeRepository = {
    getEpisodes: () => {
      throw new Error('Not exercised by the detail use case.');
    },
    getEpisodeById,
    getCharactersByIds: (query) => {
      characterQueries.push(query);
      return Promise.resolve(characters);
    },
  };

  return { useCase: createGetEpisodeDetailUseCase({ repository }), characterQueries };
}

describe('createGetEpisodeDetailUseCase', () => {
  it('returns no characters and skips the second fetch when characterIds is empty', async () => {
    const episode: Episode = { ...EPISODE, characterIds: [] };
    const { useCase, characterQueries } = setup({
      getEpisodeById: () => Promise.resolve(episode),
    });

    const detail = await useCase.execute({ id: 1 });

    expect(detail.episode).toEqual(episode);
    expect(detail.characters).toEqual([]);
    expect(characterQueries).toHaveLength(0);
  });

  it('fetches the characters for the episode ids and forwards the signal', async () => {
    const controller = new AbortController();
    const { useCase, characterQueries } = setup({
      getEpisodeById: () => Promise.resolve(EPISODE),
      characters: CHARACTERS,
    });

    const detail = await useCase.execute({ id: 1, signal: controller.signal });

    expect(detail.characters).toEqual(CHARACTERS);
    expect(characterQueries).toHaveLength(1);
    expect(characterQueries[0]?.ids).toEqual(EPISODE.characterIds);
    expect(characterQueries[0]?.signal).toBe(controller.signal);
  });

  it('propagates a 404 from getEpisodeById unchanged', async () => {
    const notFound = new HttpError(404, 'Episode not found');
    const { useCase, characterQueries } = setup({
      getEpisodeById: () => Promise.reject(notFound),
    });

    const error = await useCase.execute({ id: 999 }).catch((reason: unknown) => reason);

    expect(error).toBe(notFound);
    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(404);
    expect(characterQueries).toHaveLength(0);
  });
});
