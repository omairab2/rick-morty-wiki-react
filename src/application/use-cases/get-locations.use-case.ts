import type {
  LocationFilters,
  LocationPage,
  LocationRepository,
} from '@/core/domain/repositories/location.repository';

const FIRST_PAGE = 1;

/**
 * Clamp any page value to a valid 1-based integer. Invalid inputs — `0`,
 * negatives, fractionals, `NaN`, `Infinity`, `undefined` — fall back to the
 * first page.
 */
function normalizePage(page: number | undefined): number {
  if (page === undefined || !Number.isFinite(page)) {
    return FIRST_PAGE;
  }

  const truncated = Math.trunc(page);

  return truncated < FIRST_PAGE ? FIRST_PAGE : truncated;
}

/**
 * Drop empty/whitespace-only filters so they are never sent downstream.
 */
function normalizeFilters(filters: LocationFilters): LocationFilters {
  const normalized: LocationFilters = {};

  const name = filters.name?.trim();
  if (name) {
    normalized.name = name;
  }

  const type = filters.type?.trim();
  if (type) {
    normalized.type = type;
  }

  const dimension = filters.dimension?.trim();
  if (dimension) {
    normalized.dimension = dimension;
  }

  return normalized;
}

export interface GetLocationsInput {
  page?: number;
  filters?: LocationFilters;
  signal?: AbortSignal;
}

export interface GetLocationsUseCase {
  execute(input?: GetLocationsInput): Promise<LocationPage>;
}

export interface GetLocationsUseCaseDependencies {
  repository: LocationRepository;
}

/**
 * Application use case: fetch a page of locations. Sanitizes pagination and
 * filters, then delegates to the repository port (dependency inversion).
 */
export function createGetLocationsUseCase({
  repository,
}: GetLocationsUseCaseDependencies): GetLocationsUseCase {
  return {
    execute(input = {}) {
      const page = normalizePage(input.page);
      const filters = normalizeFilters(input.filters ?? {});

      return repository.getLocations({ page, filters, signal: input.signal });
    },
  };
}
