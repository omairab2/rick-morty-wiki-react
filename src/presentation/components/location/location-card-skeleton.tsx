import { Skeleton } from '@/presentation/components/ui/skeleton';

/**
 * Loading placeholder for the location list — a simple rectangular card with no
 * internal structure.
 */
export function LocationCardSkeleton() {
  return <Skeleton className="h-28 w-full rounded-xl" aria-hidden />;
}
