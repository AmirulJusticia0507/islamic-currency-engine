const router = require("express").Router();
const notificationController = require("../controllers/notificationController");
const { requireAuth, requirePermission } = require("../middleware/auth");

router.use(requireAuth);
router.get("/", requirePermission("notification.read"), notificationController.list);
router.post("/:id/read", requirePermission("notification.read"), notificationController.markRead);

module.exports = router;