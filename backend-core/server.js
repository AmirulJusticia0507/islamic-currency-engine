require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });
    console.log(`[db] ${process.env.DB_DIALECT === "postgres" ? "CockroachDB (NewSQL)" : "SQLite (dev)"} terhubung`);
    app.listen(PORT, () => {
      console.log(`[server] Islamic Currency Engine berjalan di http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("[db] gagal terhubung:", err.message);
    process.exit(1);
  }
}

start();
