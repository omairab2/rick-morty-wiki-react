import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CharacterPagination } from '@/presentation/components/character/character-pagination';

describe('CharacterPagination', () => {
  it('shows the current and total pages', () => {
    render(
      <CharacterPagination
        page={2}
        totalPages={42}
        hasPreviousPage
        hasNextPage
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Page 2 of 42')).toBeInTheDocument();
  });

  it('disables Previous on the first page and Next on the last page', () => {
    const { rerender } = render(
      <CharacterPagination
        page={1}
        totalPages={3}
        hasPreviousPage={false}
        hasNextPage
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();

    rerender(
      <CharacterPagination
        page={3}
        totalPages={3}
        hasPreviousPage
        hasNextPage={false}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('requests the next and previous pages on click', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <CharacterPagination
        page={2}
        totalPages={5}
        hasPreviousPage
        hasNextPage
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);

    await user.click(screen.getByRole('button', { name: /previous/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
