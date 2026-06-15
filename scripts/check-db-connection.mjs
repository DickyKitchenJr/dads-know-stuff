import "dotenv/config";
import mariadb from "mariadb";

function fromDatabaseUrl() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return null;
  }

  try {
    const parsed = new URL(dbUrl);
    if (parsed.protocol !== "mysql:") {
      return null;
    }

    const database = parsed.pathname.replace(/^\//, "");
    if (!parsed.hostname || !parsed.username || !database) {
      return null;
    }

    return {
      host: parsed.hostname,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: decodeURIComponent(database),
      port: parsed.port ? Number(parsed.port) : 3306,
    };
  } catch {
    return null;
  }
}

function envConfig() {
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USERNAME;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE_NAME;
  const port = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306;

  if (!host || !user || !password || !database) {
    return null;
  }

  return { host, user, password, database, port };
}

function toPrintable(config) {
  return {
    host: config.host,
    user: config.user,
    database: config.database,
    port: config.port,
  };
}

async function tryConfig(baseConfig, label) {
  const candidates = [baseConfig.host, "127.0.0.1", "localhost"].filter(
    (value, index, arr) => value && arr.indexOf(value) === index,
  );

  for (const host of candidates) {
    const testConfig = {
      ...baseConfig,
      host,
      connectTimeout: 5000,
      acquireTimeout: 5000,
      socketTimeout: 5000,
      connectionLimit: 1,
    };

    let conn;
    try {
      conn = await mariadb.createConnection(testConfig);
      const rows = await conn.query("SELECT 1 AS ok");
      console.log("DB check success", {
        source: label,
        config: toPrintable(testConfig),
        sample: rows?.[0] ?? null,
      });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("DB check failed", {
        source: label,
        config: toPrintable(testConfig),
        message,
      });
    } finally {
      if (conn) {
        await conn.end();
      }
    }
  }

  return false;
}

async function main() {
  const configs = [];

  const fromEnv = envConfig();
  if (fromEnv) {
    configs.push({ label: "MYSQL_*", config: fromEnv });
  }

  const fromUrl = fromDatabaseUrl();
  if (fromUrl) {
    configs.push({ label: "DATABASE_URL", config: fromUrl });
  }

  if (configs.length === 0) {
    console.error(
      "No DB config found. Set MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DATABASE_NAME or DATABASE_URL.",
    );
    process.exit(1);
  }

  for (const { label, config } of configs) {
    const ok = await tryConfig(config, label);
    if (ok) {
      process.exit(0);
    }
  }

  process.exit(1);
}

await main();
