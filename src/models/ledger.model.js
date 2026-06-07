const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"ledger must be associated with an Account"],
        index:true,
        immutable:true,
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating an  ledger entry"],
        immutable:true,
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"ledger must associated with a transaction"],
        index:true,
        immutable:true,
    },
    type:{
        type:String,
        enum:{
            values:["DEBIT","CREDIT"],
            message:"type can be either debit or credit",
        },
        required:[true,"Ledger type is required"],
        immutable:true,
    }
})

function preventLedgerModification(){
    throw new Error("ledger entries are immutable and cannto be deleted or modified");
}

ledgerSchema.pre("findByIdAndDelete",preventLedgerModification);
ledgerSchema.pre("findoneAndUpdate",preventLedgerModification);
ledgerSchema.pre("UpdateOne",preventLedgerModification);
ledgerSchema.pre("deleteOne",preventLedgerModification);
ledgerSchema.pre("remove",preventLedgerModification);
ledgerSchema.pre("deleteMany",preventLedgerModification);
ledgerSchema.pre("findoneAndDelete",preventLedgerModification);
ledgerSchema.pre("updateMany",preventLedgerModification);
ledgerSchema.pre("findOneAndReplace",preventLedgerModification);


const ledgerModel = mongoose.model("ledger",ledgerSchema);
module.exports = ledgerModel;