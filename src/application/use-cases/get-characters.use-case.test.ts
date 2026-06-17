import { describe, expect, it } from 'vitest';

import { createGetCharactersUseCase } from '@/application/use-cases/get-characters.use-case';
import { CharacterGender, CharacterStatus } from '@/core/domain/entities/character.entity';
import type {
  CharacterPage,
  CharacterRepository,
  GetCharactersQuery,
} from '@/core/domain/repositories/character.repository';

const EMPTY_PAGE: CharacterPage = {
  characters: [],
  page: 1,
  totalPages: 0,
  totalCount: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

function setup() {
  const queries: GetCharactersQuery[] = [];
  const repository: CharacterRepository = {
    getCharacters(query) {
      queries.push(query);
      return Promise.resolve(EMPTY_PAGE);
    },
    getCharacterById: () => {
      throw new Error('Not exercised by the get-characters use case.');
    },
    getEpisodesByIds: () => {
      throw new Error('Not exercised by the get-characters use case.');
    },
  };

  return { useCase: createGetCharactersUseCase({ repository }), queries };
}

describe('createGetCharactersUseCase', () => {
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

  it('trims the name filter and drops it when blank', async () => {
    const { useCase, queries } = setup();

    await useCase.execute({ filters: { name: '  Rick  ' } });
    expect(queries.at(-1)?.filters).toEqual({ name: 'Rick' });

    await useCase.execute({ filters: { name: '   ' } });
    expect(queries.at(-1)?.filters).toEqual({});
  });

  it('forwards status, gender, and species filters', async () => {
    const { useCase, queries } = setup();

    await useCase.execute({
      filters: {
        status: CharacterStatus.Alive,
        gender: CharacterGender.Female,
        species: 'Human',
      },
    });

    expect(queries.at(-1)?.filters).toEqual({
      status: 'Alive',
      gender: 'Female',
      species: 'Human',
    });
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
