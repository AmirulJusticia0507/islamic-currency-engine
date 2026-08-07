const router = require("express").Router();
const auditController = require("../controllers/auditController");
const { requireAuth, requirePermission } = require("../middleware/auth");

router.use(requireAuth);
router.get("/", requirePermission("audit.read"), auditController.list);

module.exports = router;