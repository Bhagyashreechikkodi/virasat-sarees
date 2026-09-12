import path from "path";
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function sqliteUrl() {
  const raw = process.env.DATABASE_URL;
  if (raw && !raw.startsWith("file:./dev.db") && raw !== "file:./dev.db") {
    return raw;
  }
  const file = path.join(process.cwd(), "prisma", "dev.db").replace(/\\/g, "/");
  return `file:${file}`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: sqliteUrl() } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
