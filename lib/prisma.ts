import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '@/lib/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function makePrisma () {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  const pool = new Pool({ connectionString: url })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
  })
}

export const prisma = globalForPrisma.prisma ?? makePrisma()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
