import { describe, expect, it } from 'vitest';

import { HttpError } from '@/shared/errors/http.error';

describe('HttpError', () => {
  it('is an Error carrying the HTTP status', () => {
    const error = new HttpError(404, 'Not found');

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('HttpError');
    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found');
  });
});
