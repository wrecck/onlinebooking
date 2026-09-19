import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient | null {
  if (!connectionString) {
    console.warn("DATABASE_URL not set - database operations will not work");
    return null;
  }
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prismaInstance = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && prismaInstance) {
  globalForPrisma.prisma = prismaInstance;
}

export const prisma = prismaInstance;

export function getPrisma(): PrismaClient {
  if (!prisma) {
    throw new Error("DATABASE_URL environment variable is not set. Please configure your database connection.");
  }
  return prisma;
}

export default prisma;
