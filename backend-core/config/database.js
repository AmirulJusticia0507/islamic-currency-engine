require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");

const dialect = process.env.DB_DIALECT || "mysql";

let sequelize;

if (dialect === "sqlite") {
  const sqlitePath = path.resolve(__dirname, "..", process.env.SQLITE_PATH || "./data/idce.sqlite");
  fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: sqlitePath,
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.NEWSQL_DB || "islamic_currency_db",
    process.env.NEWSQL_USER || "root",
    process.env.NEWSQL_PASSWORD || "",
    {
      host: process.env.NEWSQL_HOST || "127.0.0.1",
      port: parseInt(process.env.NEWSQL_PORT || "4000", 10),
      dialect: "mysql",
      dialectOptions: {
        ssl: process.env.NEWSQL_SSL === "true" ? { rejectUnauthorized: true } : undefined,
      },
      logging: false,
      pool: { max: 20, min: 2, idle: 10000 },
    }
  );
}

module.exports = sequelize;
