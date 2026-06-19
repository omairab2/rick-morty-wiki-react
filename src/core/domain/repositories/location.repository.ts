import type { Character } from '@/core/domain/entities/character.entity';
import type { Location } from '@/core/domain/entities/location.entity';

/**
 * Filter criteria for querying locations. All fields are optional and map to the
 * API's `name`, `type`, and `dimension` query params.
 */
export interface LocationFilters {
  name?: string;
  type?: string;
  dimension?: string;
}

/**
 * A single page of locations plus the pagination metadata the presentation
 * layer needs to render controls.
 */
export interface LocationPage {
  locations: Location[];
  page: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetLocationsQuery {
  page: number;
  filters: LocationFilters;
  signal?: AbortSignal;
}

export interface GetLocationByIdQuery {
  id: number;
  signal?: AbortSignal;
}

export interface GetCharactersByIdsQuery {
  ids: number[];
  signal?: AbortSignal;
}

/**
 * Port for the locations feature. Separate from `CharacterRepository` and
 * `EpisodeRepository`. It also exposes `getCharactersByIds` because the location
 * detail shows the residents that live there (mirrors the episodes feature).
 */
export interface LocationRepository {
  getLocations(query: GetLocationsQuery): Promise<LocationPage>;
  getLocationById(query: GetLocationByIdQuery): Promise<Location>;
  getCharactersByIds(query: GetCharactersByIdsQuery): Promise<Character[]>;
}
