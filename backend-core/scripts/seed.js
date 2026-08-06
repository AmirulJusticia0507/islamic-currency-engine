require("dotenv").config();
const { sequelize, UserWallet, GoldReserve, LegalPartner } = require("../models");
const { rsaSign, getPublicKey } = require("../utils/keys");
const { dinarToGoldGram } = require("../utils/shariahValidator");
const { atomicTransfer } = require("../utils/ledger");

async function seed() {
  await sequelize.sync({ alter: false });

  const [alice] = await UserWallet.findOrCreate({ where: { user_id: "alice" }, defaults: { wallet_address: "IDCEALICE" + "A".repeat(50), balance_dinar: 1000 } });
  const [bob] = await UserWallet.findOrCreate({ where: { user_id: "bob" }, defaults: { wallet_address: "IDCEBOB" + "B".repeat(50), balance_dinar: 0 } });

  const [vault] = await GoldReserve.findOrCreate({
    where: { vault_location: "Krakatau Vault - Jakarta" },
    defaults: {
      total_gram_gold: 10000,
      auditor_signature: rsaSign("vault:Krakatau Vault - Jakarta:10000"),
    },
  });

  const [notary] = await LegalPartner.findOrCreate({
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

  console.log("Seed selesai:", { alice: alice.wallet_address, bob: bob.wallet_address, vault: vault.vault_location, notary: notary.official_name, txStatus: tx.status });
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
