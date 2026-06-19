import {
  FILTER_ALL_VALUE,
  SEASON_OPTIONS,
  toFilterValue,
  toSelectValue,
} from '@/presentation/components/episode/episode-filters.helper';
import { Input } from '@/presentation/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';

export interface EpisodeFiltersValue {
  search: string;
  season: string;
}

interface EpisodeFiltersProps {
  value: EpisodeFiltersValue;
  onSearchChange: (search: string) => void;
  onSeasonChange: (season: string) => void;
}

export function EpisodeFilters({ value, onSearchChange, onSeasonChange }: EpisodeFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        type="search"
        placeholder="Search by name..."
        aria-label="Search episodes by name"
        value={value.search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="sm:max-w-xs"
      />

      <Select
        value={toSelectValue(value.season)}
        onValueChange={(selected) => onSeasonChange(toFilterValue(selected))}
      >
        <SelectTrigger className="w-full sm:w-40" aria-label="Filter by season">
          <SelectValue placeholder="Season" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FILTER_ALL_VALUE}>All seasons</SelectItem>
          {SEASON_OPTIONS.map((season) => (
            <SelectItem key={season} value={season}>
              {season}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
