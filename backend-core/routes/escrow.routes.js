const router = require("express").Router();
const escrowController = require("../controllers/escrowController");
const { requireAuth, requirePermission } = require("../middleware/auth");

router.use(requireAuth);

router.get("/", requirePermission("escrow.read"), escrowController.list);
router.post("/", requirePermission("escrow.write"), escrowController.create);
router.post("/:escrow_id/release", requirePermission("escrow.read"), escrowController.release);
router.post("/:escrow_id/refund", requirePermission("escrow.read"), escrowController.refund);
router.post("/dispute", requirePermission("escrow.dispute"), escrowController.openDispute);
router.get("/disputes", requirePermission("escrow.dispute"), escrowController.listDisputes);
router.post("/disputes/:dispute_id/resolve", requirePermission("escrow.dispute"), escrowController.resolveDispute);

module.exports = router;