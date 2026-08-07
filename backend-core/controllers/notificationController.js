const { Notification } = require("../models");

exports.list = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const notes = await Notification.findAll({
      where: { user_id: String(req.user.id) },
      order: [["created_at", "DESC"]],
      limit: Number(limit) || 20,
    });
    const unread = notes.filter((n) => !n.read_at).length;
    res.json({ unread, notifications: notes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const n = await Notification.findOne({ where: { id: req.params.id, user_id: String(req.user.id) } });
    if (!n) return res.status(404).json({ error: "notifikasi tidak ditemukan" });
    n.read_at = new Date();
    await n.save();
    res.json({ notification: n });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};