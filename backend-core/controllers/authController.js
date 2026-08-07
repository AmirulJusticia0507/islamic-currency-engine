const bcrypt = require("bcryptjs");
const { User, Role } = require("../models");
const { signToken } = require("../middleware/auth");

exports.register = async (req, res) => {
  const { user_id, password, role } = req.body;
  if (!user_id || !password) return res.status(400).json({ error: "user_id dan password wajib diisi" });
  if (password.length < 6) return res.status(400).json({ error: "password minimal 6 karakter" });

  const existing = await User.findOne({ where: { user_id } });
  if (existing) return res.status(409).json({ error: "user_id sudah terdaftar" });

  const roleName = (role || "USER").toUpperCase();
  const roleRecord = await Role.findOne({ where: { name: roleName } });
  if (!roleRecord) return res.status(400).json({ error: `role tidak dikenal: ${roleName}` });

  const user = await User.create({ user_id, password_hash: bcrypt.hashSync(password, 10), status: "ACTIVE" });
  await user.addRole(roleRecord);

  res.status(201).json({ user: { user_id: user.user_id, roles: [roleName] }, token: signToken(user) });
};

exports.login = async (req, res) => {
  const { user_id, password } = req.body;
  if (!user_id || !password) return res.status(400).json({ error: "user_id dan password wajib diisi" });

  const user = await User.findOne({ where: { user_id }, include: [{ model: Role, as: "roles" }] });
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "kredensial salah" });
  }
  if (user.status !== "ACTIVE") return res.status(403).json({ error: "akun dinonaktifkan" });

  res.json({ user: { user_id: user.user_id, roles: user.roles.map((r) => r.name) }, token: signToken(user) });
};

exports.me = async (req, res) => {
  res.json({ user: { user_id: req.user.user_id, roles: req.roles, permissions: req.permissions } });
};

exports.listUsers = async (req, res) => {
  const users = await User.findAll({ include: [{ model: Role, as: "roles" }], attributes: ["id", "user_id", "status", "created_at"] });
  res.json({ users: users.map((u) => ({ id: u.id, user_id: u.user_id, status: u.status, roles: u.roles.map((r) => r.name) })) });
};

exports.assignRole = async (req, res) => {
  const { user_id } = req.params;
  const { role } = req.body;
  const user = await User.findOne({ where: { user_id } });
  const roleRecord = await Role.findOne({ where: { name: String(role).toUpperCase() } });
  if (!user || !roleRecord) return res.status(404).json({ error: "user atau role tidak ditemukan" });

  await user.addRole(roleRecord);
  const fresh = await User.findByPk(user.id, { include: [{ model: Role, as: "roles" }] });
  res.json({ user: { user_id: fresh.user_id, roles: fresh.roles.map((r) => r.name) } });
};