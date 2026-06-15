import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

type MariaDbConfig = {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
};

function getMariaDbConfig(): MariaDbConfig {
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USERNAME;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE_NAME;
  const port = process.env.MYSQL_PORT
    ? Number(process.env.MYSQL_PORT)
    : undefined;

  if (host && user && password && database) {
    return { host, user, password, database, port };
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error(
      "Database config is missing. Set MYSQL_* vars or DATABASE_URL.",
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(dbUrl);
  } catch {
    throw new Error("DATABASE_URL is invalid and could not be parsed.");
  }

  if (parsedUrl.protocol !== "mysql:") {
    throw new Error("DATABASE_URL must use mysql:// protocol.");
  }

  const parsedDatabase = parsedUrl.pathname.replace(/^\//, "");
  if (!parsedUrl.hostname || !parsedUrl.username || !parsedDatabase) {
    throw new Error(
      "DATABASE_URL must include host, username, and database name.",
    );
  }

  return {
    host: parsedUrl.hostname,
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    database: decodeURIComponent(parsedDatabase),
    port: parsedUrl.port ? Number(parsedUrl.port) : undefined,
  };
}

declare global {
  // Avoid creating extra clients during hot reload in development.
  var prisma: PrismaClient | undefined;
  var prismaAdapter: PrismaMariaDb | undefined;
}

const adapter = global.prismaAdapter ?? new PrismaMariaDb(getMariaDbConfig());

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
