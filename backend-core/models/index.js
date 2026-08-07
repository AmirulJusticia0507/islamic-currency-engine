const sequelize = require("../config/database");
const GoldReserve = require("./GoldReserve");
const UserWallet = require("./UserWallet");
const SyariahTransaction = require("./SyariahTransaction");
const LegalPartner = require("./LegalPartner");
const LegalContract = require("./LegalContract");
const BiometricDevice = require("./BiometricDevice");
const User = require("./User");
const Role = require("./Role");
const Permission = require("./Permission");
const UserRole = require("./UserRole");
const RolePermission = require("./RolePermission");
const Escrow = require("./Escrow");
const LegalDispute = require("./LegalDispute");
const GoldPrice = require("./GoldPrice");
const AuditLog = require("./AuditLog");
const Notification = require("./Notification");

SyariahTransaction.belongsTo(UserWallet, { foreignKey: "sender_wallet", targetKey: "wallet_address", as: "sender" });
SyariahTransaction.belongsTo(UserWallet, { foreignKey: "receiver_wallet", targetKey: "wallet_address", as: "receiver" });
LegalContract.belongsTo(LegalPartner, { foreignKey: "legal_partner_id", as: "partner" });
BiometricDevice.belongsTo(UserWallet, { foreignKey: "wallet_address", targetKey: "wallet_address", as: "wallet" });

User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id", otherKey: "role_id", as: "roles" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id", otherKey: "user_id", as: "users" });
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "role_id", otherKey: "permission_id", as: "permissions" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permission_id", otherKey: "role_id", as: "roles" });

LegalDispute.belongsTo(Escrow, { foreignKey: "escrow_id", as: "escrow" });
Escrow.belongsTo(UserWallet, { foreignKey: "payee_wallet", targetKey: "wallet_address", as: "payee" });

module.exports = {
  sequelize,
  GoldReserve,
  UserWallet,
  SyariahTransaction,
  LegalPartner,
  LegalContract,
  BiometricDevice,
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  Escrow,
  LegalDispute,
  GoldPrice,
  AuditLog,
  Notification,
};
