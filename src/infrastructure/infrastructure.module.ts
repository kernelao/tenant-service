import { Module } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/db/PrismaService';
import { StorePrismaRepository } from '@/infrastructure/repositories/StorePrismaRepository';
import { UuidGenerator } from '@/infrastructure/ids/UuidGenerator';
import { PrismaIdempotencyService } from '@/infrastructure/idempotency/PrismaIdempotencyService';

import { RateLimitService } from '@/application/shared/RateLimit';
import { InMemoryRateLimiter } from '@/infrastructure/ratelimit/InMemoryRateLimiter';
import { RateLimiterPort } from '@/application/shared/ports/RateLimiter.port';

// JWT verifier (PUBLIC KEY)
import { createJwtVerifierProvider } from 'libs/shared-auth';

@Module({
  providers: [
    PrismaService,

    // Repositories
    { provide: 'StoreRepositoryPort', useClass: StorePrismaRepository },

    // IDs
    { provide: 'IdGeneratorPort', useClass: UuidGenerator },

    // JWT verification (public key)
    createJwtVerifierProvider(),

    // Idempotency
    {
      provide: 'IdempotencyService',
      useFactory: (prisma: PrismaService) => new PrismaIdempotencyService(prisma),
      inject: [PrismaService],
    },

    // Rate limit (si tu veux)
    { provide: 'RateLimiterPort', useClass: InMemoryRateLimiter },
    {
      provide: 'RateLimitService',
      useFactory: (limiter: RateLimiterPort) => new RateLimitService(limiter),
      inject: ['RateLimiterPort'],
    },
  ],
  exports: [
    PrismaService,

    'StoreRepositoryPort',

    'IdGeneratorPort',

    'JwtVerifierPort',

    'IdempotencyService',

    'RateLimitService',
  ],
})
export class InfrastructureModule {}
