/**
 * Domain entity for a Rick & Morty episode. `code` is the season/episode code
 * (e.g. "S01E01"); `airDate` is the human-readable air date returned by the API.
 */
export interface Episode {
  id: number;
  name: string;
  code: string;
  airDate: string;
}
