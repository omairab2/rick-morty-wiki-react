import type {
  CharacterApiDto,
  GetCharactersByIdsResponseDto,
  GetCharactersRequestDto,
  GetCharactersResponseDto,
} from '@/application/dto/character.dto';
import type {
  GetEpisodesListResponseDto,
  GetEpisodesRequestDto,
  GetEpisodesResponseDto,
} from '@/application/dto/episode.dto';
import { httpClient } from '@/infrastructure/http/http-client';

const CHARACTER_RESOURCE_PATH = '/character';
const EPISODE_RESOURCE_PATH = '/episode';

/**
 * Build the `/character` query string from a request DTO, omitting any param
 * that is not set so the API receives only the filters that were provided.
 */
function buildCharacterQuery(request: GetCharactersRequestDto): string {
  const params = new URLSearchParams();

  if (request.name) {
    params.set('name', request.name);
  }
  if (request.status) {
    params.set('status', request.status);
  }
  if (request.gender) {
    params.set('gender', request.gender);
  }
  if (request.species) {
    params.set('species', request.species);
  }
  if (request.page !== undefined) {
    params.set('page', String(request.page));
  }

  const query = params.toString();

  return query ? `?${query}` : '';
}

/**
 * Build the `/episode` query string from a request DTO.
 */
function buildEpisodeQuery(request: GetEpisodesRequestDto): string {
  const params = new URLSearchParams();

  if (request.name) {
    params.set('name', request.name);
  }
  if (request.episode) {
    params.set('episode', request.episode);
  }
  if (request.page !== undefined) {
    params.set('page', String(request.page));
  }

  const query = params.toString();

  return query ? `?${query}` : '';
}

export interface FetchCharactersArgs {
  request: GetCharactersRequestDto;
  signal?: AbortSignal;
}

/**
 * Fetch a page of characters from the Rick & Morty API. Returns the raw
 * response DTO untouched — translation to the domain happens in the mapper.
 */
function fetchCharacters({
  request,
  signal,
}: FetchCharactersArgs): Promise<GetCharactersResponseDto> {
  const path = `${CHARACTER_RESOURCE_PATH}${buildCharacterQuery(request)}`;

  return httpClient.get<GetCharactersResponseDto>({ path, signal });
}

export interface FetchCharacterByIdArgs {
  id: number;
  signal?: AbortSignal;
}

/**
 * Fetch a single character by id (`/character/:id`).
 */
function fetchCharacterById({ id, signal }: FetchCharacterByIdArgs): Promise<CharacterApiDto> {
  return httpClient.get<CharacterApiDto>({ path: `${CHARACTER_RESOURCE_PATH}/${id}`, signal });
}

export interface FetchCharactersByIdsArgs {
  ids: number[];
  signal?: AbortSignal;
}

/**
 * Fetch characters by id (`/character/:ids`). The API returns a single object
 * for one id and an array for several; the DTO layer normalizes that.
 */
function fetchCharactersByIds({
  ids,
  signal,
}: FetchCharactersByIdsArgs): Promise<GetCharactersByIdsResponseDto> {
  return httpClient.get<GetCharactersByIdsResponseDto>({
    path: `${CHARACTER_RESOURCE_PATH}/${ids.join(',')}`,
    signal,
  });
}

export interface FetchEpisodesArgs {
  request: GetEpisodesRequestDto;
  signal?: AbortSignal;
}

/**
 * Fetch a page of episodes from the `/episode` list endpoint.
 */
function fetchEpisodes({
  request,
  signal,
}: FetchEpisodesArgs): Promise<GetEpisodesListResponseDto> {
  const path = `${EPISODE_RESOURCE_PATH}${buildEpisodeQuery(request)}`;

  return httpClient.get<GetEpisodesListResponseDto>({ path, signal });
}

export interface FetchEpisodesByIdsArgs {
  ids: number[];
  signal?: AbortSignal;
}

/**
 * Fetch episodes by id. Ids are passed as-is: the API returns a single object
 * for one id (`/episode/1`) and an array for several (`/episode/1,2`); the DTO
 * layer normalizes that to an array.
 */
function fetchEpisodesByIds({
  ids,
  signal,
}: FetchEpisodesByIdsArgs): Promise<GetEpisodesResponseDto> {
  return httpClient.get<GetEpisodesResponseDto>({
    path: `${EPISODE_RESOURCE_PATH}/${ids.join(',')}`,
    signal,
  });
}

export const rickMortyClient = {
  fetchCharacters,
  fetchCharacterById,
  fetchCharactersByIds,
  fetchEpisodes,
  fetchEpisodesByIds,
};
