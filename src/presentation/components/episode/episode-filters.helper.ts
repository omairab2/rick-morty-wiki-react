/**
 * Season options for the filter, hardcoded to S01–S07 (the seasons the API
 * actually serves). Chosen over deriving them from the current results because
 * the results are filtered and paginated: a derived list would be incomplete
 * and would collapse to a single option once a season is selected.
 */
const SEASON_COUNT = 7;

export const SEASON_OPTIONS: string[] = Array.from(
  { length: SEASON_COUNT },
  (_, index) => `S${String(index + 1).padStart(2, '0')}`,
);

/**
 * Sentinel value for the "All" option. Radix Select forbids an empty-string
 * item value, so we use this sentinel and translate it to/from the empty filter.
 */
export const FILTER_ALL_VALUE = 'all';

/** Map a Select value to the upstream filter value ("all" clears the filter). */
export function toFilterValue(selectValue: string): string {
  return selectValue === FILTER_ALL_VALUE ? '' : selectValue;
}

/** Map an upstream filter value to the Select value (empty shows the "All" option). */
export function toSelectValue(filterValue: string): string {
  return filterValue === '' ? FILTER_ALL_VALUE : filterValue;
}
