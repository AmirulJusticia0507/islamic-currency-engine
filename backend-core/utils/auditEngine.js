// Syariah Audit Engine - memastikan 100% asset-backed (Solvent)
const { GoldReserve, UserWallet } = require("../models");
const { DINAR_GRAM } = require("./shariahValidator");
const { rsaVerify, getPublicKey } = require("./keys");

async function auditReserveRatio() {
  const reserves = await GoldReserve.findAll();
  const totalGram = reserves.reduce((sum, r) => sum + Number(r.total_gram_gold), 0);

  const wallets = await UserWallet.findAll();
  const totalCirculation = wallets.reduce((sum, w) => sum + Number(w.balance_dinar), 0);
  const requiredGram = totalCirculation * DINAR_GRAM;

  const ratio = totalGram === 0 ? 0 : Number(((requiredGram / totalGram) * 100).toFixed(2));

  const verified = reserves.map((r) => {
    let valid = false;
    try {
      valid = rsaVerify(`vault:${r.vault_location}:${r.total_gram_gold}`, r.auditor_signature, getPublicKey());
    } catch {
      valid = false;
    }
    return { id: r.id, vault_location: r.vault_location, total_gram_gold: r.total_gram_gold, auditor_signature_valid: valid };
  });

  return {
    total_reserve_gram: totalGram,
    total_circulation_dinar: totalCirculation,
    required_reserve_gram: Number(requiredGram.toFixed(6)),
    protection_ratio_percent: ratio,
    solvent: ratio >= 100,
    vaults: verified,
  };
}

module.exports = { auditReserveRatio };
