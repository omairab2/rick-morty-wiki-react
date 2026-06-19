import { Link } from 'react-router';

import { Button } from '@/presentation/components/ui/button';

const DEFAULT_TITLE = 'Character not found';
const DEFAULT_DESCRIPTION = 'This character does not exist in any known dimension.';
const DEFAULT_BACK_LABEL = 'Back to characters';

interface NotFoundStateProps {
  backTo: string;
  title?: string;
  description?: string;
  backLabel?: string;
}

/**
 * Shown when a resource id does not exist (HTTP 404), as opposed to the generic
 * {@link import('@/presentation/components/error-state').ErrorState}. Defaults to
 * character copy; pass `title`/`description`/`backLabel` to reuse for episodes.
 */
export function NotFoundState({
  backTo,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  backLabel = DEFAULT_BACK_LABEL,
}: NotFoundStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <Button asChild variant="outline">
        <Link to={backTo}>{backLabel}</Link>
      </Button>
    </div>
  );
}
