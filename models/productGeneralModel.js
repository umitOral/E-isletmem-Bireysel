import mongoose from "mongoose";

const Schema = mongoose.Schema;
const productGeneralSchema = new Schema(
  {
    id: { type: Number, },
    name: { type: String, require: true },
    price: { type: Number },
    brand:{type:String},
    barcodes: [
      {
        barcode: {type:String, index: { unique: true }},
        skrsStatus: Boolean,
      },
    ],
    images: [
      {
        url: String,
        public_id: String,
        uploadTime: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProductGeneral = mongoose.model("ProductGeneral", productGeneralSchema);
export { ProductGeneral, productGeneralSchema };
