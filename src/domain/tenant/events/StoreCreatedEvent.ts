import { DomainEvent } from '@/domain/shared/base/DomainEvent';
import { StoreId } from '@/domain/tenant/value-objects/StoreId';

/**
 * StoreCreatedEvent
 * -----------------
 * Émis quand un store est créé.
 * V1: payload minimal.
 */
export class StoreCreatedEvent implements DomainEvent {
  readonly name = 'StoreCreatedEvent';

  constructor(
    public readonly storeId: StoreId,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
