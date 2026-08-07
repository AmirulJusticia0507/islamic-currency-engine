const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const GoldPrice = sequelize.define(
  "GoldPrice",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    price_per_gram_usd: { type: DataTypes.DECIMAL(18, 4), allowNull: false },
    price_per_dinar_usd: { type: DataTypes.DECIMAL(18, 4), allowNull: false },
    source: { type: DataTypes.STRING(30), allowNull: false },
    recorded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "gold_prices", timestamps: false }
);

module.exports = GoldPrice;