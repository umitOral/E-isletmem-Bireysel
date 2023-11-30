import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ticketStatus = {
  OPEN: "açık",
  CLOSED: "kapalı",
};

const ticketSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    messages: [
      {
        type: String,
      }
    ],
    name: {
      type: String,
    },
    phone: { type: Number },
    email: { type: String },
    ticketStatus: {
      type: String,
    },
  },
  {
    timeStamps: true,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export { Ticket, ticketStatus };
