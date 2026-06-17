import { env } from '@/shared/config/env';
import { HttpError } from '@/shared/errors/http.error';

interface GetRequest {
  path: string;
  signal?: AbortSignal;
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
