import { http, HttpResponse, type RequestHandler } from 'msw';

import type { CharacterApiDto, GetCharactersResponseDto } from '@/application/dto/character.dto';
import type { EpisodeApiDto } from '@/application/dto/episode.dto';
import { env } from '@/shared/config/env';

const CHARACTER_ENDPOINT = `${env.apiBaseUrl}/character`;
const EPISODE_ENDPOINT = `${env.apiBaseUrl}/episode`;
const NOT_FOUND_CHARACTER_ID = '9999';

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

function buildEpisodeApiDto(id: number): EpisodeApiDto {
  return {
    id,
    name: `Episode ${id}`,
    air_date: 'December 2, 2013',
    episode: `S01E${String(id).padStart(2, '0')}`,
    characters: ['https://rickandmortyapi.com/api/character/1'],
    url: `https://rickandmortyapi.com/api/episode/${id}`,
    created: '2017-11-10T12:56:33.798Z',
  };
}

/**
 * Successful single-page list with two characters. Reused by tests that need a
 * known response body.
 */
export const characterListResponse: GetCharactersResponseDto = {
  info: { count: 2, pages: 1, next: null, prev: null },
  results: [RICK, MORTY],
};

/** `/character` — successful list with at least two characters. */
export const characterSuccessHandler = http.get(CHARACTER_ENDPOINT, () =>
  HttpResponse.json(characterListResponse),
);

/** `/character` — 404, mirroring how the API answers when nothing matches. */
export const characterNotFoundHandler = http.get(CHARACTER_ENDPOINT, () =>
  HttpResponse.json({ error: 'There is nothing here' }, { status: 404 }),
);

/** `/character/:id` — 404 for id `9999`, otherwise the Rick fixture. */
export const characterByIdHandler = http.get(`${CHARACTER_ENDPOINT}/:id`, ({ params }) => {
  if (params.id === NOT_FOUND_CHARACTER_ID) {
    return HttpResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  return HttpResponse.json(RICK);
});

/**
 * `/episode/:ids` — replicates the real API: returns a single object for one id
 * and an array for several.
 */
export const episodesByIdsHandler = http.get(`${EPISODE_ENDPOINT}/:ids`, ({ params }) => {
  const episodes = String(params.ids).split(',').map(Number).map(buildEpisodeApiDto);

  return HttpResponse.json(episodes.length === 1 ? episodes[0] : episodes);
});

/**
 * Default handlers shared by the browser worker and the test server. The happy
 * paths are active by default; tests opt into the 404 list path with
 * `server.use(characterNotFoundHandler)`.
 */
export const handlers: RequestHandler[] = [
  characterSuccessHandler,
  characterByIdHandler,
  episodesByIdsHandler,
];
