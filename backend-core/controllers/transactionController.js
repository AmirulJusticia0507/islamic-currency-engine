const { SyariahTransaction } = require("../models");
const { atomicTransfer } = require("../utils/ledger");
const { validateTransferPayload, validateAkad, dinarToGoldGram, buildCanonicalMessage } = require("../utils/shariahValidator");
const { rsaVerify, getPublicKey } = require("../utils/keys");
const { verifyBiometricToken } = require("../utils/biometric");

exports.transfer = async (req, res) => {
  const { sender, receiver, amount, akad_type, biometric_token } = req.body;

  const biometric = verifyBiometricToken(biometric_token);
  if (!biometric) {
    return res.status(401).json({ status: "REJECTED", reason: "biometric_token tidak valid / kedaluwarsa. Verifikasi sidik jari dulu." });
  }
  if (biometric.w !== sender) {
    return res.status(401).json({ status: "REJECTED", reason: "perangkat biometrik tidak terdaftar untuk wallet pengirim" });
  }

  const errors = validateTransferPayload({ sender, receiver, amount });
  if (errors.length) return res.status(400).json({ error: errors.join("; ") });
  if (!validateAkad(akad_type)) return res.status(400).json({ error: `akad_type harus salah satu dari SARF, WADIAH, UJRAH` });

  const goldGram = dinarToGoldGram(amount);
  const result = await atomicTransfer({
    sender,
    receiver,
    amount,
    akadType: akad_type,
    goldGram,
    biometricVerified: true,
    verifiedDeviceId: biometric.d,
  });

  if (!result.ok) return res.status(422).json({ status: result.status, reason: result.reason });
  res.status(201).json({
    status: result.status,
    transaction_hash: result.transaction.transaction_hash,
    akad_type,
    underlying_gold_gram: goldGram,
    biometric_verified: true,
    verified_device_id: biometric.d,
    notary_signature: result.notarySignature,
  });
};

exports.verifySignature = async (req, res) => {
  const { transaction_hash } = req.params;
  const tx = await SyariahTransaction.findOne({ where: { transaction_hash } });
  if (!tx) return res.status(404).json({ error: "transaksi tidak ditemukan" });
  const { body } = req;
  const canonical = buildCanonicalMessage(tx);
  const valid = rsaVerify(canonical, body.notary_signature || "", getPublicKey());
  res.json({ valid, transaction_hash });
};

exports.list = async (req, res) => {
  const transactions = await SyariahTransaction.findAll({ order: [["created_at", "DESC"]], limit: 100 });
  res.json({ transactions });
};

exports.getByHash = async (req, res) => {
  const tx = await SyariahTransaction.findOne({ where: { transaction_hash: req.params.transaction_hash } });
  if (!tx) return res.status(404).json({ error: "transaksi tidak ditemukan" });
  res.json({ transaction: tx });
};
