import { Link } from 'react-router';

import { Button } from '@/presentation/components/ui/button';

interface NotFoundStateProps {
  backTo: string;
}

/**
 * Shown when a character id does not exist (HTTP 404), as opposed to the
 * generic {@link import('@/presentation/components/error-state').ErrorState}.
 */
export function NotFoundState({ backTo }: NotFoundStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Character not found</h1>
      <p className="text-muted-foreground">This character does not exist in any known dimension.</p>
      <Button asChild variant="outline">
        <Link to={backTo}>Back to characters</Link>
      </Button>
    </div>
  );
}
