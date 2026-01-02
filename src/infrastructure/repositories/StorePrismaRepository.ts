import { Injectable } from '@nestjs/common';
import type { Store as StoreRow } from '@prisma/client';

import { PrismaService } from '@/infrastructure/db/PrismaService';
import { Store } from '@/domain/tenant/aggregates/Store';

import type { StoreRepositoryPort } from '@/application/tenant/ports/repositories/StoreRepository.port';

@Injectable()
export class StorePrismaRepository implements StoreRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(storeId: string): Promise<Store | null> {
    const row = await this.prisma.store.findUnique({ where: { storeId } });
    return row ? this.toDomain(row) : null;
  }

  async findByName(name: string): Promise<Store | null> {
    const row = await this.prisma.store.findFirst({ where: { name } });
    return row ? this.toDomain(row) : null;
  }

  async findByDomain(domain: string): Promise<Store | null> {
    const row = await this.prisma.store.findUnique({ where: { domain } });
    return row ? this.toDomain(row) : null;
  }

  async list(params: {
    cursor?: string;
    limit?: number;
  }): Promise<{ items: Store[]; nextCursor?: string }> {
    const limit = params.limit ?? 50;

    const rows = await this.prisma.store.findMany({
      take: limit + 1,
      ...(params.cursor ? { skip: 1, cursor: { storeId: params.cursor } } : {}),
      orderBy: { storeId: 'asc' },
    });

    const hasMore = rows.length > limit;
    const slice = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? slice[slice.length - 1].storeId : undefined;

    return { items: slice.map((r) => this.toDomain(r)), nextCursor };
  }

  async save(store: Store): Promise<void> {
    await this.prisma.store.upsert({
      where: { storeId: store.storeId },
      update: {
        domain: store.domain,
        name: store.name ?? null,
        status: store.status,
      },
      create: {
        id: store.idValue,
        storeId: store.storeId,
        domain: store.domain,
        name: store.name ?? null,
        status: store.status,
      },
    });
  }

  private toDomain(row: StoreRow): Store {
    return Store.hydrate({
      id: row.id,
      storeId: row.storeId,
      domain: row.domain,
      name: row.name,
      status: row.status as 'ACTIVE' | 'ARCHIVED',
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
