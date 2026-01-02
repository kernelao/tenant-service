import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';

/* =========================
 * USE CASES
 * ========================= */
import { CreateStoreUseCase } from '@/application/tenant/usecases/CreateStore.usecase';
import { RenameStoreUseCase } from '@/application/tenant/usecases/RenameStore.usecase';
import { ArchiveStoreUseCase } from '@/application/tenant/usecases/ArchiveStore.usecase';
import { GetStoreUseCase } from '@/application/tenant/usecases/GetStore.usecase';
import { ListStoresUseCase } from '@/application/tenant/usecases/ListStores.usecase';

/* =========================
 * PORTS
 * ========================= */
import type { StoreRepositoryPort } from '@/application/tenant/ports/repositories/StoreRepository.port';
import type { IdGeneratorPort } from '@/application/shared/ports/IdGenerator.port';
import type { IdempotencyService } from '@/application/shared/Idempotency';
import { AuditWriter } from '@/application/audit/services/AuditWriter';

@Module({
  imports: [InfrastructureModule],
  providers: [
    {
      provide: CreateStoreUseCase,
      useFactory: (
        repo: StoreRepositoryPort,
        ids: IdGeneratorPort,
        idempotency: IdempotencyService,
        auditWriter: AuditWriter,
      ) => new CreateStoreUseCase(repo, ids, idempotency, auditWriter),
      inject: ['StoreRepositoryPort', 'IdGeneratorPort', 'IdempotencyService', AuditWriter],
    },
    {
      provide: RenameStoreUseCase,
      useFactory: (
        repo: StoreRepositoryPort,
        idempotency: IdempotencyService,
        auditWriter: AuditWriter,
      ) => new RenameStoreUseCase(repo, idempotency, auditWriter),
      inject: ['StoreRepositoryPort', 'IdempotencyService', AuditWriter],
    },
    {
      provide: ArchiveStoreUseCase,
      useFactory: (
        repo: StoreRepositoryPort,
        idempotency: IdempotencyService,
        auditWriter: AuditWriter,
      ) => new ArchiveStoreUseCase(repo, idempotency, auditWriter),
      inject: ['StoreRepositoryPort', 'IdempotencyService', AuditWriter],
    },
    {
      provide: GetStoreUseCase,
      useFactory: (repo: StoreRepositoryPort) => new GetStoreUseCase(repo),
      inject: ['StoreRepositoryPort', AuditWriter],
    },
    {
      provide: ListStoresUseCase,
      useFactory: (repo: StoreRepositoryPort) => new ListStoresUseCase(repo),
      inject: ['StoreRepositoryPort', AuditWriter],
    },
  ],
  exports: [
    CreateStoreUseCase,
    RenameStoreUseCase,
    ArchiveStoreUseCase,
    GetStoreUseCase,
    ListStoresUseCase,
  ],
})
export class ApplicationModule {}
