import { describe, expect, it } from 'vitest';

import { createGetLocationsUseCase } from '@/application/use-cases/get-locations.use-case';
import type {
  GetLocationsQuery,
  LocationPage,
  LocationRepository,
} from '@/core/domain/repositories/location.repository';

const EMPTY_PAGE: LocationPage = {
  locations: [],
  page: 1,
  totalPages: 0,
  totalCount: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

function setup() {
  const queries: GetLocationsQuery[] = [];
  const repository: LocationRepository = {
    getLocations(query) {
      queries.push(query);
      return Promise.resolve(EMPTY_PAGE);
    },
    getLocationById: () => {
      throw new Error('Not exercised by the get-locations use case.');
    },
    getCharactersByIds: () => {
      throw new Error('Not exercised by the get-locations use case.');
    },
  };

  return { useCase: createGetLocationsUseCase({ repository }), queries };
}

describe('createGetLocationsUseCase', () => {
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

  it('trims and drops blank name/type/dimension filters', async () => {
    const { useCase, queries } = setup();

    await useCase.execute({ filters: { name: '  Earth  ', type: 'Planet', dimension: '   ' } });

    expect(queries.at(-1)?.filters).toEqual({ name: 'Earth', type: 'Planet' });
  });

  it('forwards name, type, and dimension filters', async () => {
    const { useCase, queries } = setup();

    await useCase.execute({
      filters: { name: 'Earth', type: 'Planet', dimension: 'Dimension C-137' },
    });

    expect(queries.at(-1)?.filters).toEqual({
      name: 'Earth',
      type: 'Planet',
      dimension: 'Dimension C-137',
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
