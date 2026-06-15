import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

type MariaDbConfig = {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
};

function getMariaDbConfigFromUrl(dbUrl: string): MariaDbConfig {
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

function getMariaDbConfig(): { config: MariaDbConfig; source: string } {
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USERNAME;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE_NAME;
  const port = process.env.MYSQL_PORT
    ? Number(process.env.MYSQL_PORT)
    : undefined;

  if (host && user && password && database) {
    return {
      config: { host, user, password, database, port },
      source: "MYSQL_*",
    };
  }

  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    return {
      config: getMariaDbConfigFromUrl(dbUrl),
      source: "DATABASE_URL",
    };
  }

  throw new Error(
    "Database config is missing. Set MYSQL_* vars or DATABASE_URL.",
  );
}

declare global {
  // Avoid creating extra clients during hot reload in development.
  var prisma: PrismaClient | undefined;
  var prismaAdapter: PrismaMariaDb | undefined;
}

const dbConfig = getMariaDbConfig();

if (process.env.NODE_ENV === "production") {
  console.info("Prisma DB config detected", {
    source: dbConfig.source,
    host: dbConfig.config.host,
    user: dbConfig.config.user,
    database: dbConfig.config.database,
    port: dbConfig.config.port ?? 3306,
  });
}

const adapter =
  global.prismaAdapter ??
  new PrismaMariaDb(dbConfig.config, {
    onConnectionError: (err) => {
      console.error("Prisma MariaDB connection error", {
        code: err.code,
        errno: err.errno,
        sqlState: err.sqlState,
        message: err.message,
      });
    },
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
