const router = require("express").Router();
const qrisController = require("../controllers/qrisController");
const { requireAuth, requirePermission } = require("../middleware/auth");

router.use(requireAuth);
router.get("/:wallet_address/payload", requirePermission("qris.read"), qrisController.getPayload);
router.get("/:wallet_address/qr", requirePermission("qris.read"), qrisController.getImage);

module.exports = router;