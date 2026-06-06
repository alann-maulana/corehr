import knex from "knex";

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST || "localhost",
    port: Number(process.env.DATABASE_PORT) || 3306,
    database: process.env.DATABASE_NAME || "corehr",
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "",
    charset: "utf8mb4",
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },
  migrations: {
    directory: "./migrations",
    extension: "ts",
  },
});

export default db;
