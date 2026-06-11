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


async function getUserAccountController(req,res){
  const accounts = await accountModel.find({user:req.user._id});
  res.status(200).json({
    accounts,
  })
}

async function getAccountBalanceController(req,res){
  const {accountId} = req.params;
  const account = await accountModel.findone({
    _id:accountId,
    user:req.user._id
  })

  if(!account){
    return res.status(400).json({
      success:false,
      message:"Account Not Found",
    })
  }

  const balance = await account.getBalance();
  return res.status(200).json({
    success:true,
    account:account._id,
    balance:balance
  })
}

module.exports = {
  createAccountController,
  getUserAccountController,
  getAccountBalanceController
};