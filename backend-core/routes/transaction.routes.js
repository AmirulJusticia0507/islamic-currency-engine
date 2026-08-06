const router = require("express").Router();
const transactionController = require("../controllers/transactionController");

router.get("/", transactionController.list);
router.post("/transfer", transactionController.transfer);
router.post("/:transaction_hash/verify", transactionController.verifySignature);
router.get("/:transaction_hash", transactionController.getByHash);

module.exports = router;
