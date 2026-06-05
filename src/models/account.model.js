const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Account must be associated with s user"],
      index:true,
    },
    status: {
      type:string,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Status can be either Active, Frozen or closed",
      },
      default:"ACTIVE",
    },
    currency: {
      type: string,
      required: [true, "Currency is required for creatinf an account"],
      default: "INR",
    },
  },
  {
    timestamps: true,
  },
);

accountSchema.index({index:1,status:1});


const accountModel = mongoose.model("account",accountSchema);

module.exports = accountModel;