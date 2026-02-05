import { PrismaClient } from '@prisma/client'

const globalForPrismaInstance = globalThis as unknown as {
  prismaInstance: PrismaClient | null
}

const createPrismaClient = (): PrismaClient | null => {
  if (process.env.DATABASE_URL) {
    return new PrismaClient();
  }
  // Return null when no DATABASE_URL is set
  return null;
};

export const databaseClient =
  globalForPrismaInstance.prismaInstance ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && databaseClient) {
  globalForPrismaInstance.prismaInstance = databaseClient
}

export default databaseClient
