import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';

import type { LocationFilters } from '@/core/domain/repositories/location.repository';
import { CharacterPagination } from '@/presentation/components/character/character-pagination';
import { LocationCard } from '@/presentation/components/location/location-card';
import { LocationCardSkeleton } from '@/presentation/components/location/location-card-skeleton';
import {
  LocationFilters as LocationFiltersBar,
  type LocationFiltersValue,
} from '@/presentation/components/location/location-filters';
import { ErrorState } from '@/presentation/components/error-state';
import { ResultsCount } from '@/presentation/components/results-count';
import { Button } from '@/presentation/components/ui/button';
import { useLocations } from '@/presentation/hooks/use-locations.hook';
import { buildLocationDetailPath } from '@/presentation/routes/paths';

const FIRST_PAGE = 1;
const SEARCH_DEBOUNCE_MS = 400;
const SKELETON_COUNT = 8;
const GRID_CLASSES = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

function LoadingGrid() {
  return (
    <div className={GRID_CLASSES} aria-busy="true">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <LocationCardSkeleton key={index} />
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
    ? `No locations found for '${searchTerm}'`
    : 'No locations match the selected filters.';

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear filters
      </Button>
    </div>
  );
}

export function LocationsListPage() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(FIRST_PAGE));
  const [name, setName] = useQueryState('name', parseAsString.withDefault(''));
  const [type, setType] = useQueryState('type', parseAsString.withDefault(''));
  const [dimension, setDimension] = useQueryState('dimension', parseAsString.withDefault(''));

  const [filterInput, setFilterInput] = useState<LocationFiltersValue>({ name, type, dimension });
  const lastWritten = useRef<LocationFiltersValue>({ name, type, dimension });

  // Debounce: write all three text filters to the URL (and reset to page 1)
  // after the user stops typing, so the request keys off the debounced values.
  useEffect(() => {
    const inSync =
      filterInput.name === name && filterInput.type === type && filterInput.dimension === dimension;
    if (inSync) {
      return;
    }

    const timeoutId = setTimeout(() => {
      lastWritten.current = filterInput;
      void setName(filterInput.name || null);
      void setType(filterInput.type || null);
      void setDimension(filterInput.dimension || null);
      void setPage(FIRST_PAGE);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [filterInput, name, type, dimension, setName, setType, setDimension, setPage]);

  // Sync the inputs when the URL changes externally (back/forward, clear filters).
  useEffect(() => {
    const current = { name, type, dimension };
    const written = lastWritten.current;
    if (
      current.name !== written.name ||
      current.type !== written.type ||
      current.dimension !== written.dimension
    ) {
      lastWritten.current = current;
      setFilterInput(current);
    }
  }, [name, type, dimension]);

  const filters = useMemo<LocationFilters>(() => {
    const result: LocationFilters = {};
    if (name) {
      result.name = name;
    }
    if (type) {
      result.type = type;
    }
    if (dimension) {
      result.dimension = dimension;
    }
    return result;
  }, [name, type, dimension]);

  const { data, isPending, isError, refetch } = useLocations({ page, filters });
  const routerLocation = useLocation();
  const listUrl = `${routerLocation.pathname}${routerLocation.search}`;

  // An out-of-range page (the API answers 404 → empty page) snaps back to the
  // first page instead of leaving the user stranded on a blank, paginated view.
  useEffect(() => {
    if (data && data.totalCount === 0 && page > FIRST_PAGE) {
      void setPage(FIRST_PAGE);
    }
  }, [data, page, setPage]);

  function handleClearFilters() {
    setFilterInput({ name: '', type: '', dimension: '' });
    void setName(null);
    void setType(null);
    void setDimension(null);
    void setPage(FIRST_PAGE);
  }

  let content: ReactNode;
  if (isError) {
    content = (
      <ErrorState
        onRetry={() => void refetch()}
        message="Something went wrong while loading locations."
      />
    );
  } else if (isPending || !data) {
    content = <LoadingGrid />;
  } else if (data.locations.length === 0) {
    content = <EmptyState searchTerm={name} onClearFilters={handleClearFilters} />;
  } else {
    content = (
      <>
        <div className={GRID_CLASSES}>
          {data.locations.map((item) => (
            <Link
              key={item.id}
              to={buildLocationDetailPath({ id: item.id, back: listUrl })}
              className="focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
            >
              <LocationCard location={item} />
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
        <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
        <p className="text-muted-foreground">Browse and search every location of the multiverse.</p>
      </header>

      <LocationFiltersBar
        value={filterInput}
        onNameChange={(value) => setFilterInput((previous) => ({ ...previous, name: value }))}
        onTypeChange={(value) => setFilterInput((previous) => ({ ...previous, type: value }))}
        onDimensionChange={(value) =>
          setFilterInput((previous) => ({ ...previous, dimension: value }))
        }
      />

      {!isError && data && (
        <ResultsCount count={data.totalCount} singular="location" plural="locations" />
      )}

      {content}
    </main>
  );
}
