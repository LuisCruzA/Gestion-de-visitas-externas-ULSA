//instancia global a la base de datos no modificar
import { PrismaClient } from '@prisma/client'

// Hacemos que sea opcional para evitar problemas en hot reload
const globalForPrisma = global as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // opcional
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
