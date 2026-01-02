import { ValueObject } from '@/domain/shared/base/ValueObject';
import { InvalidDomainNameError } from '@/domain/tenant/errors/InvalidDomainNameError';

type DomainNameProps = { value: string };

export class DomainName extends ValueObject<DomainNameProps> {
  private constructor(props: DomainNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(raw: string): DomainName {
    const cleaned = (raw ?? '')
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, ''); // enlève path

    // V1: validation simple (tu pourras durcir après)
    if (!cleaned || cleaned.length < 3) throw new InvalidDomainNameError();
    if (!cleaned.includes('.')) throw new InvalidDomainNameError('domain doit contenir un "."');
    if (cleaned.includes(' '))
      throw new InvalidDomainNameError('domain ne doit pas contenir d’espace');

    return new DomainName({ value: cleaned });
  }
}
