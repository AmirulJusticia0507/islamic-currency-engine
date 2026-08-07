const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Escrow = sequelize.define(
  "Escrow",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    reference: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    payer_wallet: { type: DataTypes.STRING(64), allowNull: false },
    payee_wallet: { type: DataTypes.STRING(64), allowNull: false },
    amount_dinar: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
    underlying_gold_gram: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
    reason: { type: DataTypes.STRING(255), allowNull: true },
    status: { type: DataTypes.ENUM("HOLDING", "RELEASED", "REFUNDED", "DISPUTED"), defaultValue: "HOLDING" },
    released_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "escrows", timestamps: false }
);

module.exports = Escrow;