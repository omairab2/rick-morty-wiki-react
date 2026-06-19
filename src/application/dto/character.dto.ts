/**
 * Query parameters accepted by the Rick & Morty `/character` endpoint. Mirrors
 * the API contract exactly: every key here is an accepted query-string param.
 * @see https://rickandmortyapi.com/documentation/#filter-characters
 */
export interface GetCharactersRequestDto {
  name?: string;
  status?: string;
  gender?: string;
  species?: string;
  page?: number;
}

/**
 * The exact set of accepted query-string keys, kept in sync with
 * {@link GetCharactersRequestDto} at compile time via `satisfies`.
 */
export const CHARACTER_REQUEST_PARAM_KEYS = [
  'name',
  'status',
  'gender',
  'species',
  'page',
] as const satisfies ReadonlyArray<keyof GetCharactersRequestDto>;

/**
 * Reference to a place (origin / location) as returned by the API.
 */
export interface CharacterPlaceApiDto {
  name: string;
  url: string;
}

/**
 * Raw character object returned by the API. Strings are intentionally loose
 * (`status`, `gender`) — the mapper narrows them to domain value objects.
 */
export interface CharacterApiDto {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: CharacterPlaceApiDto;
  location: CharacterPlaceApiDto;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

/**
 * Pagination metadata block returned by the API.
 */
export interface CharacterPageInfoApiDto {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

/**
 * Full response body of the `/character` list endpoint.
 */
export interface GetCharactersResponseDto {
  info: CharacterPageInfoApiDto;
  results: CharacterApiDto[];
}

/**
 * Response shape of `/character/:ids`: a single object for one id and an array
 * for several (same convention as the `/episode/:ids` endpoint).
 */
export type GetCharactersByIdsResponseDto = CharacterApiDto | CharacterApiDto[];

/**
 * Normalize the `/character/:ids` response to always be an array.
 */
export function normalizeCharactersResponse(
  response: GetCharactersByIdsResponseDto,
): CharacterApiDto[] {
  return Array.isArray(response) ? response : [response];
}
