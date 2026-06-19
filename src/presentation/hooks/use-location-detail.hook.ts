import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  createGetLocationDetailUseCase,
  type LocationDetail,
} from '@/application/use-cases/get-location-detail.use-case';
import { createLocationRepository } from '@/infrastructure/repositories/location.repository.impl';

const LOCATION_DETAIL_QUERY_KEY = 'location-detail';

export interface UseLocationDetailParams {
  id: number;
}

/**
 * Presentation hook for the location detail. `throwOnError: true` lets errors
 * bubble to the nearest error boundary instead of being handled inline.
 */
export function useLocationDetail({ id }: UseLocationDetailParams) {
  const useCase = useMemo(
    () => createGetLocationDetailUseCase({ repository: createLocationRepository() }),
    [],
  );

  return useQuery<LocationDetail>({
    queryKey: [LOCATION_DETAIL_QUERY_KEY, id],
    queryFn: ({ signal }) => useCase.execute({ id, signal }),
    throwOnError: true,
  });
}
