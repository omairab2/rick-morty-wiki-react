import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card';
import { Skeleton } from '@/presentation/components/ui/skeleton';

export function CharacterCardSkeleton() {
  return (
    <Card className="overflow-hidden pt-0" aria-hidden>
      <Skeleton className="h-48 w-full rounded-none" />
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}
