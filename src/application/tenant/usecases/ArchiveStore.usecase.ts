import type { RequestContext } from '@/application/shared/RequestContext';
import type { IdempotencyService } from '@/application/shared/Idempotency';
import { NotFoundError } from '@/application/shared/AppError';

import { AuditWriter } from '@/application/audit/services/AuditWriter';
import type { StoreRepositoryPort } from '@/application/tenant/ports/repositories/StoreRepository.port';

type Command = {
  storeId: string;
  idempotencyKey: string;
  actorId: string;
};

export class ArchiveStoreUseCase {
  constructor(
    private readonly stores: StoreRepositoryPort,
    private readonly idempotency: IdempotencyService,
    private readonly audit: AuditWriter,
  ) {}

  async execute(ctx: RequestContext, cmd: Command): Promise<{ success: true }> {
    return this.idempotency.run({
      key: `store:archive:${cmd.idempotencyKey}`,
      ttlSeconds: 60 * 10,
      handler: async () => {
        const store = await this.stores.findById(cmd.storeId);
        if (!store) throw new NotFoundError('Store not found');

        store.archive();
        await this.stores.save(store);

        await this.audit.writeFromCtx(ctx, {
          actorId: cmd.actorId,
          action: 'STORE_ARCHIVED',
          storeId: store.storeId,
          targetType: 'STORE',
          targetId: store.storeId,
        });

        return { success: true };
      },
    });
  }
}
