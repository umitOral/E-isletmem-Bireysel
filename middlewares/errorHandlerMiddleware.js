import { ErrorLogger } from "../helpers/logger/logger.js";

import { sendErrorEmail } from "../controller/mailControllers.js";
import {CustomError} from '../helpers/error/CustomError.js'

const ErrorHandler = async (err, req, res, next) => {
  console.log(err)
  let customError = err;
  customError.error.user=res.locals.company.email
if (customError.error) {
  console.log("burası")
  if (customError.error.name === "SyntaxError") {
    customError = new CustomError("unexpected syntax", 400,customError.error);
  }
  if (customError.error.name === "ValidatorError") {
    customError = new CustomError(err.message, 400,customError.error);
  }
  if (customError.error.name === "MongoServerError" && customError.error.code == 11000) {
    customError = new CustomError(
      "Mail adresi ile kayıtlı kullanıcı zaten bulunmaktadır.",
      400,customError.error
    );
  }
  if (customError.error.name === "ValidationError") {
    customError = new CustomError(err.errors.password.properties.message, 400,customError.error);
  }

  ErrorLogger.error("xxxx",customError.error);
}
  

  // await sendErrorEmail(customError.error);

 

  res.status(customError.status || 500).json({
    success: false,
    message: customError.message||"yöneticiye başvurun",
  });

};

export { ErrorHandler };
