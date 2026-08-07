const { AuditLog } = require("../models");

exports.list = async (req, res) => {
  try {
    const { limit = 50, offset = 0, actor_user, action } = req.query;
    const where = {};
    if (actor_user) where.actor_user = actor_user;
    if (action) where.action = action;
    const logs = await AuditLog.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      limit: Number(limit) || 50,
      offset: Number(offset) || 0,
    });
    res.json({ total: logs.count, logs: logs.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};