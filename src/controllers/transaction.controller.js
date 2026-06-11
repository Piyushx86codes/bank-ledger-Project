const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const accountModel = require("../models/account.model");
const mongoose = require("mongoose");


async function createTransaction(req,res){
    const {fromAccount,toAccount,amount,idempotencyKey} = req.body;
    if(!fromAccount || !toAccount || !amount || !idempotecy){
        return res.status(400).json({
            success:false,
            message:"fromAccount,toAccount,amount and idempotency key is required",
        })
    }

    const fromUserAccount = await AccountModel.findOne({
        _id:fromAccount,
    })

    const toUserAccount = await AccountModel.findOne({
        _id:toAccount
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            success:false,
            message:"Invalid fromAccount or toAccount"
        })
    }



    //validate idempotency Key//
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })


    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "COMPLETED"){
            return res.status(200).json({
                success:true,
                message:"transaction already proccessed",
                transaction:isTransactionalAlreadyExists
            })
        }

        if(isTransactionAlreadyExists.status === "PENDING"){
            return res.status(202).json({
                message:"transaction is still processing"
            })
        }

        if(isTransactionAlreadyExists.status === "FAILED"){
            return res.status(500).json({
                message:"transaction processing failed, please retry"
            })
        }

        if(isTransactionAlreadyExists.status === " REVERSED"){
            return res.status(500).json({
                message:"transaction has been reversed, please retry"
            })
        }
    }


    //check account status//
    if(fromUserAccount.status != "ACTIVE" || toUserAccount.status != "ACTIVE"){
        return res.status(500).json({
            message:"fromUserAccount and toUserAccount must be active to proceed for transactions",
        })
    } 

    //derive sender balance//
    const balance = await  fromUserAccount.getbalance();     

    if(balance < amount){
       return res.status(400).json({
            message:`Insufficient balance.Current balance is ${balance}. Requested Amount is ${amount}`
        })
    }


    //create transaction//
    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    },{session})


    const debitLedgerEntry = await ledgerModel.create({
        account:fromAccount,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT",
    },{session})


    const creditLedgerEntry = await ledgerModel.create({
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT",
    },{session})

    transaction.status = "COMPLETED";
    await transaction.save({session});

    await session.commitTransaction();
    session.endSession();



    ///send Email Notification//

    await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount);
        return res.json({
           message:"Transaction Completed Successfully",
           transaction:transaction
        })
    
}


async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    })

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System user account not found"
        })
    }


    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([ {
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    } ], { session })

    await(()=>{
      return new Promise((resolve)=>setTimeOut(resolve,100* 1000));
    })()

    const creditLedgerEntry = await ledgerModel.create([ {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    } ], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message: "Initial funds transaction completed successfully",
        transaction: transaction
    })


}

module.exports={
    createTransaction,
    createInitialFundsTransaction,
}