import mongoose from "mongoose";

import { OPERATION_STATUS_AUTOMATIC } from "../config/status_list.js";

const Schema = mongoose.Schema;
const appointmentSchema = new Schema(
  {
    timeIndexes: [
      {
        type: Number,
      },
    ],
    date: {
      type: Date,
    },
    startHour: {
      type: Date,
    },
    endHour: {
      type: Date,
    },

    description: { type: String },

    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    operations: [
      {
        operation: { type: Schema.Types.ObjectId, ref: "Operation" },
        session: { type: Number },
      },
    ],
    appointmentState: {
      type: String,
      default: OPERATION_STATUS_AUTOMATIC.WAITING,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
