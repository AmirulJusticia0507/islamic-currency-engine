const router = require("express").Router();
const reserveController = require("../controllers/reserveController");
const { requireAuth, requirePermission } = require("../middleware/auth");

router.use(requireAuth);
router.get("/", requirePermission("reserve.read"), reserveController.listReserves);
router.post("/", requirePermission("reserve.create"), reserveController.createReserve);
router.get("/audit", requirePermission("reserve.audit"), reserveController.audit);

module.exports = router;