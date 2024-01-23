import mongoose from "mongoose";

const Schema = mongoose.Schema;
const OrderSchema = new Schema(
  {
    status:{
      type:String,
      
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    price: {
      type: Number,
      require: true,
    },
    products:[
      {
        productName:{type: String},
        productPrice:{type: Number},
        productStatus:{type:String},
        productPaymentStatus:{type:String},
      }
    ]
  },
    
  { timestamps: true,
    autoIndex: false,

}
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
