/**
 * Raw location object returned by the Rick & Morty API.
 * @see https://rickandmortyapi.com/documentation/#location-schema
 */
export interface LocationApiDto {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

/**
 * Query parameters accepted by the `/location` list endpoint. Mirrors the API
 * contract exactly: every key is an accepted query-string param.
 * @see https://rickandmortyapi.com/documentation/#filter-locations
 */
export interface GetLocationsRequestDto {
  name?: string;
  type?: string;
  dimension?: string;
  page?: number;
}

/**
 * The exact set of accepted query-string keys, kept in sync with
 * {@link GetLocationsRequestDto} at compile time via `satisfies`.
 */
export const LOCATION_REQUEST_PARAM_KEYS = [
  'name',
  'type',
  'dimension',
  'page',
] as const satisfies ReadonlyArray<keyof GetLocationsRequestDto>;

/**
 * Response shape of `/location/:ids`: a single object for one id and an array
 * for several (same convention as the characters/episodes endpoints).
 */
export type GetLocationsByIdsResponseDto = LocationApiDto | LocationApiDto[];

/**
 * Normalize the `/location/:ids` response to always be an array.
 */
export function normalizeLocationsResponse(
  response: GetLocationsByIdsResponseDto,
): LocationApiDto[] {
  return Array.isArray(response) ? response : [response];
}

/**
 * Pagination metadata block returned by the API.
 */
export interface LocationPageInfoApiDto {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

/**
 * Full response body of the `/location` list endpoint.
 */
export interface GetLocationsListResponseDto {
  info: LocationPageInfoApiDto;
  results: LocationApiDto[];
}
