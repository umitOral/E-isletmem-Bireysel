import mongoose from "mongoose";

const Schema = mongoose.Schema;
const productGeneralSchema = new Schema(
  {
    id: { type: Number, index: { unique: true } },
    name: { type: String, require: true },
    price: { type: Number },
    brand:{String},
    barcodes: [
      {
        barcode: String,
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
