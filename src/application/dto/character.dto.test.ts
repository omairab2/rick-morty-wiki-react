import { describe, expect, it } from 'vitest';

import {
  CHARACTER_REQUEST_PARAM_KEYS,
  type GetCharactersRequestDto,
  type GetCharactersResponseDto,
} from '@/application/dto/character.dto';

describe('CHARACTER_REQUEST_PARAM_KEYS', () => {
  it('matches exactly the query params the Rick & Morty API accepts', () => {
    expect([...CHARACTER_REQUEST_PARAM_KEYS]).toEqual([
      'name',
      'status',
      'gender',
      'species',
      'page',
    ]);
  });
});

describe('character DTOs', () => {
  it('models a request with only the accepted API query params', () => {
    const request: GetCharactersRequestDto = {
      name: 'Rick',
      status: 'alive',
      gender: 'male',
      species: 'Human',
      page: 2,
    };

    expect(Object.keys(request)).toEqual([...CHARACTER_REQUEST_PARAM_KEYS]);
  });

  it('models the API list response shape', () => {
    const response: GetCharactersResponseDto = {
      info: {
        count: 826,
        pages: 42,
        next: 'https://rickandmortyapi.com/api/character?page=2',
        prev: null,
      },
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          type: '',
          gender: 'Male',
          origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
          location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
          image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          episode: ['https://rickandmortyapi.com/api/episode/1'],
          url: 'https://rickandmortyapi.com/api/character/1',
          created: '2017-11-04T18:48:46.250Z',
        },
      ],
    };

    expect(response.results).toHaveLength(1);
    expect(response.info.count).toBe(826);
  });
});
