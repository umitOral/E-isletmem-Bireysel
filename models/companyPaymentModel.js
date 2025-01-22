import mongoose from "mongoose";

const Schema = mongoose.Schema;
const companyPaymentSchema = new Schema(
  {
    status:{
      type:String,
      default:"pending"
    },
    paymentStatus:{
      type:String,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    paymentType: {
      type: String,
    },
   
    paymentId: {
      type: String,
    },
    product:{
      type:Object
    },
    price: {
      type: Number,
      require: true,
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

const CompanyPayment = mongoose.model("CompanyPayment", companyPaymentSchema);
export default CompanyPayment;
