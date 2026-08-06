const crypto = require("crypto");
const { UserWallet } = require("../models");

exports.createWallet = async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "user_id wajib diisi" });
  const existing = await UserWallet.findOne({ where: { user_id } });
  if (existing) return res.status(200).json({ wallet: existing, reused: true });
  const wallet_address = "IDCE" + crypto.randomBytes(20).toString("hex").toUpperCase().slice(0, 60);
  const wallet = await UserWallet.create({ wallet_address, user_id, balance_dinar: 0 });
  res.status(201).json({ wallet });
};

exports.getWallet = async (req, res) => {
  const wallet = await UserWallet.findByPk(req.params.wallet_address);
  if (!wallet) return res.status(404).json({ error: "wallet tidak ditemukan" });
  res.json({ wallet });
};

exports.getBalance = async (req, res) => {
  const wallet = await UserWallet.findByPk(req.params.wallet_address);
  if (!wallet) return res.status(404).json({ error: "wallet tidak ditemukan" });
  res.json({ balance_dinar: wallet.balance_dinar, wallet_address: wallet.wallet_address });
};
