import { env } from '@/shared/config/env';

interface GetRequest {
  path: string;
  signal?: AbortSignal;
}

/**
 * Error thrown when an HTTP request resolves with a non-2xx status.
 */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

async function get<TResponse>({ path, signal }: GetRequest): Promise<TResponse> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, { signal });

  if (!response.ok) {
    throw new HttpError(response.status, `GET ${path} failed with status ${response.status}.`);
  }

  return (await response.json()) as TResponse;
}

/**
 * Thin transport wrapper around `fetch`. Concrete repositories in the
 * infrastructure layer build on top of this; domain code never touches it.
 */
export const httpClient = {
  get,
};
