import { z } from 'zod';

const DEFAULT_API_BASE_URL = 'https://rickandmortyapi.com/api';

const envSchema = z.object({
  VITE_API_BASE_URL: z.url().default(DEFAULT_API_BASE_URL),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${z.prettifyError(parsed.error)}`);
}

export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL,
} as const;
