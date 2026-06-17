import { Separator } from '@/presentation/components/ui/separator';
import { Skeleton } from '@/presentation/components/ui/skeleton';

const EPISODE_SKELETON_COUNT = 5;

/**
 * Loading placeholder that mirrors the real detail layout: large image on the
 * left, info on the right, episode list below.
 */
export function CharacterDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading character">
      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-2/5" />
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-40" />
        {Array.from({ length: EPISODE_SKELETON_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-5 w-full" />
        ))}
      </div>
    </div>
  );
}
