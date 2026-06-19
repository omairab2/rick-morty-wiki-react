/**
 * Raw episode object returned by the Rick & Morty API.
 * @see https://rickandmortyapi.com/documentation/#episode-schema
 */
export interface EpisodeApiDto {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

/**
 * Query parameters accepted by the Rick & Morty `/episode` list endpoint.
 * Mirrors the API contract exactly: every key is an accepted query-string param.
 * @see https://rickandmortyapi.com/documentation/#filter-episodes
 */
export interface GetEpisodesRequestDto {
  name?: string;
  episode?: string;
  page?: number;
}

/**
 * The exact set of accepted query-string keys, kept in sync with
 * {@link GetEpisodesRequestDto} at compile time via `satisfies`.
 */
export const EPISODE_REQUEST_PARAM_KEYS = [
  'name',
  'episode',
  'page',
] as const satisfies ReadonlyArray<keyof GetEpisodesRequestDto>;

/**
 * Response shape of `/episode/:ids`: the API returns a single object when one
 * id is requested and an array when several are.
 */
export type GetEpisodesResponseDto = EpisodeApiDto | EpisodeApiDto[];

/**
 * Normalize the `/episode/:ids` response to always be an array, regardless of
 * whether one or many episodes were requested.
 */
export function normalizeEpisodesResponse(response: GetEpisodesResponseDto): EpisodeApiDto[] {
  return Array.isArray(response) ? response : [response];
}

/**
 * Pagination metadata block returned by the API.
 */
export interface EpisodePageInfoApiDto {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

/**
 * Full response body of the `/episode` list endpoint.
 */
export interface GetEpisodesListResponseDto {
  info: EpisodePageInfoApiDto;
  results: EpisodeApiDto[];
}
