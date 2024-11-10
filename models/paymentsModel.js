import mongoose from "mongoose";

const Schema = mongoose.Schema;
const paymentSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    comissionEmployee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
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
      default: "nakit",
      lowercase: true,
    },
    description: {
      type: String,
    },

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
        baseComission: {
          type: Number,
          default: 0,
        },
        employeeComission: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;


