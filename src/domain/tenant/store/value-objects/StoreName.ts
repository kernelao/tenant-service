import { ValueObject } from '@/domain/shared/base/ValueObject';
import { InvalidStoreNameError } from '@/domain/tenant/store/errors/InvalidStoreNameError';

type StoreNameProps = { value: string };

/**
 * StoreName (Value Object)
 * ------------------------
 * Nom affiché de la boutique/tenant.
 *
 * V1: 3..80 chars, trim, pas vide.
 */
export class StoreName extends ValueObject<StoreNameProps> {
  private constructor(props: StoreNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(raw: string): StoreName {
    const value = (raw ?? '').trim();

    if (value.length < 3) throw new InvalidStoreNameError('storeName trop court (min 3)');
    if (value.length > 80) throw new InvalidStoreNameError('storeName trop long (max 80)');

    return new StoreName({ value });
  }
}
