import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  createGetEpisodeDetailUseCase,
  type EpisodeDetail,
} from '@/application/use-cases/get-episode-detail.use-case';
import { createEpisodeRepository } from '@/infrastructure/repositories/episode.repository.impl';

const EPISODE_DETAIL_QUERY_KEY = 'episode-detail';

export interface UseEpisodeDetailParams {
  id: number;
}

/**
 * Presentation hook for the episode detail. `throwOnError: true` lets errors
 * bubble to the nearest error boundary instead of being handled inline.
 */
export function useEpisodeDetail({ id }: UseEpisodeDetailParams) {
  const useCase = useMemo(
    () => createGetEpisodeDetailUseCase({ repository: createEpisodeRepository() }),
    [],
  );

  return useQuery<EpisodeDetail>({
    queryKey: [EPISODE_DETAIL_QUERY_KEY, id],
    queryFn: ({ signal }) => useCase.execute({ id, signal }),
    throwOnError: true,
  });
}
