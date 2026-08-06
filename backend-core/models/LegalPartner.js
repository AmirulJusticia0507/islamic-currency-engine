const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LegalPartner = sequelize.define(
  "LegalPartner",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    partner_type: {
      type: DataTypes.ENUM("NOTARIS", "PENGACARA", "DEWAN_PENGAWAS_SYARIAH"),
      allowNull: false,
    },
    official_name: { type: DataTypes.STRING(150), allowNull: false },
    license_number: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    public_key_pem: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM("ACTIVE", "SUSPENDED"), defaultValue: "ACTIVE" },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "legal_partners", timestamps: false }
);

module.exports = LegalPartner;
