const router = require("express").Router();
const biometricController = require("../controllers/biometricController");

router.get("/", biometricController.listDevices);
router.post("/register", biometricController.registerDevice);
router.post("/verify", biometricController.verify);
router.delete("/:device_id", biometricController.revokeDevice);

module.exports = router;