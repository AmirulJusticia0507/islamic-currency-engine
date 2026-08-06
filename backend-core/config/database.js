require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");

const dialect = process.env.DB_DIALECT || "sqlite";

let sequelize;

if (dialect === "sqlite") {
  const sqlitePath = path.resolve(__dirname, "..", process.env.SQLITE_PATH || "./data/idce.sqlite");
  fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: sqlitePath,
    logging: false,
  });
} else if (dialect === "postgres") {
  // CockroachDB (NewSQL) menggunakan protokol PostgreSQL
  sequelize = new Sequelize(
    process.env.COCKROACH_DB || "islamic_currency_db",
    process.env.COCKROACH_USER || "root",
    process.env.COCKROACH_PASSWORD || "",
    {
      host: process.env.COCKROACH_HOST || "127.0.0.1",
      port: parseInt(process.env.COCKROACH_PORT || "26257", 10),
      dialect: "postgres",
      dialectOptions: {
        ssl: process.env.COCKROACH_SSL === "true" ? { rejectUnauthorized: false } : undefined,
      },
      logging: false,
      pool: { max: 20, min: 2, idle: 10000 },
    }
  );
} else {
  throw new Error(`DB_DIALECT tidak dikenal: "${dialect}". Gunakan "sqlite" (dev) atau "postgres" (CockroachDB).`);
}

module.exports = sequelize;
