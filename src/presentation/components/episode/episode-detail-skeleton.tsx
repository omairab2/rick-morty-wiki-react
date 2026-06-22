import { Separator } from '@/presentation/components/ui/separator';
import { Skeleton } from '@/presentation/components/ui/skeleton';

const CHARACTER_SKELETON_COUNT = 8;
const GRID_CLASSES = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4';

/**
 * Loading placeholder that mirrors the episode detail layout: the episode header
 * (code, title, air date) above a grid of character-card placeholders.
 */
export function EpisodeDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading episode">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-4 w-40" />
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-40" />
        <div className={GRID_CLASSES}>
          {Array.from({ length: CHARACTER_SKELETON_COUNT }, (_, index) => (
            <Skeleton key={index} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
