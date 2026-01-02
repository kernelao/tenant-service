import type { StoreRepositoryPort } from '@/application/tenant/ports/repositories/StoreRepository.port';
import type { RequestContext } from '@/application/shared/RequestContext';
import { NotFoundError } from '@/application/shared/AppError';

type Query = { storeId: string };

export class GetStoreUseCase {
  constructor(private readonly stores: StoreRepositoryPort) {}

  async execute(
    _ctx: RequestContext,
    query: Query,
  ): Promise<{
    storeId: string;
    domain: string;
    name: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  }> {
    const store = await this.stores.findById(query.storeId);
    if (!store) throw new NotFoundError('Store not found');

    return {
      storeId: store.storeId,
      domain: store.domain,
      name: store.name ?? null,
      status: store.status,
      createdAt: store.createdAt.toISOString(),
      updatedAt: store.updatedAt.toISOString(),
    };
  }
}
