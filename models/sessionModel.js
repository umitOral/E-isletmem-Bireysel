import mongoose from "mongoose";

const Schema = mongoose.Schema;
const sessionSchema = new Schema(
  {
    timeIndexes: [
      {
        type: Number
      }
    ],
    date: {
      type: Date
    },
    startHour: {
      type: Date
    },
    endHour: {
      type: Date
    },

    description: { type: String },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    services: [
      {
        type: String
      },
    ],
    state: {
      type: String,
      default: "Bekleniyor"
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
