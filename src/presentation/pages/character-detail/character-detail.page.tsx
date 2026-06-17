import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Link, useParams, useSearchParams } from 'react-router';

import { CharacterDetailSkeleton } from '@/presentation/components/character/character-detail-skeleton';
import { CharacterDetailView } from '@/presentation/components/character/character-detail-view';
import { NotFoundState } from '@/presentation/components/character/not-found-state';
import { ErrorState } from '@/presentation/components/error-state';
import { QueryErrorBoundary } from '@/presentation/components/query-error-boundary';
import { HttpError } from '@/shared/errors/http.error';
import { useCharacterDetail } from '@/presentation/hooks/use-character-detail.hook';
import { AppPath } from '@/presentation/routes/paths';

const NOT_FOUND_STATUS = 404;

function CharacterDetailContent({ id }: { id: number }) {
  const { data, isPending } = useCharacterDetail({ id });

  if (isPending || !data) {
    return <CharacterDetailSkeleton />;
  }

  return <CharacterDetailView character={data.character} episodes={data.episodes} />;
}

export function CharacterDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const backTarget = searchParams.get('back') ?? AppPath.Home;
  const characterId = Number(id);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <Link
        to={backTarget}
        className="text-muted-foreground hover:text-foreground w-fit text-sm transition-colors"
      >
        ← Back to characters
      </Link>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <QueryErrorBoundary
            key={characterId}
            onReset={reset}
            fallback={({ error, reset: retry }) =>
              error instanceof HttpError && error.status === NOT_FOUND_STATUS ? (
                <NotFoundState backTo={backTarget} />
              ) : (
                <ErrorState onRetry={retry} />
              )
            }
          >
            <CharacterDetailContent id={characterId} />
          </QueryErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </main>
  );
}
