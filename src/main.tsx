import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/presentation/app/App';
import '@/index.css';

const MSW_ENABLED_FLAG = 'true';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element with id "root" was not found.');
}

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  if (import.meta.env.VITE_ENABLE_MSW !== MSW_ENABLED_FLAG) {
    return;
  }

  const { worker } = await import('@/infrastructure/mocks/browser');

  await worker.start({ onUnhandledRequest: 'bypass' });
}

void enableMocking().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
