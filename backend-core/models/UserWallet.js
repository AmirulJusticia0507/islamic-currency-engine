const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserWallet = sequelize.define(
  "UserWallet",
  {
    wallet_address: { type: DataTypes.STRING(64), primaryKey: true },
    user_id: { type: DataTypes.STRING(64), unique: true, allowNull: false },
    balance_dinar: { type: DataTypes.DECIMAL(18, 6), defaultValue: 0, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "user_wallets", timestamps: false }
);

module.exports = UserWallet;
