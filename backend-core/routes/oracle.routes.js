const router = require("express").Router();
const oracleController = require("../controllers/oracleController");
const { requireAuth, requirePermission } = require("../middleware/auth");

router.use(requireAuth);
router.get("/gold", requirePermission("oracle.read"), oracleController.current);
router.get("/gold/history", requirePermission("oracle.read"), oracleController.history);

module.exports = router;