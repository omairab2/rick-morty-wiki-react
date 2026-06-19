/**
 * Domain entity for a Rick & Morty location. `type` (e.g. "Planet", "Space
 * station") and `dimension` (e.g. "Dimension C-137") come straight from the API.
 * `residentIds` holds the ids of the characters living there (used to fetch them
 * on the detail page).
 */
export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residentIds: number[];
}
