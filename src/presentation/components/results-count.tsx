const NO_RESULTS = 0;
const SINGLE_RESULT = 1;

interface ResultsCountProps {
  count: number;
  singular: string;
  plural: string;
}

/**
 * Summary line shown below the filters, e.g. "826 characters found" or
 * "No characters found". Generic over the noun so every list reuses it.
 */
export function ResultsCount({ count, singular, plural }: ResultsCountProps) {
  let label: string;
  if (count === NO_RESULTS) {
    label = `No ${plural} found`;
  } else if (count === SINGLE_RESULT) {
    label = `${count} ${singular} found`;
  } else {
    label = `${count} ${plural} found`;
  }

  return (
    <p className="text-muted-foreground text-sm" aria-live="polite">
      {label}
    </p>
  );
}
