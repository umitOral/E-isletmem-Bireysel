import winston from "winston";
const { combine, timestamp, json, prettyPrint, errors } = winston.format;
import dotenv from 'dotenv'
dotenv.config()
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

const logtail = new Logtail(process.env.LOGGER_TOKEN);


winston.loggers.add("ErrorLogger", {
  level: "error",
  format: combine(errors({ stack: true }), timestamp(), json(), prettyPrint()),
  transports: [
    // new winston.transports.Console(),
    // new winston.transports.File({ filename: "logs/error.log" }),
    new LogtailTransport(logtail),
  ],
  defaultMeta: { source: "ErrorService" },
});

const ErrorLogger = winston.loggers.get("ErrorLogger");

export { ErrorLogger };
