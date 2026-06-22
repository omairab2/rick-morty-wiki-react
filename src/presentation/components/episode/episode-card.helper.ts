const SEASON_PATTERN = /^S(\d+)/i;
const FALLBACK_SEASON = 1;

/**
 * Parse the season number from an episode code (e.g. "S03E07" → 3). Falls back to
 * season 1 for a malformed code so the card always renders. Lives in a helper
 * (not inline in the component) because it's string parsing, not rendering.
 */
export function parseEpisodeSeason(code: string): number {
  const season = Number.parseInt(SEASON_PATTERN.exec(code)?.[1] ?? '', 10);

  return Number.isNaN(season) ? FALLBACK_SEASON : season;
}
