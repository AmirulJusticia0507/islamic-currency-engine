const sequelize = require("../config/database");
const GoldReserve = require("./GoldReserve");
const UserWallet = require("./UserWallet");
const SyariahTransaction = require("./SyariahTransaction");
const LegalPartner = require("./LegalPartner");
const LegalContract = require("./LegalContract");

SyariahTransaction.belongsTo(UserWallet, { foreignKey: "sender_wallet", targetKey: "wallet_address", as: "sender" });
SyariahTransaction.belongsTo(UserWallet, { foreignKey: "receiver_wallet", targetKey: "wallet_address", as: "receiver" });
LegalContract.belongsTo(LegalPartner, { foreignKey: "legal_partner_id", as: "partner" });

module.exports = {
  sequelize,
  GoldReserve,
  UserWallet,
  SyariahTransaction,
  LegalPartner,
  LegalContract,
};
