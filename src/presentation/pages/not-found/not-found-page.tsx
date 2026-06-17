import { Link } from 'react-router';

import { Button } from '@/presentation/components/ui/button';
import { AppPath } from '@/presentation/routes/paths';

export function NotFoundPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-start gap-4 px-6 py-16">
      <h1 className="text-3xl font-bold">404 — Page not found</h1>
      <p className="text-muted-foreground">The dimension you are looking for does not exist.</p>
      <Button asChild>
        <Link to={AppPath.Home}>Back to home</Link>
      </Button>
    </main>
  );
}
