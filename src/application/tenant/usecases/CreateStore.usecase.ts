import type { RequestContext } from '@/application/shared/RequestContext';
import type { IdempotencyService } from '@/application/shared/Idempotency';
import type { IdGeneratorPort } from '@/application/shared/ports/IdGenerator.port';

import { Store } from '@/domain/tenant/aggregates/Store';

import { AuditWriter } from '@/application/audit/services/AuditWriter';
import type { StoreRepositoryPort } from '@/application/tenant/ports/repositories/StoreRepository.port';

type Command = {
  storeId: string;
  domain: string;
  name?: string;
  idempotencyKey: string;
  actorId: string;
};

export class CreateStoreUseCase {
  constructor(
    private readonly stores: StoreRepositoryPort,
    private readonly ids: IdGeneratorPort,
    private readonly idempotency: IdempotencyService,
    private readonly audit: AuditWriter,
  ) {}

  async execute(ctx: RequestContext, cmd: Command): Promise<{ storeId: string }> {
    return this.idempotency.run({
      key: `store:create:${cmd.idempotencyKey}`,
      ttlSeconds: 60 * 10,
      handler: async () => {
        const id = this.ids.uuid();

        const store = Store.create({
          id,
          storeId: cmd.storeId,
          domain: cmd.domain,
          name: cmd.name,
        });

        await this.stores.save(store);

        await this.audit.writeFromCtx(ctx, {
          actorId: cmd.actorId,
          action: 'STORE_CREATED',
          storeId: store.storeId,
          targetType: 'STORE',
          targetId: store.storeId,
        });

        return { storeId: store.storeId };
      },
    });
  }
}
