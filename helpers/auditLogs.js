import AuditLogsModel from "../models/auditLogsModel.js";
import { LOG_LEVELS } from "../config/status_list.js";
let instance = null;
class AuditLogs {
  constructor() {
    if (!instance) {
      instance = this;
    }
  }
  static info(email, location, proc_type, log) {
    console.log("xxx")
    this.saveToDB({
      level: LOG_LEVELS.INFO,
      email,
      location,
      proc_type,
      log,
    });
  }
  static warn(level, email, location, proc_type, log) {
    this.saveToDB({
      level: LOG_LEVELS.WARN,
      email,
      location,
      proc_type,
      log,
    });
  }
  error(level, email, location, proc_type, log) {
    this.saveToDB({
      level: LOG_LEVELS.ERROR,
      email,
      location,
      proc_type,
      log,
    });
  }
  debug(level, email, location, proc_type, log) {
    this.saveToDB({
      level: LOG_LEVELS.DEBUG,
      email,
      location,
      proc_type,
      log,
    });
  }
  verbose(level, email, location, proc_type, log) {
    this.saveToDB({
      level: LOG_LEVELS.VERBOSE,
      email,
      location,
      proc_type,
      log,
    });
  }
  html(level, email, location, proc_type, log) {
    this.saveToDB({
      level: LOG_LEVELS.HTML,
      email,
      location,
      proc_type,
      log,
    });
  }
  static saveToDB({ level, email, location, proc_type, log }) {
    AuditLogsModel.create({
      level,
      email,
      location,
      proc_type,
      log,
    });
  }
}

export { AuditLogs };
