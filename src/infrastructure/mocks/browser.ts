import { setupWorker } from 'msw/browser';

import { handlers } from '@/infrastructure/mocks/handlers';

// MSW worker for the browser (development) environment.
export const worker = setupWorker(...handlers);
