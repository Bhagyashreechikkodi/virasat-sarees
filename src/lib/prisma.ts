import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Use Neon’s pooled DATABASE_URL (host like ep-xxx-pooler.region.aws.neon.tech, sslmode=require).
 * Next.js loads `.env.local`. Prisma CLI loads `.env` unless you run `npm run db:push` / `db:seed`
 * (those scripts pass `--env-file=.env.local`). Keep `.env` from staying on file:./dev.db.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
