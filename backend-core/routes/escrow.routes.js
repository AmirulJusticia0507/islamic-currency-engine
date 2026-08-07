const router = require("express").Router();
const escrowController = require("../controllers/escrowController");
const { requireAuth, requirePermission } = require("../middleware/auth");

router.use(requireAuth);

router.get("/", requirePermission("escrow.read"), escrowController.list);
router.post("/", requirePermission("escrow.write"), escrowController.create);
router.post("/:escrow_id/release", requirePermission("escrow.settle"), escrowController.release);
router.post("/:escrow_id/refund", requirePermission("escrow.settle"), escrowController.refund);
router.post("/dispute", requirePermission("escrow.dispute"), escrowController.openDispute);
router.get("/disputes", requirePermission("escrow.dispute"), escrowController.listDisputes);
router.post("/disputes/:dispute_id/resolve", requirePermission("escrow.resolve"), escrowController.resolveDispute);

module.exports = router;