import { http, HttpResponse, type RequestHandler } from 'msw';

import type { CharacterApiDto, GetCharactersResponseDto } from '@/application/dto/character.dto';
import { env } from '@/shared/config/env';

const CHARACTER_ENDPOINT = `${env.apiBaseUrl}/character`;

const RICK: CharacterApiDto = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
  location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [
    'https://rickandmortyapi.com/api/episode/1',
    'https://rickandmortyapi.com/api/episode/2',
  ],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z',
};

const MORTY: CharacterApiDto = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'unknown', url: '' },
  location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
  image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/2',
  created: '2017-11-04T18:50:21.651Z',
};

/**
 * Successful single-page list with two characters. Reused by tests that need a
 * known response body.
 */
export const characterListResponse: GetCharactersResponseDto = {
  info: { count: 2, pages: 1, next: null, prev: null },
  results: [RICK, MORTY],
};

/** Scenario 1: a successful `/character` response with at least two characters. */
export const characterSuccessHandler = http.get(CHARACTER_ENDPOINT, () =>
  HttpResponse.json(characterListResponse),
);

/** Scenario 2: a 404 response, mirroring how the API answers when nothing matches. */
export const characterNotFoundHandler = http.get(CHARACTER_ENDPOINT, () =>
  HttpResponse.json({ error: 'There is nothing here' }, { status: 404 }),
);

/**
 * Default handlers shared by the browser worker and the test server. The happy
 * path is active by default; tests opt into the 404 path with
 * `server.use(characterNotFoundHandler)`.
 */
export const handlers: RequestHandler[] = [characterSuccessHandler];
