import { DomainError } from '@/domain/shared/base/DomainError';

export class InvalidDomainNameError extends DomainError {
  readonly code = 'INVALID_DOMAIN_NAME';

  constructor(message = 'domain invalide') {
    super(message);
  }
}
