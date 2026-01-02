import { ValueObject } from '@/domain/shared/base/ValueObject';
import { DomainError } from '@/domain/shared/base/DomainError';

class InvalidUserIdError extends DomainError {
  readonly code = 'INVALID_USER_ID';
  constructor(message = 'userId invalide') {
    super(message);
  }
}

type UserIdProps = { value: string };

export class UserId extends ValueObject<UserIdProps> {
  private constructor(props: UserIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(raw: string): UserId {
    const value = (raw ?? '').trim();
    if (value.length === 0) throw new InvalidUserIdError();
    return new UserId({ value });
  }
}
