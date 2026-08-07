const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.STRING(64), unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    status: { type: DataTypes.ENUM("ACTIVE", "SUSPENDED"), defaultValue: "ACTIVE" },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "users", timestamps: false }
);

module.exports = User;