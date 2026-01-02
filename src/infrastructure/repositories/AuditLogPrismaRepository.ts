import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/db/PrismaService';

import type { AuditLogRepositoryPort } from '@/application/audit/ports/AuditLogRepository.port';
import { AuditLog } from '@/domain/audit/aggregates/AuditLog';

@Injectable()
export class AuditLogPrismaRepository implements AuditLogRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async append(entry: AuditLog): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        id: entry.id.value,
        actorId: entry.actorId.value,
        action: entry.action,

        storeId: entry.storeId?.value ?? null,
        targetType: entry.targetType ?? null,
        targetId: entry.targetId ?? null,

        correlationId: entry.correlationId.value,
        ipHash: entry.ipHash ?? null,
        userAgentHash: entry.userAgentHash ?? null,
        // createdAt géré par Prisma @default(now())
      },
    });
  }
}
