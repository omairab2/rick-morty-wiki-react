import { describe, expect, it } from 'vitest';

import type { GetLocationsListResponseDto, LocationApiDto } from '@/application/dto/location.dto';
import { mapLocation, mapLocationPage } from '@/infrastructure/mappers/location.mapper';

const LOCATION_DTO: LocationApiDto = {
  id: 1,
  name: 'Earth (C-137)',
  type: 'Planet',
  dimension: 'Dimension C-137',
  residents: [
    'https://rickandmortyapi.com/api/character/1',
    'https://rickandmortyapi.com/api/character/2',
  ],
  url: 'https://rickandmortyapi.com/api/location/1',
  created: '2017-11-10T12:42:04.162Z',
};

describe('mapLocation', () => {
  it('maps an API location DTO and derives residentIds from the residents URLs', () => {
    expect(mapLocation(LOCATION_DTO)).toEqual({
      id: 1,
      name: 'Earth (C-137)',
      type: 'Planet',
      dimension: 'Dimension C-137',
      residentIds: [1, 2],
    });
  });
});

describe('mapLocationPage', () => {
  it('maps the list response to a domain LocationPage', () => {
    const dto: GetLocationsListResponseDto = {
      info: {
        count: 126,
        pages: 7,
        next: 'https://rickandmortyapi.com/api/location?page=2',
        prev: null,
      },
      results: [LOCATION_DTO],
    };

    expect(mapLocationPage({ dto, requestedPage: 1 })).toMatchObject({
      page: 1,
      totalPages: 7,
      totalCount: 126,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });
});
