import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';

import type { EpisodeFilters } from '@/core/domain/repositories/episode.repository';
import { CharacterPagination } from '@/presentation/components/character/character-pagination';
import { EpisodeCard } from '@/presentation/components/episode/episode-card';
import { EpisodeCardSkeleton } from '@/presentation/components/episode/episode-card-skeleton';
import { EpisodeFilters as EpisodeFiltersBar } from '@/presentation/components/episode/episode-filters';
import { ErrorState } from '@/presentation/components/error-state';
import { ResultsCount } from '@/presentation/components/results-count';
import { Button } from '@/presentation/components/ui/button';
import { useEpisodes } from '@/presentation/hooks/use-episodes.hook';
import { buildEpisodeDetailPath } from '@/presentation/routes/paths';

const FIRST_PAGE = 1;
const SEARCH_DEBOUNCE_MS = 400;
const SKELETON_COUNT = 8;
const GRID_CLASSES = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

function LoadingGrid() {
  return (
    <div className={GRID_CLASSES} aria-busy="true">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <EpisodeCardSkeleton key={index} />
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
    ? `No episodes found for '${searchTerm}'`
    : 'No episodes match the selected filters.';

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear filters
      </Button>
    </div>
  );
}

export function EpisodesListPage() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(FIRST_PAGE));
  const [name, setName] = useQueryState('name', parseAsString.withDefault(''));
  const [season, setSeason] = useQueryState('season', parseAsString.withDefault(''));

  const [searchInput, setSearchInput] = useState(name);
  const lastWrittenName = useRef(name);

  // Debounce the search box → URL (and reset to page 1) after the user stops
  // typing, so the request keys off the debounced value, not every keystroke.
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

  const filters = useMemo<EpisodeFilters>(() => {
    const result: EpisodeFilters = {};
    if (name) {
      result.name = name;
    }
    if (season) {
      result.code = season;
    }
    return result;
  }, [name, season]);

  const { data, isPending, isError, refetch } = useEpisodes({ page, filters });
  const location = useLocation();
  const listUrl = `${location.pathname}${location.search}`;

  // An out-of-range page (the API answers 404 → empty page) snaps back to the
  // first page instead of leaving the user stranded on a blank, paginated view.
  useEffect(() => {
    if (data && data.totalCount === 0 && page > FIRST_PAGE) {
      void setPage(FIRST_PAGE);
    }
  }, [data, page, setPage]);

  function handleSeasonChange(next: string) {
    void setSeason(next || null);
    void setPage(FIRST_PAGE);
  }

  function handleClearFilters() {
    setSearchInput('');
    void setName(null);
    void setSeason(null);
    void setPage(FIRST_PAGE);
  }

  let content: ReactNode;
  if (isError) {
    content = (
      <ErrorState
        onRetry={() => void refetch()}
        message="Something went wrong while loading episodes."
      />
    );
  } else if (isPending || !data) {
    content = <LoadingGrid />;
  } else if (data.episodes.length === 0) {
    content = <EmptyState searchTerm={name} onClearFilters={handleClearFilters} />;
  } else {
    content = (
      <>
        <div className={GRID_CLASSES}>
          {data.episodes.map((episode) => (
            <Link
              key={episode.id}
              to={buildEpisodeDetailPath({ id: episode.id, back: listUrl })}
              className="focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
            >
              <EpisodeCard episode={episode} />
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
        <h1 className="text-3xl font-bold tracking-tight">Episodes</h1>
        <p className="text-muted-foreground">Browse and search every episode of the multiverse.</p>
      </header>

      <EpisodeFiltersBar
        value={{ search: searchInput, season }}
        onSearchChange={setSearchInput}
        onSeasonChange={handleSeasonChange}
      />

      {!isError && data && (
        <ResultsCount count={data.totalCount} singular="episode" plural="episodes" />
      )}

      {content}
    </main>
  );
}
