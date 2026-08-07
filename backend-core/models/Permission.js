const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Permission = sequelize.define(
  "Permission",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "permissions", timestamps: false }
);

module.exports = Permission;