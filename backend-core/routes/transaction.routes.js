const router = require("express").Router();
const transactionController = require("../controllers/transactionController");
const { requireAuth, requirePermission } = require("../middleware/auth");

router.use(requireAuth);
router.get("/", requirePermission("transaction.read"), transactionController.list);
router.post("/transfer", requirePermission("transaction.transfer"), transactionController.transfer);
router.post("/:transaction_hash/verify", requirePermission("transaction.read"), transactionController.verifySignature);
router.get("/:transaction_hash", requirePermission("transaction.read"), transactionController.getByHash);

module.exports = router;