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
    userID: {
      type: String,
    },
    pkg: {
      id: String,
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
    timeStamps: true,
  }
);

const Sms = mongoose.model("Sms", smsSchema);

export default Sms;
