import { Skeleton } from '@/presentation/components/ui/skeleton';

/**
 * Loading placeholder for the episode list — a simple rectangle sized to roughly
 * match the populated card (header + air date + featured box + season bar).
 */
export function EpisodeCardSkeleton() {
  return <Skeleton className="h-64 w-full rounded-xl" aria-hidden />;
}
