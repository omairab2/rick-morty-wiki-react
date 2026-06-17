import { Providers } from '@/presentation/app/providers';
import { AppRouter } from '@/presentation/routes/router';

export function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}
