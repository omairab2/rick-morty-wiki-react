import { Button } from '@/presentation/components/ui/button';

interface CharacterPaginationProps {
  page: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export function CharacterPagination({
  page,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
}: CharacterPaginationProps) {
  return (
    <nav className="flex items-center justify-center gap-4" aria-label="Pagination">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPreviousPage}
      >
        Previous
      </Button>
      <p className="text-muted-foreground text-sm" aria-live="polite">
        Page {page} of {totalPages}
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
      >
        Next
      </Button>
    </nav>
  );
}
