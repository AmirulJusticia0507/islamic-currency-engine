const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const GoldReserve = sequelize.define(
  "GoldReserve",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    vault_location: { type: DataTypes.STRING(100), allowNull: false },
    total_gram_gold: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
    auditor_signature: { type: DataTypes.TEXT, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "gold_reserves", timestamps: false }
);

module.exports = GoldReserve;
