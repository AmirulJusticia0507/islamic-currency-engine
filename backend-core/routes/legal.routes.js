const router = require("express").Router();
const legalController = require("../controllers/legalController");
const { requireAuth, requirePermission } = require("../middleware/auth");

router.use(requireAuth);
router.get("/partners", requirePermission("legal.read"), legalController.listPartners);
router.post("/partners", requirePermission("legal.manage"), legalController.createPartner);
router.get("/contracts", requirePermission("legal.read"), legalController.listContracts);
router.post("/contracts", requirePermission("legal.sign"), legalController.createContract);
router.get("/contracts/:id", requirePermission("legal.read"), legalController.getContract);
router.get("/contracts/:id/verify", requirePermission("legal.verify"), legalController.verify);
router.get("/contracts/:id/pdf", requirePermission("legal.read"), legalController.getPdf);

module.exports = router;