const router = require("express").Router();
const walletController = require("../controllers/walletController");
const { requireAuth, requirePermission } = require("../middleware/auth");

router.use(requireAuth);
router.post("/", requirePermission("wallet.create"), walletController.createWallet);
router.get("/:wallet_address", requirePermission("wallet.read"), walletController.getWallet);
router.get("/:wallet_address/balance", requirePermission("wallet.read"), walletController.getBalance);

module.exports = router;