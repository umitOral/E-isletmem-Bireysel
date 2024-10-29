import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;
const auditLogsSchema = new Schema(
  {
    level: String,
    email: String,
    location: String,
    proc_type: String,
    log:Object
  },

  {
    timestamps: true,
  }
);


const AuditLogsModel = mongoose.model("AuditLogs", auditLogsSchema);
export default AuditLogsModel;
