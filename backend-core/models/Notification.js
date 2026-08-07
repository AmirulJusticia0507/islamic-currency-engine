const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notification = sequelize.define(
  "Notification",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.STRING(64), allowNull: false },
    type: { type: DataTypes.STRING(50), allowNull: false },
    title: { type: DataTypes.STRING(150), allowNull: false },
    body: { type: DataTypes.STRING(300), allowNull: true },
    read_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "notifications", timestamps: false }
);

module.exports = Notification;