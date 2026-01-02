import { AggregateRoot } from '@/domain/shared/base/AggregateRoot';
import { UniqueEntityId } from '@/domain/shared/base/UniqueEntityId';

import { StoreId } from '@/domain/tenant/store/value-objects/StoreId';
import { StoreName } from '@/domain/tenant/store/value-objects/StoreName';
import type { StoreStatus } from '@/domain/tenant/store/value-objects/StoreStatus';

import { StoreArchivedError } from '@/domain/tenant/store/errors/StoreArchivedError';
import { StoreCreatedEvent } from '@/domain/tenant/store/events/StoreCreatedEvent';
import { UserId } from '@/domain/external/UserId';

type StoreProps = {
  name: StoreName;
  status: StoreStatus;

  /**
   * Optionnel : ownerId = userId du créateur (dans identity).
   * Ça aide pour la gouvernance V1, sans gérer les memberships ici.
   */
  ownerId: UserId;

  createdAt: Date;
  updatedAt: Date;
};

/**
 * Store (Aggregate Root)
 * ----------------------
 * Représente un tenant/boutique.
 *
 * V1:
 * - Create store (ACTIVE)
 * - Update name (si pas ARCHIVED)
 * - Archive store (désactivation)
 */
export class Store extends AggregateRoot<StoreProps> {
  private constructor(props: StoreProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // --- getters ---
  get storeId(): StoreId {
    return StoreId.create(this.id.value);
  }

  get name(): StoreName {
    return this.props.name;
  }

  get status(): StoreStatus {
    return this.props.status;
  }

  get ownerId(): UserId {
    return this.props.ownerId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --- behaviors ---
  ensureActive(): void {
    if (this.props.status === 'ARCHIVED') throw new StoreArchivedError();
  }

  rename(newName: StoreName): void {
    this.ensureActive();
    this.props.name = newName;
    this.touch();
  }

  archive(): void {
    if (this.props.status === 'ARCHIVED') return;
    this.props.status = 'ARCHIVED';
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  // --- factories ---
  static create(params: {
    storeId: StoreId; // fourni par app/infra (uuid) ou autre
    name: StoreName;
    ownerId: UserId;
  }): Store {
    const now = new Date();

    const store = new Store(
      {
        name: params.name,
        status: 'ACTIVE',
        ownerId: params.ownerId,
        createdAt: now,
        updatedAt: now,
      },
      new UniqueEntityId(params.storeId.value),
    );

    // Optionnel: tu peux enlever si tu n'utilises pas d'events
    store.addDomainEvent(new StoreCreatedEvent(params.storeId));

    return store;
  }

  static hydrate(params: {
    id: string;
    name: string;
    status: StoreStatus;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Store {
    return new Store(
      {
        name: StoreName.create(params.name),
        status: params.status,
        ownerId: UserId.create(params.ownerId),
        createdAt: params.createdAt,
        updatedAt: params.updatedAt,
      },
      new UniqueEntityId(params.id),
    );
  }
}
