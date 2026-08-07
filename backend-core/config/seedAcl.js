const { Role, Permission, RolePermission } = require("../models");

const ACL = {
  ADMIN: ["*"],
  AUDITOR: ["dashboard.view", "reserve.read", "reserve.audit", "reserve.create", "transaction.read", "audit.read", "escrow.read", "escrow.settle", "oracle.read", "notification.read", "legal.verify"],
  NOTARY: ["dashboard.view", "legal.read", "legal.sign", "legal.manage", "legal.verify", "transaction.read", "escrow.read", "oracle.read", "notification.read"],
  LEGAL: ["dashboard.view", "legal.read", "legal.manage", "legal.verify", "transaction.read", "escrow.read", "escrow.settle", "escrow.dispute", "escrow.resolve", "oracle.read", "notification.read"],
  USER: ["dashboard.view", "wallet.create", "wallet.read", "transaction.read", "transaction.transfer", "biometric.manage", "qris.read", "reserve.read", "reserve.audit", "legal.read", "legal.verify", "escrow.read", "escrow.write", "escrow.dispute", "oracle.read", "notification.read"],
};

async function seedAcl() {
  // Baca semua permission yang sudah ada (dibuat secara eksplisit di bawah)
  async function ensurePermissions() {
    const names = [...new Set([
      ...Object.values(ACL).flat().filter((p) => p !== "*"),
      "user:manage",
    ])];
    for (const name of names) {
      await Permission.findOrCreate({ where: { name }, defaults: { description: `Can ${name}` } });
    }
    const all = await Permission.findAll();
    return Object.fromEntries(all.map((p) => [p.name, p.id]));
  }

  const byName = await ensurePermissions();
  for (const [roleName, permNames] of Object.entries(ACL)) {
    const [role] = await Role.findOrCreate({ where: { name: roleName }, defaults: { description: `Role ${roleName}` } });
    await RolePermission.destroy({ where: { role_id: role.id } });
    if (permNames.includes("*")) {
      await RolePermission.bulkCreate(Object.values(byName).map((id) => ({ role_id: role.id, permission_id: id })));
    } else {
      await RolePermission.bulkCreate(permNames.map((n) => ({ role_id: role.id, permission_id: byName[n] })));
    }
  }
  return Role.findAll();
}

module.exports = { seedAcl, ACL };