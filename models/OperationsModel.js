import mongoose from "mongoose";
import { OPERATION_STATUS_AUTOMATIC,OPERATION_APPOINTMENT_AVALIABLE_STATUS } from "../config/status_list.js";

const Schema = mongoose.Schema;
const OperationSchema = new Schema(
  {
    operationName: {
      type: String,
    },
    operationDate: {
      type: Date,
    },
    operationAppointmentStatus: {
      type: String,
      default: OPERATION_APPOINTMENT_AVALIABLE_STATUS.AVALIABLE,
    },
    operationStatus: {
      type: String,
      default: OPERATION_STATUS_AUTOMATIC.CONTINUE,
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
    percentDiscount: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },

    totalAppointments: {
      type: Number,
      default:1
    },
    appointmensCount: {
      type: Number,
      default: 0,
    },
    sessionOfOperation: [
      {
        refAppointmentID: {
          type: Schema.Types.ObjectId,
          ref: "Session",
        },
        sessionState: { type: String, default: OPERATION_STATUS_AUTOMATIC.CONTINUE},
        sessionDatas: [{ dataName:{type:String}, data:{type:String} }],
        sessionDescription:{type:String},
        sessionDate:{type:Date},
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
        paymentId: {
          type: Schema.Types.ObjectId,
          ref: "Payment",
        },
        paymentValue: { type: Number },
      },
    ],
    operationData: [{ dataName: String, data: String }],
    operationDescription:{type:String}
  },

  {timestamps:true, autoIndex: false }
);

const Operation = mongoose.model("Operation", OperationSchema);
export default Operation;
