import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { createGetEpisodesUseCase } from '@/application/use-cases/get-episodes.use-case';
import type { EpisodeFilters, EpisodePage } from '@/core/domain/repositories/episode.repository';
import { createEpisodeRepository } from '@/infrastructure/repositories/episode.repository.impl';

const EPISODES_QUERY_KEY = 'episodes';

export interface UseEpisodesParams {
  page: number;
  filters: EpisodeFilters;
}

/**
 * Presentation hook: fetch a page of episodes. `placeholderData: keepPreviousData`
 * keeps the current page visible while the next one loads (no loading flash).
 */
export function useEpisodes({ page, filters }: UseEpisodesParams) {
  const useCase = useMemo(
    () => createGetEpisodesUseCase({ repository: createEpisodeRepository() }),
    [],
  );

  return useQuery<EpisodePage>({
    queryKey: [EPISODES_QUERY_KEY, page, filters],
    queryFn: ({ signal }) => useCase.execute({ page, filters, signal }),
    placeholderData: keepPreviousData,
  });
}
