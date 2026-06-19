/**
 * Domain entity for a Rick & Morty episode. `code` is the season/episode code
 * (e.g. "S01E01"); `airDate` is the human-readable air date returned by the API.
 * `characterIds` holds the ids of the characters that appear in the episode
 * (used to fetch them on the detail page).
 */
export interface Episode {
  id: number;
  name: string;
  code: string;
  airDate: string;
  characterIds: number[];
}
