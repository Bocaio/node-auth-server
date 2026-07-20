import { createPool } from "mysql2";
import { Kysely, MysqlDialect } from "kysely";
import { Database } from "../types/index.js";
import { CONFIGS } from "./index.js";

const dialect = new MysqlDialect({
  pool: createPool({
    host: CONFIGS.DB_HOST,
    port: CONFIGS.DB_PORT,
    user: CONFIGS.DB_USER,
    database: CONFIGS.DB_NAME,
    password: CONFIGS.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  }),
});

const database = new Kysely<Database>({ dialect });

export default database;
