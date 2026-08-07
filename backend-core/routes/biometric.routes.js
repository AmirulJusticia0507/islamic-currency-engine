const router = require("express").Router();
const biometricController = require("../controllers/biometricController");
const { requireAuth, requirePermission } = require("../middleware/auth");

router.use(requireAuth);
router.get("/", requirePermission("biometric.manage"), biometricController.listDevices);
router.post("/register", requirePermission("biometric.manage"), biometricController.registerDevice);
router.post("/verify", requirePermission("biometric.manage"), biometricController.verify);
router.delete("/:device_id", requirePermission("biometric.manage"), biometricController.revokeDevice);

module.exports = router;