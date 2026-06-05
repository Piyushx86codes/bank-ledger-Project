const express = require(express);
const router = express.Router();
const authMiddlware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");



//POST /api/account //
router.post("/",authMiddlware.authMiddleware,accountController.createAccountController);




module.exports = router;