import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Use Neon’s pooled DATABASE_URL on Vercel (host like ep-xxx-pooler.region.aws.neon.tech, port 5432, sslmode=require).
 * The same URL works locally after you paste it into .env.local.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
