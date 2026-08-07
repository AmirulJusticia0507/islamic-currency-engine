const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BiometricDevice = sequelize.define(
  "BiometricDevice",
  {
    device_id: { type: DataTypes.STRING(100), primaryKey: true },
    wallet_address: { type: DataTypes.STRING(64), allowNull: false },
    device_name: { type: DataTypes.STRING(150), allowNull: false },
    status: { type: DataTypes.ENUM("ACTIVE", "REVOKED"), defaultValue: "ACTIVE" },
    last_verified_at: { type: DataTypes.DATE, allowNull: true },
    registered_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "authenticated_devices", timestamps: false }
);

module.exports = BiometricDevice;
