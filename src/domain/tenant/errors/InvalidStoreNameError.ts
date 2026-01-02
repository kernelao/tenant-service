import { DomainError } from '@/domain/shared/base/DomainError';

export class InvalidStoreNameError extends DomainError {
  readonly code = 'INVALID_STORE_NAME';
  constructor(message = 'storeName invalide') {
    super(message);
  }
}
