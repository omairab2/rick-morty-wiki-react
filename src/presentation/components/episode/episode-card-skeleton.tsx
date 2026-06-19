import { Skeleton } from '@/presentation/components/ui/skeleton';

/**
 * Loading placeholder for the episode list — a simple rectangular card with no
 * internal structure (the list does not need the detail skeleton's fidelity).
 */
export function EpisodeCardSkeleton() {
  return <Skeleton className="h-32 w-full rounded-xl" aria-hidden />;
}
