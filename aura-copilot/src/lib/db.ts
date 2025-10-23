// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

/**
 * Use a global singleton in dev to avoid exhausting DB connections
 * when Next.js hot-reloads route files.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'], // keep logs tame
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}


