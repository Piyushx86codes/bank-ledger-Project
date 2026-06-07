const express = require('express');
const transactionRoutes = express.Router();
const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");


transactionRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction);

transactionRoutes.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction);

router.get("/",authMiddleware.authMiddleware,accountController.getUserAccountController);


module.exports = transactionRoutes;