import mongoose from "mongoose";

import { APPOINTMENT_STATUS } from "../config/status_list.js";

const Schema = mongoose.Schema;
const appointmentSchema = new Schema(
  {
    date: {
      type: Date,
    },
    startHour: {
      type: String,
    },
    endHour: {
      type: String,
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
    operations: [{
      type:Schema.Types.ObjectId,ref:"Operation"
    }],
    plannedOperations: {
      oldOperations: [{ type: Schema.Types.ObjectId, ref: "Operation" }],
      newOperations: [],
    },
    appointmentState: {
      type: String,
      default: APPOINTMENT_STATUS.WAITING,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
