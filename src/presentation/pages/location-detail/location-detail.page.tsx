import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Link, useParams, useSearchParams } from 'react-router';

import { NotFoundState } from '@/presentation/components/character/not-found-state';
import { LocationDetailSkeleton } from '@/presentation/components/location/location-detail-skeleton';
import { LocationDetailView } from '@/presentation/components/location/location-detail-view';
import { ErrorState } from '@/presentation/components/error-state';
import { QueryErrorBoundary } from '@/presentation/components/query-error-boundary';
import { useLocationDetail } from '@/presentation/hooks/use-location-detail.hook';
import { AppPath } from '@/presentation/routes/paths';
import { HttpError } from '@/shared/errors/http.error';

const NOT_FOUND_STATUS = 404;

function LocationDetailContent({ id }: { id: number }) {
  const { data, isPending } = useLocationDetail({ id });

  if (isPending || !data) {
    return <LocationDetailSkeleton />;
  }

  return <LocationDetailView location={data.location} residents={data.residents} />;
}

export function LocationDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const backTarget = searchParams.get('back') ?? AppPath.Locations;
  const locationId = Number(id);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <Link
        to={backTarget}
        className="text-muted-foreground hover:text-foreground w-fit text-sm transition-colors"
      >
        ← Back to locations
      </Link>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <QueryErrorBoundary
            key={locationId}
            onReset={reset}
            fallback={({ error, reset: retry }) =>
              error instanceof HttpError && error.status === NOT_FOUND_STATUS ? (
                <NotFoundState
                  backTo={backTarget}
                  title="Location not found"
                  description="This location does not exist in any known dimension."
                  backLabel="Back to locations"
                />
              ) : (
                <ErrorState onRetry={retry} />
              )
            }
          >
            <LocationDetailContent id={locationId} />
          </QueryErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </main>
  );
}
