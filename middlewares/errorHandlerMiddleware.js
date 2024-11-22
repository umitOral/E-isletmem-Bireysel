import { ErrorLogger } from "../helpers/logger/logger.js";

import { sendErrorEmail } from "../controller/mailControllers.js";

const ErrorHandler = async (err, req, res, next) => {
  console.log("errorHandler");
  console.log(err);

  if (err.name === "CustomError") {
    console.log("haho2");
    await sendErrorEmail(err);
    res.status(err.status || 401).json({
      success: false,
      message: err.message || "yöneticiye başvurun",
      data:err.stack
    });
  }else{
    console.log("haho");
    await sendErrorEmail(err);
    ErrorLogger.error("errorHandler", err);
    res.render("errorPage", {
      link: "error",
      message: "bir sorun oluştu, yöneticiye başvurun",
      error: err,
    });
  }

 
};

export { ErrorHandler };
