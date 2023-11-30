import mongoose from "mongoose";

const Schema = mongoose.Schema;
const OrderSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },

    amount: {
      type: Number,
      require: true,
    },
    paymentId: {
      type: String,
    },
    paymentDuration:{
      type:Number
    },
    paymentTransactionId: {
      type: String,
    },
  },
    
  { timestamps: true,
    autoIndex: false,

}
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
