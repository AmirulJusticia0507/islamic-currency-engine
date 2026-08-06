const { hmacVerify } = require("../utils/keys");

function requireHmacAuth(req, res, next) {
  const signature = req.headers["x-idce-signature"];
  if (!signature) return res.status(401).json({ error: "Missing X-IDCE-Signature (HMAC-SHA512)" });
  const canonical = JSON.stringify({ path: req.originalUrl, method: req.method, body: req.body || {} });
  if (!hmacVerify(canonical, signature)) return res.status(403).json({ error: "Invalid signature" });
  next();
}

function notFound(req, res) {
  res.status(404).json({ error: "route tidak ditemukan" });
}

function errorHandler(err, req, res, next) {
  console.error("[error]", err);
  res.status(500).json({ error: "internal server error" });
}

module.exports = { requireHmacAuth, notFound, errorHandler };
