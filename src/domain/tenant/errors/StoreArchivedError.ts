import { DomainError } from '@/domain/shared/base/DomainError';

export class StoreArchivedError extends DomainError {
  readonly code = 'STORE_ARCHIVED';
  constructor(message = 'Store archivé') {
    super(message);
  }
}
