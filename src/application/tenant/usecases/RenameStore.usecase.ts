import type { RequestContext } from '@/application/shared/RequestContext';
import type { IdempotencyService } from '@/application/shared/Idempotency';
import { NotFoundError } from '@/application/shared/AppError';

import { AuditWriter } from '@/application/audit/services/AuditWriter';
import type { StoreRepositoryPort } from '@/application/tenant/ports/repositories/StoreRepository.port';

type Command = {
  storeId: string;
  newName: string;
  idempotencyKey: string;
  actorId: string;
};

export class RenameStoreUseCase {
  constructor(
    private readonly stores: StoreRepositoryPort,
    private readonly idempotency: IdempotencyService,
    private readonly audit: AuditWriter,
  ) {}

  async execute(
    ctx: RequestContext,
    cmd: Command,
  ): Promise<{ storeId: string; name: string | null }> {
    return this.idempotency.run({
      key: `store:rename:${cmd.idempotencyKey}`,
      ttlSeconds: 60 * 10,
      handler: async () => {
        const store = await this.stores.findById(cmd.storeId);
        if (!store) throw new NotFoundError('Store not found');

        store.rename(cmd.newName);
        await this.stores.save(store);

        await this.audit.writeFromCtx(ctx, {
          actorId: cmd.actorId,
          action: 'STORE_RENAMED',
          storeId: store.storeId,
          targetType: 'STORE',
          targetId: store.storeId,
        });

        return { storeId: store.storeId, name: store.name ?? null };
      },
    });
  }
}
