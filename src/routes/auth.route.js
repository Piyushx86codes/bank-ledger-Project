const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller");

//Registarion router
router.post("/register",authController.userRegisterController);


//login Route
router.post("/login",authController.userLoginController);

module.exports = router;