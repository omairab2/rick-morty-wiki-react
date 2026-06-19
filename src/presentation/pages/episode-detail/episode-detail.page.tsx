import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Link, useParams, useSearchParams } from 'react-router';

import { NotFoundState } from '@/presentation/components/character/not-found-state';
import { EpisodeDetailSkeleton } from '@/presentation/components/episode/episode-detail-skeleton';
import { EpisodeDetailView } from '@/presentation/components/episode/episode-detail-view';
import { ErrorState } from '@/presentation/components/error-state';
import { QueryErrorBoundary } from '@/presentation/components/query-error-boundary';
import { useEpisodeDetail } from '@/presentation/hooks/use-episode-detail.hook';
import { AppPath } from '@/presentation/routes/paths';
import { HttpError } from '@/shared/errors/http.error';

const NOT_FOUND_STATUS = 404;

function EpisodeDetailContent({ id }: { id: number }) {
  const { data, isPending } = useEpisodeDetail({ id });

  if (isPending || !data) {
    return <EpisodeDetailSkeleton />;
  }

  return <EpisodeDetailView episode={data.episode} characters={data.characters} />;
}

export function EpisodeDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const backTarget = searchParams.get('back') ?? AppPath.Episodes;
  const episodeId = Number(id);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <Link
        to={backTarget}
        className="text-muted-foreground hover:text-foreground w-fit text-sm transition-colors"
      >
        ← Back to episodes
      </Link>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <QueryErrorBoundary
            key={episodeId}
            onReset={reset}
            fallback={({ error, reset: retry }) =>
              error instanceof HttpError && error.status === NOT_FOUND_STATUS ? (
                <NotFoundState
                  backTo={backTarget}
                  title="Episode not found"
                  description="This episode does not exist in any known dimension."
                  backLabel="Back to episodes"
                />
              ) : (
                <ErrorState onRetry={retry} />
              )
            }
          >
            <EpisodeDetailContent id={episodeId} />
          </QueryErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </main>
  );
}
