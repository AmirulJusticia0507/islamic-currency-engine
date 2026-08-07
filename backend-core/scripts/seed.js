require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, UserWallet, GoldReserve, LegalPartner, User } = require("../models");
const { seedAcl } = require("../config/seedAcl");
const { rsaSign, getPublicKey } = require("../utils/keys");
const { dinarToGoldGram } = require("../utils/shariahValidator");
const { atomicTransfer } = require("../utils/ledger");

async function seed() {
  await sequelize.sync({ alter: false });
  const roles = await seedAcl();
  const roleByName = Object.fromEntries(roles.map((r) => [r.name, r]));

  const [admin] = await User.findOrCreate({ where: { user_id: "admin" }, defaults: { password_hash: bcrypt.hashSync("admin123", 10) } });
  await admin.addRole(roleByName.ADMIN);
  const [auditor] = await User.findOrCreate({ where: { user_id: "auditor" }, defaults: { password_hash: bcrypt.hashSync("audit123", 10) } });
  await auditor.addRole(roleByName.AUDITOR);
  const [notary] = await User.findOrCreate({ where: { user_id: "notaris" }, defaults: { password_hash: bcrypt.hashSync("notar123", 10) } });
  await notary.addRole(roleByName.NOTARY);
  const [user] = await User.findOrCreate({ where: { user_id: "user" }, defaults: { password_hash: bcrypt.hashSync("user123", 10) } });
  await user.addRole(roleByName.USER);

  const [alice] = await UserWallet.findOrCreate({ where: { user_id: "alice" }, defaults: { wallet_address: "IDCEALICE" + "A".repeat(50), balance_dinar: 1000 } });
  const [bob] = await UserWallet.findOrCreate({ where: { user_id: "bob" }, defaults: { wallet_address: "IDCEBOB" + "B".repeat(50), balance_dinar: 0 } });

  const [vault] = await GoldReserve.findOrCreate({
    where: { vault_location: "Krakatau Vault - Jakarta" },
    defaults: {
      total_gram_gold: 10000,
      auditor_signature: rsaSign("vault:Krakatau Vault - Jakarta:10000"),
    },
  });

  const [notaryPartner] = await LegalPartner.findOrCreate({
    where: { license_number: "SK-2024-0001" },
    defaults: {
      partner_type: "NOTARIS",
      official_name: "Notaris H. Abdul Rahman, S.H., M.Kn.",
      license_number: "SK-2024-0001",
      public_key_pem: getPublicKey(),
    },
  });

  const tx = await atomicTransfer({
    sender: alice.wallet_address,
    receiver: bob.wallet_address,
    amount: 100,
    akadType: "SARF",
    goldGram: dinarToGoldGram(100),
    note: "seed transfer akad sarf",
  });

  console.log("Seed selesai:", { alice: alice.wallet_address, bob: bob.wallet_address, admin: "admin/admin123", auditor: "auditor/audit123", notaris: "notaris/notar123", txStatus: tx.status });
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
