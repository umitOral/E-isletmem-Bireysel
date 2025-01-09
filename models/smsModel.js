import mongoose from "mongoose";

const Schema = mongoose.Schema;

const smsSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    phone: {type:String},
    pkg: {
      pkgID: String,
      state: String,
      statistics: {
        total: Number,
        delivered: Number,
        undelivered: Number,
      },
    },
    items: [
      {
        id: String,
        nr: String,
        status: String,
        lastUpdate: Date,
      },
    ],
    messageContent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Sms = mongoose.model("Sms", smsSchema);

export default Sms;
