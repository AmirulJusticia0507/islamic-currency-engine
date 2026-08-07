const QRCode = require("qrcode");
const { UserWallet } = require("../models");
const { buildQrisPayload } = require("../utils/qris");

exports.getPayload = async (req, res) => {
  const { wallet_address } = req.params;
  const wallet = await UserWallet.findByPk(wallet_address);
  if (!wallet) return res.status(404).json({ error: "wallet tidak ditemukan" });

  const amount = req.query.amount ? Number(req.query.amount) : undefined;
  const payload = buildQrisPayload({ walletAddress: wallet_address, merchantName: `IDCE:${wallet.user_id}`, amount });
  res.json({ payload, wallet_address, amount: amount || null });
};

exports.getImage = async (req, res) => {
  const { wallet_address } = req.params;
  const wallet = await UserWallet.findByPk(wallet_address);
  if (!wallet) return res.status(404).json({ error: "wallet tidak ditemukan" });

  const amount = req.query.amount ? Number(req.query.amount) : undefined;
  const payload = buildQrisPayload({ walletAddress: wallet_address, merchantName: `IDCE:${wallet.user_id}`, amount });

  const dataUrl = await QRCode.toDataURL(payload, { margin: 2, width: 480, errorCorrectionLevel: "M" });
  res.json({ dataUrl, payload, wallet_address, amount: amount || null });
};