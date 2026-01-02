import { ValueObject } from '@/domain/shared/base/ValueObject';
import { DomainError } from '@/domain/shared/base/DomainError';

class InvalidActorIdError extends DomainError {
  readonly code = 'INVALID_ACTOR_ID';
  constructor() {
    super('actorId invalide');
  }
}

type Props = { value: string };

export class ActorId extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(raw: string): ActorId {
    const v = (raw ?? '').trim();
    if (!v) throw new InvalidActorIdError();
    return new ActorId({ value: v });
  }
}
