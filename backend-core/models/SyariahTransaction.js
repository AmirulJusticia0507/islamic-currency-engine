const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SyariahTransaction = sequelize.define(
  "SyariahTransaction",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    transaction_hash: { type: DataTypes.STRING(64), unique: true, allowNull: false },
    sender_wallet: { type: DataTypes.STRING(64), allowNull: false },
    receiver_wallet: { type: DataTypes.STRING(64), allowNull: false },
    amount_dinar: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
    akad_type: { type: DataTypes.ENUM("SARF", "WADIAH", "UJRAH"), allowNull: false },
    underlying_gold_gram: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
    status: { type: DataTypes.ENUM("PENDING", "SUCCESS", "REJECTED"), defaultValue: "PENDING", allowNull: false },
    biometric_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    verified_device_id: { type: DataTypes.STRING(100), allowNull: true },
    notary_signature: { type: DataTypes.TEXT, allowNull: true },
    note: { type: DataTypes.STRING(255), allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "syariah_transactions", timestamps: false }
);

module.exports = SyariahTransaction;
