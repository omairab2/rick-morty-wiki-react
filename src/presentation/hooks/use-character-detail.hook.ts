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
 * Presentation hook for the character detail. `throwOnError: true` lets errors
 * bubble to the nearest error boundary instead of being handled inline in the
 * component, keeping the page focused on the loading/success states.
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
