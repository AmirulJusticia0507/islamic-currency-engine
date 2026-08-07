require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { ensureKeysExist, getPublicKey } = require("./utils/keys");
const walletRoutes = require("./routes/wallet.routes");
const transactionRoutes = require("./routes/transaction.routes");
const legalRoutes = require("./routes/legal.routes");
const reserveRoutes = require("./routes/reserve.routes");
const biometricRoutes = require("./routes/biometric.routes");
const qrisRoutes = require("./routes/qris.routes");
const authRoutes = require("./routes/auth.routes");
const { notFound, errorHandler } = require("./middleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => res.json({ status: "ok", engine: "islamic-currency-engine", time: new Date().toISOString() }));
app.get("/public-key", (req, res) => res.json({ public_key: getPublicKey() }));

app.use("/api/auth", authRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/legal", legalRoutes);
app.use("/api/reserves", reserveRoutes);
app.use("/api/biometric", biometricRoutes);
app.use("/api/qris", qrisRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

ensureKeysExist();
