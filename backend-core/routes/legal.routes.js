const router = require("express").Router();
const legalController = require("../controllers/legalController");

router.get("/partners", legalController.listPartners);
router.post("/partners", legalController.createPartner);
router.get("/contracts", legalController.listContracts);
router.post("/contracts", legalController.createContract);

module.exports = router;
