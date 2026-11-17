import mongoose from "mongoose";

const StatementTxnSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "demo", index: true },
    date: Date,
    description: String,
    amount: Number,
    type: { type: String, enum: ["debit", "credit"] },
    category: String,
  },
  { timestamps: true }
);

const StatementTxn = mongoose.model("StatementTxn", StatementTxnSchema);

export default StatementTxn;