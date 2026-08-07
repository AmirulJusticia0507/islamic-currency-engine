const router = require("express").Router();
const qrisController = require("../controllers/qrisController");

router.get("/:wallet_address/payload", qrisController.getPayload);
router.get("/:wallet_address/qr", qrisController.getImage);

module.exports = router;