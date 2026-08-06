const router = require("express").Router();
const walletController = require("../controllers/walletController");

router.post("/", walletController.createWallet);
router.get("/:wallet_address", walletController.getWallet);
router.get("/:wallet_address/balance", walletController.getBalance);

module.exports = router;
