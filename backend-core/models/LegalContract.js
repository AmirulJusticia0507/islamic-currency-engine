const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LegalContract = sequelize.define(
  "LegalContract",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    contract_number: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    legal_partner_id: { type: DataTypes.BIGINT, allowNull: false },
    transaction_hash: { type: DataTypes.STRING(64), allowNull: true },
    document_title: { type: DataTypes.STRING(200), allowNull: false },
    document_pdf_url: { type: DataTypes.TEXT, allowNull: false },
    notary_signature: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "legal_contracts", timestamps: false }
);

module.exports = LegalContract;
