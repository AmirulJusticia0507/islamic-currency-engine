const { AuditLog } = require("../models");

async function log(actorUser, action, entity, entityId, meta) {
  try {
    await AuditLog.create({
      actor_user: actorUser || null,
      action,
      entity: entity || null,
      entity_id: entityId != null ? String(entityId) : null,
      meta: meta ? JSON.stringify(meta).slice(0, 500) : null,
    });
  } catch (err) {
    // jangan sampai audit menggagalkan operasi utama
    console.error("[audit] gagal catat:", err.message);
  }
}

module.exports = { log };