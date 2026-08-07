const router = require("express").Router();
const legalController = require("../controllers/legalController");
const { requireAuth, requirePermission } = require("../middleware/auth");

router.use(requireAuth);
router.get("/partners", requirePermission("legal.read"), legalController.listPartners);
router.post("/partners", requirePermission("legal.manage"), legalController.createPartner);
router.get("/contracts", requirePermission("legal.read"), legalController.listContracts);
router.post("/contracts", requirePermission("legal.sign"), legalController.createContract);

module.exports = router;