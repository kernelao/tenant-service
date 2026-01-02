import { Store } from '@/domain/tenant/aggregates/Store';

export interface StoreRepositoryPort {
  findById(storeId: string): Promise<Store | null>;
  findByName(name: string): Promise<Store | null>;
  findByDomain(domain: string): Promise<Store | null>;

  list(params: { cursor?: string; limit?: number }): Promise<{
    items: Store[];
    nextCursor?: string;
  }>;

  save(store: Store): Promise<void>;
}
