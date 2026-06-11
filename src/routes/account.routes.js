const express = require(express);
const router = express.Router();
const authMiddlware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");



//POST /api/account //
router.post("/",authMiddlware.authMiddleware,accountController.createAccountController);

// GET /api/accounts//

router.get("/",authMiddlware.authMiddleware,accountController.getUserAccountController);

//GET /api/acounts/balance/:accountId
router.get("/balance/:accountId",authMiddlware.authMiddleware,accountController.getAccountBalanceController);

module.exports = router;