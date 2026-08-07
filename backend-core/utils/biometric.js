const crypto = require("crypto");
const { hmacSign, hmacVerify } = require("./keys");

const TOKEN_TTL_MS = 2 * 60 * 1000; // 2 menit

function issueBiometricToken(walletAddress, deviceId) {
  const payload = Buffer.from(JSON.stringify({ w: walletAddress, d: deviceId, exp: Date.now() + TOKEN_TTL_MS })).toString("base64");
  const sig = hmacSign(payload);
  return `${payload}.${sig}`;
}

function verifyBiometricToken(token) {
  if (!token || typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  if (!hmacVerify(payload, sig)) return null;
  let data;
  try {
    data = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
  } catch {
    return null;
  }
  if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
  return data; // { w, d }
}

module.exports = { issueBiometricToken, verifyBiometricToken, TOKEN_TTL_MS };