import { ValueObject } from '@/domain/shared/base/ValueObject';
import { DomainError } from '@/domain/shared/base/DomainError';

class InvalidCorrelationIdError extends DomainError {
  readonly code = 'INVALID_CORRELATION_ID';
  constructor() {
    super('correlationId invalide');
  }
}

type Props = { value: string };

export class CorrelationId extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(raw: string): CorrelationId {
    const v = (raw ?? '').trim();
    if (!v) throw new InvalidCorrelationIdError();
    return new CorrelationId({ value: v });
  }
}
