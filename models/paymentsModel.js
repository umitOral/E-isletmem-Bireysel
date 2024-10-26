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
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    totalPrice: {
      type: Number,
      require: true,
    },
    cashOrCard: {
      type: String,
      default: "nakit",
      lowercase: true
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
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        paymentValue: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
        discount: {
          type: Number,
        },
        percentDiscount: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);




const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
