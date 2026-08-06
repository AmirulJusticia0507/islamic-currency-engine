const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function resolveKeyPath(envPath) {
  return path.resolve(__dirname, "..", envPath || "./keys/private_key.pem");
}

function ensureKeysExist() {
  const privPath = resolveKeyPath(process.env.RSA_PRIVATE_KEY_PATH);
  const pubPath = resolveKeyPath(process.env.RSA_PUBLIC_KEY_PATH);
  if (fs.existsSync(privPath)) return;
  fs.mkdirSync(path.dirname(privPath), { recursive: true });
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  fs.writeFileSync(privPath, privateKey, { mode: 0o600 });
  fs.writeFileSync(pubPath, publicKey);
  console.log(`[keys] RSA 2048-bit pair generated -> ${privPath}`);
}

function getPrivateKey() {
  ensureKeysExist();
  return fs.readFileSync(resolveKeyPath(process.env.RSA_PRIVATE_KEY_PATH), "utf8");
}

function getPublicKey() {
  ensureKeysExist();
  return fs.readFileSync(resolveKeyPath(process.env.RSA_PUBLIC_KEY_PATH), "utf8");
}

function hmacSign(payload) {
  const message = typeof payload === "string" ? payload : JSON.stringify(payload);
  return crypto.createHmac("sha512", process.env.CURRENCY_SECRET_KEY || "secret_key_syariah_digital_currency").update(message).digest("hex");
}

function hmacVerify(payload, signature) {
  const expected = hmacSign(payload);
  return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
}

function rsaSign(data) {
  return crypto.sign("sha256", Buffer.from(data), { key: getPrivateKey(), padding: crypto.constants.RSA_PKCS1_PADDING }).toString("base64");
}

function rsaVerify(data, signatureBase64, publicKeyPem) {
  try {
    return crypto.verify("sha256", Buffer.from(data), { key: publicKeyPem, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(signatureBase64, "base64"));
  } catch {
    return false;
  }
}

module.exports = { ensureKeysExist, getPrivateKey, getPublicKey, hmacSign, hmacVerify, rsaSign, rsaVerify };
