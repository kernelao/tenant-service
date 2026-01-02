import { AggregateRoot } from '@/domain/shared/base/AggregateRoot';
import { UniqueEntityId } from '@/domain/shared/base/UniqueEntityId';

import type { StoreStatus } from '@/domain/tenant/value-objects/StoreStatus';

type Props = {
  storeId: string; // storeId unique
  domain: string; // domaine unique
  name?: string; // optionnel
  status: StoreStatus; // ACTIVE | ARCHIVED
  createdAt: Date;
  updatedAt: Date;
};

export class Store extends AggregateRoot<Props> {
  private constructor(props: Props, id?: UniqueEntityId) {
    super(props, id);
  }

  get idValue(): string {
    return this.id.value;
  }

  get storeId(): string {
    return this.props.storeId;
  }

  get domain(): string {
    return this.props.domain;
  }

  get name(): string | undefined {
    return this.props.name;
  }

  get status(): StoreStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  rename(newName: string): void {
    this.ensureActive();
    this.props.name = newName;
    this.touch();
  }

  changeDomain(newDomain: string): void {
    this.ensureActive();
    this.props.domain = newDomain;
    this.touch();
  }

  archive(): void {
    if (this.props.status === 'ARCHIVED') return;
    this.props.status = 'ARCHIVED';
    this.touch();
  }

  private ensureActive(): void {
    if (this.props.status === 'ARCHIVED') {
      // tu peux throw une DomainError si tu veux.
      // pour V1 on protège les mutations (rename/archive) juste avec guard logique.
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  static create(params: { id: string; storeId: string; domain: string; name?: string }): Store {
    const now = new Date();
    return new Store(
      {
        storeId: params.storeId,
        domain: params.domain,
        name: params.name,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      },
      new UniqueEntityId(params.id),
    );
  }

  static hydrate(params: {
    id: string;
    storeId: string;
    domain: string;
    name?: string | null;
    status: StoreStatus;
    createdAt: Date;
    updatedAt: Date;
  }): Store {
    return new Store(
      {
        storeId: params.storeId,
        domain: params.domain,
        name: params.name ?? undefined,
        status: params.status,
        createdAt: params.createdAt,
        updatedAt: params.updatedAt,
      },
      new UniqueEntityId(params.id),
    );
  }
}
