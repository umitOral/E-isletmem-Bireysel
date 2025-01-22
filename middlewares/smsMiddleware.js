
import { Response } from "../helpers/error/Response.js";

const checkSmsActive = () => {
  return async (req, res, next) => {
    let activeSms = res.locals.company.smsActive
    
    if (activeSms===true) {
      
      next()
    } else {
      
      res.json(Response.unsuccessResponse(false,"Sms Gönderimi aktif değil.",400,`/admin/settings`));
    }
  };
};
const checksmsBalance = (smsCount) => {
  return async (req, res, next) => {
    
    

    let sms = res.locals.company.smsBalance-(smsCount !== undefined ? smsCount : req.body.users.length)
    
    if (sms>=0) {
      
      
      next()
    } else {
      
      res.json(Response.unsuccessResponse(false,"Sms miktarı yetersiz."));
    }
  };
};


export {
  checkSmsActive,
  checksmsBalance
};
