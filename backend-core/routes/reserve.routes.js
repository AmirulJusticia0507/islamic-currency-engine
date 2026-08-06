const router = require("express").Router();
const reserveController = require("../controllers/reserveController");

router.get("/", reserveController.listReserves);
router.post("/", reserveController.createReserve);
router.get("/audit", reserveController.audit);

module.exports = router;
