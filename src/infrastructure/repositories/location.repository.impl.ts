import { normalizeCharactersResponse } from '@/application/dto/character.dto';
import {
  normalizeLocationsResponse,
  type GetLocationsRequestDto,
} from '@/application/dto/location.dto';
import type { Character } from '@/core/domain/entities/character.entity';
import type { Location } from '@/core/domain/entities/location.entity';
import type {
  GetCharactersByIdsQuery,
  GetLocationByIdQuery,
  GetLocationsQuery,
  LocationFilters,
  LocationPage,
  LocationRepository,
} from '@/core/domain/repositories/location.repository';
import { rickMortyClient } from '@/infrastructure/api/rick-morty.client';
import { mapCharacter } from '@/infrastructure/mappers/character.mapper';
import { mapLocation, mapLocationPage } from '@/infrastructure/mappers/location.mapper';
import { HttpError } from '@/shared/errors/http.error';

const NOT_FOUND_STATUS = 404;

interface ToRequestDtoArgs {
  page: number;
  filters: LocationFilters;
}

/**
 * The API answers `404` when a filter (or an out-of-range page) matches nothing.
 * That is an empty result, not a failure, so it maps to an empty page.
 */
function emptyLocationPage(page: number): LocationPage {
  return {
    locations: [],
    page,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };
}

/**
 * Translate a domain query into the API request DTO. `name`, `type`, and
 * `dimension` map straight to the API's query params (free-text, partial match).
 */
function toRequestDto({ page, filters }: ToRequestDtoArgs): GetLocationsRequestDto {
  const request: GetLocationsRequestDto = { page };

  if (filters.name) {
    request.name = filters.name;
  }
  if (filters.type) {
    request.type = filters.type;
  }
  if (filters.dimension) {
    request.dimension = filters.dimension;
  }

  return request;
}

/**
 * Concrete {@link LocationRepository} backed by the Rick & Morty API. It uses the
 * shared HTTP client and mappers directly — it never depends on
 * `CharacterRepository`, even though it fetches residents for the detail view.
 * Forwards the abort `signal`; HTTP errors (e.g. a 404) propagate unchanged.
 */
export function createLocationRepository(): LocationRepository {
  return {
    async getLocations({ page, filters, signal }: GetLocationsQuery): Promise<LocationPage> {
      const request = toRequestDto({ page, filters });

      try {
        const response = await rickMortyClient.fetchLocations({ request, signal });

        return mapLocationPage({ dto: response, requestedPage: page });
      } catch (error) {
        if (error instanceof HttpError && error.status === NOT_FOUND_STATUS) {
          return emptyLocationPage(page);
        }

        throw error;
      }
    },

    async getLocationById({ id, signal }: GetLocationByIdQuery): Promise<Location> {
      // The `/location/:id` endpoint returns a single object; reuse the by-ids
      // call with one id and take the first (normalized) result.
      const response = await rickMortyClient.fetchLocationsByIds({ ids: [id], signal });
      const [locationDto] = normalizeLocationsResponse(response);

      return mapLocation(locationDto);
    },

    async getCharactersByIds({ ids, signal }: GetCharactersByIdsQuery): Promise<Character[]> {
      if (ids.length === 0) {
        return [];
      }

      const response = await rickMortyClient.fetchCharactersByIds({ ids, signal });

      return normalizeCharactersResponse(response).map(mapCharacter);
    },
  };
}
