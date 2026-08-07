const jwt = require("jsonwebtoken");
const { User, Role, Permission } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "idce_jwt_secret_dev";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "12h";

function signToken(user) {
  return jwt.sign({ sub: user.user_id, uid: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "autentikasi diperlukan (Bearer token)" });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(payload.uid, {
      include: [{ model: Role, as: "roles", include: [{ model: Permission, as: "permissions", through: { attributes: [] } }] }],
    });
    if (!user || user.status !== "ACTIVE") return res.status(401).json({ error: "user tidak aktif / tidak ditemukan" });

    req.user = user;
    req.permissions = user.roles.flatMap((r) => r.permissions.map((p) => p.name));
    req.roles = user.roles.map((r) => r.name);
    next();
  } catch (err) {
    return res.status(401).json({ error: "token tidak valid / kedaluwarsa" });
  }
}

function requirePermission(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "autentikasi diperlukan" });
    const has = allowed.some((perm) => req.permissions.includes(perm));
    if (!has) {
      return res.status(403).json({ error: "akses ditolak: perlu permission " + allowed.join(" atau ") });
    }
    next();
  };
}

module.exports = { requireAuth, requirePermission, signToken, JWT_SECRET, JWT_EXPIRES };