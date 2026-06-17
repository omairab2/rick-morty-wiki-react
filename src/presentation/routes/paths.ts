/**
 * Application route paths. Use these constants everywhere instead of raw
 * string literals so routes stay refactor-safe.
 */
export const AppPath = {
  Home: '/',
  Characters: '/characters',
  Episodes: '/episodes',
  Locations: '/locations',
} as const;

export type AppPath = (typeof AppPath)[keyof typeof AppPath];
