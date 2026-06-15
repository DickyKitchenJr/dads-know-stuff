import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

declare global {
  // Avoid creating extra clients during hot reload in development.
  var prisma: PrismaClient | undefined;
  var prismaAdapter: PrismaMariaDb | undefined;
}

const adapter =
  global.prismaAdapter ??
  new PrismaMariaDb({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE_NAME,
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  global.prismaAdapter = adapter;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
