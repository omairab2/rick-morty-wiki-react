import { Skeleton } from '@/presentation/components/ui/skeleton';

/**
 * Loading placeholder for the location list — a simple rectangle sized to roughly
 * match the populated card (header + the two stat boxes + the residents bar).
 */
export function LocationCardSkeleton() {
  return <Skeleton className="h-56 w-full rounded-xl" aria-hidden />;
}
