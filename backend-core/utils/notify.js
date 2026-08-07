const { Notification } = require("../models");

async function push(userId, type, title, body) {
  try {
    await Notification.create({ user_id: String(userId), type, title, body });
  } catch (err) {
    console.error("[notify] gagal:", err.message);
  }
}

module.exports = { push };