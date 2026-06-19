import { Input } from '@/presentation/components/ui/input';

export interface LocationFiltersValue {
  name: string;
  type: string;
  dimension: string;
}

interface LocationFiltersProps {
  value: LocationFiltersValue;
  onNameChange: (name: string) => void;
  onTypeChange: (type: string) => void;
  onDimensionChange: (dimension: string) => void;
}

/**
 * `type` and `dimension` are open-ended in the API, so they are free-text inputs
 * (not selects). All three feed the debounced URL state in the page.
 */
export function LocationFilters({
  value,
  onNameChange,
  onTypeChange,
  onDimensionChange,
}: LocationFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        type="search"
        placeholder="Search by name..."
        aria-label="Search locations by name"
        value={value.name}
        onChange={(event) => onNameChange(event.target.value)}
        className="sm:max-w-xs"
      />
      <Input
        type="text"
        placeholder="Type (e.g. Planet)"
        aria-label="Filter by type"
        value={value.type}
        onChange={(event) => onTypeChange(event.target.value)}
        className="sm:w-44"
      />
      <Input
        type="text"
        placeholder="Dimension (e.g. C-137)"
        aria-label="Filter by dimension"
        value={value.dimension}
        onChange={(event) => onDimensionChange(event.target.value)}
        className="sm:w-52"
      />
    </div>
  );
}
