import mongoose from "mongoose";

const Schema = mongoose.Schema;
const productSchema = new Schema(
  {
    name: { type: String, require: true },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    price: { type: Number },
    totalStock: { type: Number, default: 0 },
    baseComission:{type:Number,default:0},
    stocks: [
      {
        unitCost: { type: Number, default: 0 },
        quantity: {type:Number,default:0},
        createdAt:{type:Date,default:Date.now()}
      },
    ],
    brand: { type: String },
    barcodes: [
      {
        type: String,
        description: "değer male veya female olmalıdır.",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
