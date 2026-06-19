import type { GetLocationsListResponseDto, LocationApiDto } from '@/application/dto/location.dto';
import type { Location } from '@/core/domain/entities/location.entity';
import type { LocationPage } from '@/core/domain/repositories/location.repository';

/**
 * Extract the trailing numeric id from a resource URL
 * (e.g. ".../character/42" → 42). Invalid segments yield `NaN`.
 */
function extractIdFromUrl(url: string): number {
  return Number.parseInt(url.split('/').pop() ?? '', 10);
}

/**
 * Map a raw API location DTO to the domain entity, deriving `residentIds` from
 * the `residents` URLs.
 */
export function mapLocation(dto: LocationApiDto): Location {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    dimension: dto.dimension,
    residentIds: dto.residents.map(extractIdFromUrl).filter((id) => !Number.isNaN(id)),
  };
}

export interface MapLocationPageArgs {
  dto: GetLocationsListResponseDto;
  requestedPage: number;
}

/**
 * Map the API list response to a domain {@link LocationPage}, deriving the
 * pagination flags from the API's `next`/`prev` links.
 */
export function mapLocationPage({ dto, requestedPage }: MapLocationPageArgs): LocationPage {
  return {
    locations: dto.results.map(mapLocation),
    page: requestedPage,
    totalPages: dto.info.pages,
    totalCount: dto.info.count,
    hasNextPage: dto.info.next !== null,
    hasPreviousPage: dto.info.prev !== null,
  };
}
