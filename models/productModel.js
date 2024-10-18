import mongoose from "mongoose";

const Schema = mongoose.Schema;
const productSchema = new Schema(
  {
    name: { type: String, require: true },
    price: { type: Number },
    stocks: [{ unitCost: Number, piece: Number, date: Date }],
    brand:{type:String},
    barcodes: [
      {
        type: String,
        unique: true,
        required: true
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
