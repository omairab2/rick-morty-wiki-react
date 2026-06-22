import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  createGetCharacterDetailUseCase,
  type CharacterDetail,
} from '@/application/use-cases/get-character-detail.use-case';
import { createCharacterRepository } from '@/infrastructure/repositories/character.repository.impl';

const CHARACTER_DETAIL_QUERY_KEY = 'character-detail';

export interface UseCharacterDetailParams {
  id: number;
}

/**
 * Presentation hook for the character detail.
 *
 * Why `throwOnError: true`: the detail route is wrapped in a QueryErrorBoundary
 * that renders a 404 not-found state vs a generic error state (it inspects
 * `HttpError.status`). Throwing routes failures to that boundary, so the page
 * component only handles loading/success — unlike the list (HomePage), which has
 * no 404-vs-error distinction to make and renders its own `ErrorState` inline.
 */
export function useCharacterDetail({ id }: UseCharacterDetailParams) {
  const useCase = useMemo(
    () => createGetCharacterDetailUseCase({ repository: createCharacterRepository() }),
    [],
  );

  return useQuery<CharacterDetail>({
    queryKey: [CHARACTER_DETAIL_QUERY_KEY, id],
    queryFn: ({ signal }) => useCase.execute({ id, signal }),
    throwOnError: true,
  });
}
