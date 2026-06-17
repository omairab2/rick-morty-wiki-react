import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { createGetCharactersUseCase } from '@/application/use-cases/get-characters.use-case';
import type {
  CharacterFilters,
  CharacterPage,
} from '@/core/domain/repositories/character.repository';
import { createCharacterRepository } from '@/infrastructure/repositories/character.repository.impl';

const CHARACTERS_QUERY_KEY = 'characters';

export interface UseCharactersParams {
  page: number;
  filters: CharacterFilters;
}

/**
 * Presentation hook: fetch a page of characters via TanStack Query.
 *
 * - `placeholderData: keepPreviousData` keeps the previous page visible while
 *   the next one loads, so paginating does not flash a loading state.
 * - The query's `signal` is forwarded to the use case → repository → fetch, so
 *   TanStack Query cancels in-flight requests automatically.
 */
export function useCharacters({ page, filters }: UseCharactersParams) {
  const useCase = useMemo(
    () => createGetCharactersUseCase({ repository: createCharacterRepository() }),
    [],
  );

  return useQuery<CharacterPage>({
    queryKey: [CHARACTERS_QUERY_KEY, page, filters],
    queryFn: ({ signal }) => useCase.execute({ page, filters, signal }),
    placeholderData: keepPreviousData,
  });
}
