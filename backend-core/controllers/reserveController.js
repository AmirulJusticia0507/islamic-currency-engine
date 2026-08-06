const { GoldReserve } = require("../models");
const { auditReserveRatio } = require("../utils/auditEngine");
const { rsaSign, getPublicKey } = require("../utils/keys");

exports.createReserve = async (req, res) => {
  const { vault_location, total_gram_gold } = req.body;
  if (!vault_location || !(Number(total_gram_gold) > 0)) {
    return res.status(400).json({ error: "vault_location dan total_gram_gold (>0) wajib diisi" });
  }
  const auditor_signature = rsaSign(`vault:${vault_location}:${total_gram_gold}`);
  const reserve = await GoldReserve.create({ vault_location, total_gram_gold, auditor_signature });
  res.status(201).json({ reserve });
};

exports.listReserves = async (req, res) => {
  const reserves = await GoldReserve.findAll();
  res.json({ reserves });
};

exports.audit = async (req, res) => {
  const audit = await auditReserveRatio();
  res.json({ audit });
};
