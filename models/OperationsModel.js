import mongoose from "mongoose";

const Schema = mongoose.Schema;
const OperationSchema = new Schema(
  {
    operationName: {
      type: String,
    },
    operationAppointmentStatus: {
      type: String,
      default: "açık",
    },
    paymentStatus: {
      type: String,
      default: "ödenmedi",
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    operationPrice: {
      type: Number,
      require: true,
    },
    paidValue: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
    },
    operationName: {
      type: String,
    },
    totalAppointmens: {
      type: Number,
    },
    appointmensCount: {
      type: Number,
      default: 0,
    },
    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Session",
      },
    ],
    images: [
      {
        description: String,
        url: String,
        public_id: String,
        uploadTime: Number,
      },
    ],
    payments: [
      {
        paymentId:{
          type: Schema.Types.ObjectId,
          ref: "Payment",
        },
        paymentValue:{type:Number}
      }
    ],
    operationData: [{ dataName: String, data: String }],
  },

  { timestamps: true, autoIndex: false }
);

const Operation = mongoose.model("Operation", OperationSchema);
export default Operation;
