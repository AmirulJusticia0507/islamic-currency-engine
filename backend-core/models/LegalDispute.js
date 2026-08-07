const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LegalDispute = sequelize.define(
  "LegalDispute",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    case_number: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    escrow_id: { type: DataTypes.BIGINT, allowNull: true },
    transaction_hash: { type: DataTypes.STRING(64), allowNull: true },
    party_a_wallet: { type: DataTypes.STRING(64), allowNull: false },
    party_b_wallet: { type: DataTypes.STRING(64), allowNull: false },
    amount_dinar: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
    claim: { type: DataTypes.TEXT, allowNull: false },
    adjudication: { type: DataTypes.STRING(100), defaultValue: "BASYARNAS" },
    mediator_wallet: { type: DataTypes.STRING(64), allowNull: true },
    status: { type: DataTypes.ENUM("OPEN", "RESOLVED", "DISMISSED"), defaultValue: "OPEN" },
    resolution: { type: DataTypes.TEXT, allowNull: true },
    resolved_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "legal_disputes", timestamps: false }
);

module.exports = LegalDispute;