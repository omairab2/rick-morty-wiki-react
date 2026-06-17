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
