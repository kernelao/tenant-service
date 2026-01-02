import { randomUUID } from 'node:crypto';
import type { IdGeneratorPort } from '@/application/shared/ports/IdGenerator.port';

export class UuidGenerator implements IdGeneratorPort {
  uuid(): string {
    return randomUUID();
  }
}
