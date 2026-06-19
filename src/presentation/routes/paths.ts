/**
 * Application route paths. Use these constants everywhere instead of raw
 * string literals so routes stay refactor-safe.
 */
export const AppPath = {
  Home: '/',
  Characters: '/characters',
  CharacterDetail: '/characters/:id',
  Episodes: '/episodes',
  EpisodeDetail: '/episodes/:id',
  Locations: '/locations',
} as const;

export type AppPath = (typeof AppPath)[keyof typeof AppPath];

interface BuildDetailPathArgs {
  id: number;
  back?: string;
}

/**
 * Build the path to a character's detail page. When `back` is provided (the
 * current list URL), it is stored as a query param so the detail breadcrumb can
 * return to the exact filtered list — surviving refresh and shared links.
 */
export function buildCharacterDetailPath({ id, back }: BuildDetailPathArgs): string {
  const base = `/characters/${id}`;

  return back ? `${base}?back=${encodeURIComponent(back)}` : base;
}

/**
 * Build the path to an episode's detail page (same `back` convention as
 * {@link buildCharacterDetailPath}).
 */
export function buildEpisodeDetailPath({ id, back }: BuildDetailPathArgs): string {
  const base = `/episodes/${id}`;

  return back ? `${base}?back=${encodeURIComponent(back)}` : base;
}
