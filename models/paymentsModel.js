import mongoose from "mongoose";

const Schema = mongoose.Schema;
const paymentSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    totalPrice: {
      type: Number,
      require: true,
    },
    cashOrCard: {
      type: String,
      default: "Nakit",
    },
    description: {
      type: String,
    },
    products: [
      {
        producName: { type: String },
        producPrice: { type: Number },
      },
    ],
    operations: [
      {
        operationId: {
          type: Schema.Types.ObjectId,
          ref: "Operation",
        },
        paymentValue: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
