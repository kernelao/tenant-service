import { Entity } from '@/domain/shared/base/Entity';
import { UniqueEntityId } from '@/domain/shared/base/UniqueEntityId';

import { ActorId } from '@/domain/audit/value-objects/ActorId';
import type { AuditAction } from '@/domain/audit/value-objects/AuditAction';
import type { AuditTargetType } from '@/domain/audit/value-objects/AuditTargetType';
import { CorrelationId } from '@/domain/audit/value-objects/CorrelationId';

import { StoreId } from '@/domain/tenant/value-objects/StoreId';

type Props = {
  actorId: ActorId;
  action: AuditAction;

  storeId?: StoreId;

  targetType?: AuditTargetType;
  targetId?: string;

  correlationId: CorrelationId;
  createdAt: Date;

  ipHash?: string;
  userAgentHash?: string;
};

export class AuditLog extends Entity<Props> {
  private constructor(props: Props, id?: UniqueEntityId) {
    super(props, id);
  }

  get actorId(): ActorId {
    return this.props.actorId;
  }
  get action(): AuditAction {
    return this.props.action;
  }
  get storeId(): StoreId | undefined {
    return this.props.storeId;
  }
  get targetType(): AuditTargetType | undefined {
    return this.props.targetType;
  }
  get targetId(): string | undefined {
    return this.props.targetId;
  }
  get correlationId(): CorrelationId {
    return this.props.correlationId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get ipHash(): string | undefined {
    return this.props.ipHash;
  }
  get userAgentHash(): string | undefined {
    return this.props.userAgentHash;
  }

  static record(params: {
    actorId: ActorId;
    action: AuditAction;
    correlationId: CorrelationId;
    storeId?: StoreId;
    targetType?: AuditTargetType;
    targetId?: string;
    ipHash?: string;
    userAgentHash?: string;
    id?: UniqueEntityId;
  }): AuditLog {
    return new AuditLog(
      {
        actorId: params.actorId,
        action: params.action,
        storeId: params.storeId,
        targetType: params.targetType,
        targetId: params.targetId,
        correlationId: params.correlationId,
        createdAt: new Date(),
        ipHash: params.ipHash,
        userAgentHash: params.userAgentHash,
      },
      params.id,
    );
  }
}
