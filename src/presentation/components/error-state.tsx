import { Button } from '@/presentation/components/ui/button';

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.';

interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
}

/**
 * Generic error state with a retry action. Reused by any view that needs to
 * recover from a failed request.
 */
export function ErrorState({ onRetry, message = DEFAULT_MESSAGE }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Button onClick={onRetry}>Try again</Button>
    </div>
  );
}
