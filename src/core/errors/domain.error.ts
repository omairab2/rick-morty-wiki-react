/**
 * Base class for domain-level errors. Domain and application layers throw
 * subclasses of this; the presentation layer maps them to user-facing messages.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
