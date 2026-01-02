import { DomainError } from '@/domain/shared/base/DomainError';

export class InvalidStoreIdError extends DomainError {
  readonly code = 'INVALID_STORE_ID';
  constructor(message = 'storeId invalide') {
    super(message);
  }
}
