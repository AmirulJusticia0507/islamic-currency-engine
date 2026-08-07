const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AuditLog = sequelize.define(
  "AuditLog",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    actor_user: { type: DataTypes.STRING(64), allowNull: true },
    action: { type: DataTypes.STRING(100), allowNull: false },
    entity: { type: DataTypes.STRING(100), allowNull: true },
    entity_id: { type: DataTypes.STRING(100), allowNull: true },
    meta: { type: DataTypes.STRING(500), allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "audit_logs", timestamps: false }
);

module.exports = AuditLog;