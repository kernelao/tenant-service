import type { StoreRepositoryPort } from '@/application/tenant/ports/repositories/StoreRepository.port';
import type { RequestContext } from '@/application/shared/RequestContext';

type Query = { cursor?: string; limit?: number };

export class ListStoresUseCase {
  constructor(private readonly stores: StoreRepositoryPort) {}

  async execute(
    _ctx: RequestContext,
    query: Query,
  ): Promise<{
    items: Array<{
      storeId: string;
      domain: string;
      name: string | null;
      status: string;
      createdAt: string;
      updatedAt: string;
    }>;
    nextCursor?: string;
  }> {
    const res = await this.stores.list({ cursor: query.cursor, limit: query.limit });

    return {
      items: res.items.map((s) => ({
        storeId: s.storeId,
        domain: s.domain,
        name: s.name ?? null,
        status: s.status,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      })),
      nextCursor: res.nextCursor,
    };
  }
}
