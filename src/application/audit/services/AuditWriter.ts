import { Inject, Injectable } from '@nestjs/common';

import type { RequestContext } from '@/application/shared/RequestContext';

import { AuditLog } from '@/domain/audit/aggregates/AuditLog';
import { ActorId } from '@/domain/audit/value-objects/ActorId';
import { CorrelationId } from '@/domain/audit/value-objects/CorrelationId';
import type { AuditAction } from '@/domain/audit/value-objects/AuditAction';
import type { AuditTargetType } from '@/domain/audit/value-objects/AuditTargetType';

import { StoreId } from '@/domain/tenant/value-objects/StoreId';

import type { AuditLogRepositoryPort } from '@/application/audit/ports/AuditLogRepository.port';
import { AUDIT_WRITER } from '@/application/audit/services/audit.token';

type WriteParams = {
  actorId: string; // <- string brut, le writer le transforme en VO
  action: AuditAction;
  storeId?: string;
  targetType?: AuditTargetType;
  targetId?: string;
};

@Injectable()
export class AuditWriter {
  constructor(@Inject(AUDIT_WRITER) private readonly repo: AuditLogRepositoryPort) {}

  async writeFromCtx(ctx: RequestContext, params: WriteParams): Promise<void> {
    const correlationId = CorrelationId.create(ctx.correlationId);

    const ipHash = typeof ctx.ipHash === 'string' ? ctx.ipHash : undefined;
    const userAgentHash = typeof ctx.userAgentHash === 'string' ? ctx.userAgentHash : undefined;

    const storeId = params.storeId ? StoreId.create(params.storeId) : undefined;

    const entry = AuditLog.record({
      actorId: ActorId.create(params.actorId),
      action: params.action,
      storeId,
      targetType: params.targetType,
      targetId: params.targetId,
      correlationId,
      ipHash,
      userAgentHash,
    });

    await this.repo.append(entry);
  }
}
