import type { RequestHandler } from 'msw';

/**
 * MSW request handlers. Register handlers here as features are implemented
 * (e.g. `http.get(...)`). Shared by the browser worker and the test server.
 */
export const handlers: RequestHandler[] = [];
