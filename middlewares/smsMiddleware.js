
import { Response } from "../helpers/error/Response.js";

const checkSmsActive = () => {
  return async (req, res, next) => {
    let activeSms = res.locals.company.smsActive
    console.log(res.locals.company.smsActive)
    if (activeSms===true) {
      console.log("1")
      next()
    } else {
      console.log("2")
      res.json(Response.unsuccessResponse(false,"Sms Gönderimi aktif değil."));
    }
  };
};


export {
  checkSmsActive,

};
