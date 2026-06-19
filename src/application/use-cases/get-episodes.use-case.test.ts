import { describe, expect, it } from 'vitest';

import { createGetEpisodesUseCase } from '@/application/use-cases/get-episodes.use-case';
import type {
  EpisodePage,
  EpisodeRepository,
  GetEpisodesQuery,
} from '@/core/domain/repositories/episode.repository';

const EMPTY_PAGE: EpisodePage = {
  episodes: [],
  page: 1,
  totalPages: 0,
  totalCount: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

function setup() {
  const queries: GetEpisodesQuery[] = [];
  const repository: EpisodeRepository = {
    getEpisodes(query) {
      queries.push(query);
      return Promise.resolve(EMPTY_PAGE);
    },
    getEpisodeById: () => {
      throw new Error('Not exercised by the get-episodes use case.');
    },
    getCharactersByIds: () => {
      throw new Error('Not exercised by the get-episodes use case.');
    },
  };

  return { useCase: createGetEpisodesUseCase({ repository }), queries };
}

describe('createGetEpisodesUseCase', () => {
  it('keeps a valid page number', async () => {
    const { useCase, queries } = setup();

    await useCase.execute({ page: 3 });

    expect(queries.at(-1)?.page).toBe(3);
  });

  it('sanitizes zero, negative, NaN, and undefined pages to 1', async () => {
    const invalidPages: Array<number | undefined> = [
      0,
      -5,
      Number.NaN,
      Number.POSITIVE_INFINITY,
      undefined,
    ];

    for (const page of invalidPages) {
      const { useCase, queries } = setup();

      await useCase.execute({ page });

      expect(queries.at(-1)?.page).toBe(1);
    }
  });

  it('truncates fractional pages', async () => {
    const { useCase, queries } = setup();

    await useCase.execute({ page: 2.9 });

    expect(queries.at(-1)?.page).toBe(2);
  });

  it('trims and drops blank name/code filters', async () => {
    const { useCase, queries } = setup();

    await useCase.execute({ filters: { name: '  Pilot  ', code: '   ' } });

    expect(queries.at(-1)?.filters).toEqual({ name: 'Pilot' });
  });

  it('forwards name and code filters', async () => {
    const { useCase, queries } = setup();

    await useCase.execute({ filters: { name: 'Pilot', code: 'S01' } });

    expect(queries.at(-1)?.filters).toEqual({ name: 'Pilot', code: 'S01' });
  });

  it('defaults to page 1 and no filters when called with no input', async () => {
    const { useCase, queries } = setup();

    await useCase.execute();

    expect(queries.at(-1)).toMatchObject({ page: 1, filters: {} });
  });

  it('forwards the abort signal', async () => {
    const { useCase, queries } = setup();
    const controller = new AbortController();

    await useCase.execute({ signal: controller.signal });

    expect(queries.at(-1)?.signal).toBe(controller.signal);
  });

  it('returns the page produced by the repository', async () => {
    const { useCase } = setup();

    await expect(useCase.execute()).resolves.toEqual(EMPTY_PAGE);
  });
});
