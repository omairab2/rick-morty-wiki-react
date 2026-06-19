import { describe, expect, it } from 'vitest';

import { createGetLocationDetailUseCase } from '@/application/use-cases/get-location-detail.use-case';
import {
  CharacterGender,
  CharacterStatus,
  type Character,
} from '@/core/domain/entities/character.entity';
import type { Location } from '@/core/domain/entities/location.entity';
import type {
  GetCharactersByIdsQuery,
  LocationRepository,
} from '@/core/domain/repositories/location.repository';
import { HttpError } from '@/shared/errors/http.error';

const LOCATION: Location = {
  id: 1,
  name: 'Earth (C-137)',
  type: 'Planet',
  dimension: 'Dimension C-137',
  residentIds: [1, 2],
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

interface SetupOptions {
  getLocationById: () => Promise<Location>;
  residents?: Character[];
}

function setup({ getLocationById, residents = [] }: SetupOptions) {
  const characterQueries: GetCharactersByIdsQuery[] = [];
  const repository: LocationRepository = {
    getLocations: () => {
      throw new Error('Not exercised by the detail use case.');
    },
    getLocationById,
    getCharactersByIds: (query) => {
      characterQueries.push(query);
      return Promise.resolve(residents);
    },
  };

  return { useCase: createGetLocationDetailUseCase({ repository }), characterQueries };
}

describe('createGetLocationDetailUseCase', () => {
  it('returns no residents and skips the second fetch when residentIds is empty', async () => {
    const location: Location = { ...LOCATION, residentIds: [] };
    const { useCase, characterQueries } = setup({
      getLocationById: () => Promise.resolve(location),
    });

    const detail = await useCase.execute({ id: 1 });

    expect(detail.location).toEqual(location);
    expect(detail.residents).toEqual([]);
    expect(characterQueries).toHaveLength(0);
  });

  it('fetches the residents for the location ids and forwards the signal', async () => {
    const controller = new AbortController();
    const { useCase, characterQueries } = setup({
      getLocationById: () => Promise.resolve(LOCATION),
      residents: RESIDENTS,
    });

    const detail = await useCase.execute({ id: 1, signal: controller.signal });

    expect(detail.residents).toEqual(RESIDENTS);
    expect(characterQueries).toHaveLength(1);
    expect(characterQueries[0]?.ids).toEqual(LOCATION.residentIds);
    expect(characterQueries[0]?.signal).toBe(controller.signal);
  });

  it('propagates a 404 from getLocationById unchanged', async () => {
    const notFound = new HttpError(404, 'Location not found');
    const { useCase, characterQueries } = setup({
      getLocationById: () => Promise.reject(notFound),
    });

    const error = await useCase.execute({ id: 999 }).catch((reason: unknown) => reason);

    expect(error).toBe(notFound);
    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(404);
    expect(characterQueries).toHaveLength(0);
  });
});
