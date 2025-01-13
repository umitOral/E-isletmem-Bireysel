import mongoose from "mongoose";

const Schema = mongoose.Schema;
const SubscribtionSchema = new Schema(
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
    userCount:{
      type:Number
    },
    paymentTransactionId: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
    systemTime: {
      type: String, default: Date.now()
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
    randomKey: {
      type: String,
    }
    
  },
    
  { timestamps: true,
    autoIndex: false,

}
);

const Subscription = mongoose.model("Subscription", SubscribtionSchema);
export default Subscription;
