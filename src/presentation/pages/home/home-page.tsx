import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';

import type { CharacterFilters } from '@/core/domain/repositories/character.repository';
import { CharacterCard } from '@/presentation/components/character/character-card';
import { CharacterCardSkeleton } from '@/presentation/components/character/character-card-skeleton';
import { CharacterFilters as CharacterFiltersBar } from '@/presentation/components/character/character-filters';
import {
  toGenderFilter,
  toStatusFilter,
} from '@/presentation/components/character/character-filters.helper';
import { CharacterPagination } from '@/presentation/components/character/character-pagination';
import { ErrorState } from '@/presentation/components/error-state';
import { ResultsCount } from '@/presentation/components/results-count';
import { Button } from '@/presentation/components/ui/button';
import { useCharacters } from '@/presentation/hooks/use-characters.hook';
import { buildCharacterDetailPath } from '@/presentation/routes/paths';

const FIRST_PAGE = 1;
const SEARCH_DEBOUNCE_MS = 400;
const SKELETON_COUNT = 8;
const GRID_CLASSES = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

function LoadingGrid() {
  return (
    <div className={GRID_CLASSES} aria-busy="true">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <CharacterCardSkeleton key={index} />
      ))}
    </div>
  );
}

function EmptyState({
  searchTerm,
  onClearFilters,
}: {
  searchTerm: string;
  onClearFilters: () => void;
}) {
  const message = searchTerm
    ? `No characters found for '${searchTerm}'`
    : 'No characters match the selected filters.';

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear filters
      </Button>
    </div>
  );
}

export function HomePage() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(FIRST_PAGE));
  const [name, setName] = useQueryState('name', parseAsString.withDefault(''));
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault(''));
  const [gender, setGender] = useQueryState('gender', parseAsString.withDefault(''));

  const [searchInput, setSearchInput] = useState(name);
  const lastWrittenName = useRef(name);

  // Why a local `searchInput` instead of binding the box straight to nuqs:
  // writing every keystroke to the URL would push a history entry (and fire a
  // request) per character. Local state holds the in-progress text and commits
  // it to the URL once the user pauses — resetting to the first page so a
  // narrower result set never strands the user on an out-of-range page. Keying
  // the query off the URL `name` means the request is debounced for free.
  useEffect(() => {
    if (searchInput === name) {
      return;
    }

    const timeoutId = setTimeout(() => {
      lastWrittenName.current = searchInput;
      void setName(searchInput || null);
      void setPage(FIRST_PAGE);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchInput, name, setName, setPage]);

  // Sync the input when the URL changes externally (back/forward, clear filters).
  useEffect(() => {
    if (name !== lastWrittenName.current) {
      lastWrittenName.current = name;
      setSearchInput(name);
    }
  }, [name]);

  const filters = useMemo<CharacterFilters>(() => {
    const result: CharacterFilters = {};
    if (name) {
      result.name = name;
    }
    const statusFilter = status ? toStatusFilter(status) : undefined;
    if (statusFilter) {
      result.status = statusFilter;
    }
    const genderFilter = gender ? toGenderFilter(gender) : undefined;
    if (genderFilter) {
      result.gender = genderFilter;
    }
    return result;
  }, [name, status, gender]);

  const { data, isPending, isError, refetch } = useCharacters({ page, filters });
  const location = useLocation();
  const listUrl = `${location.pathname}${location.search}`;

  // An out-of-range page (the API answers 404 → empty page) snaps back to the
  // first page instead of leaving the user stranded on a blank, paginated view.
  useEffect(() => {
    if (data && data.totalCount === 0 && page > FIRST_PAGE) {
      void setPage(FIRST_PAGE);
    }
  }, [data, page, setPage]);

  function handleStatusChange(next: string) {
    void setStatus(next || null);
    void setPage(FIRST_PAGE);
  }

  function handleGenderChange(next: string) {
    void setGender(next || null);
    void setPage(FIRST_PAGE);
  }

  function handleClearFilters() {
    setSearchInput('');
    void setName(null);
    void setStatus(null);
    void setGender(null);
    void setPage(FIRST_PAGE);
  }

  let content: ReactNode;
  if (isError) {
    content = (
      <ErrorState
        onRetry={() => void refetch()}
        message="Something went wrong while loading characters."
      />
    );
  } else if (isPending || !data) {
    content = <LoadingGrid />;
  } else if (data.characters.length === 0) {
    content = <EmptyState searchTerm={name} onClearFilters={handleClearFilters} />;
  } else {
    content = (
      <>
        <div className={GRID_CLASSES}>
          {data.characters.map((character) => (
            <Link
              key={character.id}
              to={buildCharacterDetailPath({ id: character.id, back: listUrl })}
              className="focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
            >
              <CharacterCard character={character} />
            </Link>
          ))}
        </div>
        <CharacterPagination
          page={data.page}
          totalPages={data.totalPages}
          hasPreviousPage={data.hasPreviousPage}
          hasNextPage={data.hasNextPage}
          onPageChange={(nextPage) => void setPage(nextPage)}
        />
      </>
    );
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Rick &amp; Morty Wiki</h1>
        <p className="text-muted-foreground">
          Browse, search, and filter the characters of the multiverse.
        </p>
      </header>

      <CharacterFiltersBar
        value={{ search: searchInput, status, gender }}
        onSearchChange={setSearchInput}
        onStatusChange={handleStatusChange}
        onGenderChange={handleGenderChange}
      />

      {!isError && data && (
        <ResultsCount count={data.totalCount} singular="character" plural="characters" />
      )}

      {content}
    </main>
  );
}
