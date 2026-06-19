import { http, HttpResponse, type RequestHandler } from 'msw';

import type { CharacterApiDto, GetCharactersResponseDto } from '@/application/dto/character.dto';
import type { EpisodeApiDto } from '@/application/dto/episode.dto';
import type { LocationApiDto } from '@/application/dto/location.dto';
import { env } from '@/shared/config/env';

const CHARACTER_ENDPOINT = `${env.apiBaseUrl}/character`;
const EPISODE_ENDPOINT = `${env.apiBaseUrl}/episode`;
const LOCATION_ENDPOINT = `${env.apiBaseUrl}/location`;
const NOT_FOUND_CHARACTER_ID = '9999';
const NOT_FOUND_EPISODE_ID = '9999';
const NOT_FOUND_LOCATION_ID = '9999';

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

function buildCharacterApiDto(id: number): CharacterApiDto {
  if (id === RICK.id) {
    return RICK;
  }
  if (id === MORTY.id) {
    return MORTY;
  }

  return {
    ...RICK,
    id,
    name: `Character ${id}`,
    image: `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`,
    url: `https://rickandmortyapi.com/api/character/${id}`,
  };
}

function buildEpisodeApiDto(id: number): EpisodeApiDto {
  return {
    id,
    name: `Episode ${id}`,
    air_date: 'December 2, 2013',
    episode: `S01E${String(id).padStart(2, '0')}`,
    characters: [
      'https://rickandmortyapi.com/api/character/1',
      'https://rickandmortyapi.com/api/character/2',
    ],
    url: `https://rickandmortyapi.com/api/episode/${id}`,
    created: '2017-11-10T12:56:33.798Z',
  };
}

function buildLocationApiDto(id: number): LocationApiDto {
  return {
    id,
    name: `Location ${id}`,
    type: 'Planet',
    dimension: 'Dimension C-137',
    residents: [
      'https://rickandmortyapi.com/api/character/1',
      'https://rickandmortyapi.com/api/character/2',
    ],
    url: `https://rickandmortyapi.com/api/location/${id}`,
    created: '2017-11-10T12:42:04.162Z',
  };
}

/** Episodes across two seasons, used by the list handler for filtering. */
const EPISODE_LIST: EpisodeApiDto[] = [
  { ...buildEpisodeApiDto(1), name: 'Pilot', episode: 'S01E01' },
  { ...buildEpisodeApiDto(2), name: 'Lawnmower Dog', episode: 'S01E02' },
  { ...buildEpisodeApiDto(11), name: 'A Rickle in Time', episode: 'S02E01' },
];

/** Locations with varied name/type/dimension, used by the list handler. */
const LOCATION_LIST: LocationApiDto[] = [
  {
    ...buildLocationApiDto(1),
    name: 'Earth (C-137)',
    type: 'Planet',
    dimension: 'Dimension C-137',
  },
  { ...buildLocationApiDto(2), name: 'Abadango', type: 'Cluster', dimension: 'unknown' },
  {
    ...buildLocationApiDto(3),
    name: 'Citadel of Ricks',
    type: 'Space station',
    dimension: 'unknown',
  },
];

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

/**
 * `/character/:ids` — single object for one id, array for several. 404 if any
 * requested id is the reserved missing id.
 */
export const characterByIdHandler = http.get(`${CHARACTER_ENDPOINT}/:id`, ({ params }) => {
  const ids = String(params.id).split(',');
  if (ids.includes(NOT_FOUND_CHARACTER_ID)) {
    return HttpResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  const characters = ids.map((id) => buildCharacterApiDto(Number(id)));

  return HttpResponse.json(characters.length === 1 ? characters[0] : characters);
});

/** `/episode` — list, filterable by `name` and `episode` (code) query params. */
export const episodesListHandler = http.get(EPISODE_ENDPOINT, ({ request }) => {
  const url = new URL(request.url);
  const name = (url.searchParams.get('name') ?? '').toLowerCase();
  const code = (url.searchParams.get('episode') ?? '').toLowerCase();

  const results = EPISODE_LIST.filter(
    (episode) =>
      episode.name.toLowerCase().includes(name) && episode.episode.toLowerCase().includes(code),
  );

  return HttpResponse.json({
    info: { count: results.length, pages: results.length > 0 ? 1 : 0, next: null, prev: null },
    results,
  });
});

/**
 * `/episode/:ids` — single object for one id, array for several. 404 if any
 * requested id is the reserved missing id.
 */
export const episodesByIdsHandler = http.get(`${EPISODE_ENDPOINT}/:ids`, ({ params }) => {
  const ids = String(params.ids).split(',');
  if (ids.includes(NOT_FOUND_EPISODE_ID)) {
    return HttpResponse.json({ error: 'Episode not found' }, { status: 404 });
  }

  const episodes = ids.map((id) => buildEpisodeApiDto(Number(id)));

  return HttpResponse.json(episodes.length === 1 ? episodes[0] : episodes);
});

/** `/location` — list, filterable by `name`, `type`, and `dimension` query params. */
export const locationsListHandler = http.get(LOCATION_ENDPOINT, ({ request }) => {
  const url = new URL(request.url);
  const name = (url.searchParams.get('name') ?? '').toLowerCase();
  const type = (url.searchParams.get('type') ?? '').toLowerCase();
  const dimension = (url.searchParams.get('dimension') ?? '').toLowerCase();

  const results = LOCATION_LIST.filter(
    (location) =>
      location.name.toLowerCase().includes(name) &&
      location.type.toLowerCase().includes(type) &&
      location.dimension.toLowerCase().includes(dimension),
  );

  return HttpResponse.json({
    info: { count: results.length, pages: results.length > 0 ? 1 : 0, next: null, prev: null },
    results,
  });
});

/**
 * `/location/:ids` — single object for one id, array for several. 404 if any
 * requested id is the reserved missing id.
 */
export const locationsByIdsHandler = http.get(`${LOCATION_ENDPOINT}/:ids`, ({ params }) => {
  const ids = String(params.ids).split(',');
  if (ids.includes(NOT_FOUND_LOCATION_ID)) {
    return HttpResponse.json({ error: 'Location not found' }, { status: 404 });
  }

  const locations = ids.map((id) => buildLocationApiDto(Number(id)));

  return HttpResponse.json(locations.length === 1 ? locations[0] : locations);
});

/**
 * Default handlers shared by the browser worker and the test server. The happy
 * paths are active by default; tests opt into the 404 list path with
 * `server.use(characterNotFoundHandler)`.
 */
export const handlers: RequestHandler[] = [
  characterSuccessHandler,
  characterByIdHandler,
  episodesListHandler,
  episodesByIdsHandler,
  locationsListHandler,
  locationsByIdsHandler,
];
