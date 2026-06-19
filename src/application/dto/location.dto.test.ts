import { describe, expect, it } from 'vitest';

import {
  LOCATION_REQUEST_PARAM_KEYS,
  normalizeLocationsResponse,
  type LocationApiDto,
} from '@/application/dto/location.dto';

function buildLocation(overrides: Partial<LocationApiDto> = {}): LocationApiDto {
  return {
    id: 1,
    name: 'Earth (C-137)',
    type: 'Planet',
    dimension: 'Dimension C-137',
    residents: ['https://rickandmortyapi.com/api/character/1'],
    url: 'https://rickandmortyapi.com/api/location/1',
    created: '2017-11-10T12:42:04.162Z',
    ...overrides,
  };
}

describe('LOCATION_REQUEST_PARAM_KEYS', () => {
  it('matches exactly the query params the Rick & Morty /location endpoint accepts', () => {
    expect([...LOCATION_REQUEST_PARAM_KEYS]).toEqual(['name', 'type', 'dimension', 'page']);
  });
});

describe('normalizeLocationsResponse', () => {
  it('wraps a single location object into an array', () => {
    const location = buildLocation();

    expect(normalizeLocationsResponse(location)).toEqual([location]);
  });

  it('returns an array response unchanged', () => {
    const locations = [
      buildLocation({ id: 1 }),
      buildLocation({ id: 2, name: 'Citadel of Ricks' }),
    ];

    expect(normalizeLocationsResponse(locations)).toEqual(locations);
  });
});
