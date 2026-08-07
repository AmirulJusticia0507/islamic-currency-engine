const { BiometricDevice, UserWallet, sequelize } = require("../models");
const { issueBiometricToken } = require("../utils/biometric");

exports.registerDevice = async (req, res) => {
  const { wallet_address, device_id, device_name } = req.body;
  if (!wallet_address || !device_id || !device_name) {
    return res.status(400).json({ error: "wallet_address, device_id, device_name wajib diisi" });
  }
  const wallet = await UserWallet.findByPk(wallet_address);
  if (!wallet) return res.status(404).json({ error: "wallet tidak ditemukan" });

  const [device, created] = await BiometricDevice.findOrCreate({
    where: { device_id },
    defaults: { wallet_address, device_name, status: "ACTIVE" },
  });
  res.status(created ? 201 : 200).json({ device, created });
};

exports.listDevices = async (req, res) => {
  const { wallet_address } = req.query;
  const where = wallet_address ? { wallet_address } : {};
  const devices = await BiometricDevice.findAll({ where, order: [["registered_at", "DESC"]] });
  res.json({ devices });
};

exports.verify = async (req, res) => {
  const { wallet_address, device_id } = req.body;
  if (!wallet_address || !device_id) {
    return res.status(400).json({ error: "wallet_address dan device_id wajib diisi" });
  }
  const device = await BiometricDevice.findOne({ where: { device_id, wallet_address, status: "ACTIVE" } });
  if (!device) return res.status(404).json({ error: "perangkat biometrik belum terdaftar / nonaktif" });

  device.last_verified_at = new Date();
  await device.save();

  const token = issueBiometricToken(wallet_address, device_id);
  res.json({ ok: true, token, expires_in_seconds: 120, device_id });
};

exports.revokeDevice = async (req, res) => {
  const { device_id } = req.params;
  const device = await BiometricDevice.findByPk(device_id);
  if (!device) return res.status(404).json({ error: "perangkat tidak ditemukan" });
  device.status = "REVOKED";
  await device.save();
  res.json({ ok: true, device_id, status: device.status });
};