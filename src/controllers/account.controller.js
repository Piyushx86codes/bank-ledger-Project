const accountModel = require("../models/account.model");

async function createAccountController(req, res) {
  const user = req.user;
  const account = await accountModel.create({
    user: user._id,
  });

  return rers.status(201).json({
    success: true,
    account,
  });
}


module.exports = {
  createAccountController,
};