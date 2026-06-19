import type { Character } from '@/core/domain/entities/character.entity';
import type { Location } from '@/core/domain/entities/location.entity';
import type { LocationRepository } from '@/core/domain/repositories/location.repository';

export interface LocationDetail {
  location: Location;
  residents: Character[];
}

export interface GetLocationDetailInput {
  id: number;
  signal?: AbortSignal;
}

export interface GetLocationDetailUseCase {
  execute(input: GetLocationDetailInput): Promise<LocationDetail>;
}

export interface GetLocationDetailUseCaseDependencies {
  repository: LocationRepository;
}

/**
 * Application use case: fetch a location and the characters that live in it.
 *
 * The two fetches are sequential by necessity — the resident ids come from the
 * location. When the location has no residents, the second fetch is skipped.
 *
 * Errors from `getLocationById` (e.g. an `HttpError` with status 404) are not
 * caught here: they propagate unchanged so the presentation layer can tell
 * "not found" from a network/other error.
 */
export function createGetLocationDetailUseCase({
  repository,
}: GetLocationDetailUseCaseDependencies): GetLocationDetailUseCase {
  return {
    async execute({ id, signal }) {
      const location = await repository.getLocationById({ id, signal });

      if (location.residentIds.length === 0) {
        return { location, residents: [] };
      }

      const residents = await repository.getCharactersByIds({
        ids: location.residentIds,
        signal,
      });

      return { location, residents };
    },
  };
}
