require("dotenv").config();
const { ensureKeysExist, getPublicKey } = require("../utils/keys");

ensureKeysExist();
console.log("RSA key pair siap. Public key:");
console.log(getPublicKey());
