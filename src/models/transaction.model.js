const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "transaction must be associated with a From Account"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "transaction must be associated with a To Account"],
      index: true,
    },
    status: {
      type: string,
      enum: {
        values: ["PENDING", "FAILED", "COMPLETED", "REVERSED"],
        message: "status should be either PENDING,FAILED,COMPLETED or REVERSED",
      },
      default: "pending",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required for transaction"],
      min: [0, "Transaction cannot be in Negative"],
    },
    idempotencykey: {
      type: string,
      required: [true, "idempotency key is required for transation"],
      index: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);


const transactionModel = mongoose.model("transactions",transactionSchema);
module.exports = transactionModel;