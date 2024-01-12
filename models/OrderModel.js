import mongoose from "mongoose";

const Schema = mongoose.Schema;
const OrderSchema = new Schema(
  {
    status:{
      type:String,
      default:"pending"
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },

    amount: {
      type: Number,
      require: true,
    },
    paymentDuration:{
      type:Number
    },
    paymentTransactionId: {
      type: String,
    },
    systemTime: {
      type: String,
    },
    conversationId: {
      type: String,
    },
    token: {
      type: String,
    },
    authorization: {
      type: String,
    },
    randmKey: {
      type: String,
    }
    
  },
    
  { timestamps: true,
    autoIndex: false,

}
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
