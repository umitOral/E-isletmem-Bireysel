import mongoose from "mongoose";

const Schema = mongoose.Schema;
const SubscribtionSchema = new Schema(
  {
    status: {
      type: String,
      default: "waiting",enum:["active","waiting","finished"]
    },
    subscriptionType: { type: String,enum:["purchased","trial","gift"]},
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    startDate: {type: Date},
    endDate: {type: Date},
    payments: [
      {
        paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
        price: { type: Number },
      },
    ],
    paymentDuration: {
      type: Number,
    },
    userCount: {
      type: Number,
    },
  },

  { timestamps: true, autoIndex: false }
);

const Subscription = mongoose.model("Subscription", SubscribtionSchema);
export default Subscription;
