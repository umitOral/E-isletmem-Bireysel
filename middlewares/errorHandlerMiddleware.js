import { ErrorLogger } from "../helpers/logger/logger.js";

import { sendErrorEmail } from "../controller/mailControllers.js";


const ErrorHandler = async (err, req, res, next) => {
  console.log("burası1");
  console.log(err);

  if (err.name === "ReferenceError") {
    res.render("errorPage",{
      link:"error",
      message:"bir sorun oluştu, yöneticiye başvurun",
      error:err
    })
  }else{
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "yöneticiye başvurun",
    });
  }

  ErrorLogger.error("errorHandler",err);

  await sendErrorEmail(err);


};

export { ErrorHandler };
