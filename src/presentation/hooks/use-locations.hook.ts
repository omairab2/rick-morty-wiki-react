import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { createGetLocationsUseCase } from '@/application/use-cases/get-locations.use-case';
import type { LocationFilters, LocationPage } from '@/core/domain/repositories/location.repository';
import { createLocationRepository } from '@/infrastructure/repositories/location.repository.impl';

const LOCATIONS_QUERY_KEY = 'locations';

export interface UseLocationsParams {
  page: number;
  filters: LocationFilters;
}

/**
 * Presentation hook: fetch a page of locations. `placeholderData: keepPreviousData`
 * keeps the current page visible while the next one loads (no loading flash).
 */
export function useLocations({ page, filters }: UseLocationsParams) {
  const useCase = useMemo(
    () => createGetLocationsUseCase({ repository: createLocationRepository() }),
    [],
  );

  return useQuery<LocationPage>({
    queryKey: [LOCATIONS_QUERY_KEY, page, filters],
    queryFn: ({ signal }) => useCase.execute({ page, filters, signal }),
    placeholderData: keepPreviousData,
  });
}
