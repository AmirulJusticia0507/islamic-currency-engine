const router = require("express").Router();
const authController = require("../controllers/authController");
const { requireAuth, requirePermission } = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", requireAuth, authController.me);
router.get("/users", requireAuth, requirePermission("user:manage"), authController.listUsers);
router.post("/users/:user_id/roles", requireAuth, requirePermission("user:manage"), authController.assignRole);

module.exports = router;