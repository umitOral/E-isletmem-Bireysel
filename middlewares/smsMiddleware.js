
import { Response } from "../helpers/error/Response.js";

const checkSmsActive = () => {
  return async (req, res, next) => {
    let activeSms = res.locals.company.smsActive
    console.log(res.locals.company.smsActive)
    if (activeSms===true) {
      console.log("sms aktif")
      next()
    } else {
      console.log("2")
      res.json(Response.unsuccessResponse(false,"Sms Gönderimi aktif değil."));
    }
  };
};
const checksmsBalance = (smsCount) => {
  return async (req, res, next) => {
    console.log("xxx")
    console.log(smsCount)

    let sms = res.locals.company.smsBalance-(smsCount !== undefined ? smsCount : req.body.users.length)
    console.log(sms)
    if (sms>=0) {
      console.log("balance +")
      
      next()
    } else {
      console.log("balance -")
      res.json(Response.unsuccessResponse(false,"Sms miktarı yetersiz."));
    }
  };
};


export {
  checkSmsActive,
  checksmsBalance
};
