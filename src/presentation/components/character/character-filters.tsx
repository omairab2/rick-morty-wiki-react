import { Input } from '@/presentation/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import {
  FILTER_ALL_VALUE,
  GENDER_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  toFilterValue,
  toSelectValue,
} from '@/presentation/components/character/character-filters.helper';

export interface CharacterFiltersValue {
  search: string;
  status: string;
  gender: string;
}

interface CharacterFiltersProps {
  value: CharacterFiltersValue;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onGenderChange: (gender: string) => void;
}

export function CharacterFilters({
  value,
  onSearchChange,
  onStatusChange,
  onGenderChange,
}: CharacterFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        type="search"
        placeholder="Search by name..."
        aria-label="Search characters by name"
        value={value.search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="sm:max-w-xs"
      />

      <Select
        value={toSelectValue(value.status)}
        onValueChange={(selected) => onStatusChange(toFilterValue(selected))}
      >
        <SelectTrigger className="w-full sm:w-40" aria-label="Filter by status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FILTER_ALL_VALUE}>All statuses</SelectItem>
          {STATUS_FILTER_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={toSelectValue(value.gender)}
        onValueChange={(selected) => onGenderChange(toFilterValue(selected))}
      >
        <SelectTrigger className="w-full sm:w-40" aria-label="Filter by gender">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FILTER_ALL_VALUE}>All genders</SelectItem>
          {GENDER_FILTER_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
