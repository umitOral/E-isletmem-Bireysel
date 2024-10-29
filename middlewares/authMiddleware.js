import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Company from "../models/companyModel.js";
import Employee from "../models/EmployeesModel.js";
import { CustomError } from "../helpers/error/CustomError.js";

const checkUser = async (req, res, next) => {
  
  const token = req.cookies.jsonwebtoken;
  const token2 = req.cookies.userData;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.company = null;
        next();
      } else {

        jwt.verify(token2,process.env.JWT_SECRET,(err,decodedToken)=>{
          
          res.locals.usersNames = decodedToken.usersNames;
          
        })
        const company = await Company.findById(decodedToken.companyID).populate(
          "employees"
        );
        const employee = await Employee.findById(decodedToken.employeeID);
        res.locals.company = company;
        res.locals.employee = employee;

        next();
      }
    });
  } else {
    res.locals.company = null;
    res.redirect("../login");

    console.log("gerekli token bulunamadı lütfen giriş yapınız");
  }
};

const authenticateToken = async (req, res, next) => {
 
  try {
    const token = req.cookies.jsonwebtoken;
    
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
          res.redirect("/login");
        } else {
          next();
        }
      });
    } else {
      res.redirect("/login");
      // return next(new CustomError("süre doldu, tekrar giriş yapınız",401))
    }
  } catch (error) {
    return next(new CustomError("sunucuda bir sorun oluştu",500,error))
  }
};


const verifyRoles = (...roles) => {
  
  return async (req, res, next) => {
    if (!roles.includes(res.locals.employee.role)) {
      next(new Error("Buraya giriş yetkiniz bulunmamaktadır.", 401));
    }
    next();
  };
};

const verifyactiveOrNot = () => {
  return async (req, res, next) => {
    const employee = await Employee.findOne({ email: req.body.email });

    if (employee) {
      if (!employee.activeOrNot) {
        next(
          new Error(
            "Hesabınız Pasiftir. Lütfen Mağaza yetkiliniz ile iletişime geçiniz.",
            401
          )
        );
      }
      next();
    } else {
      res.json(Response.successResponse(true,"Kullanıcı bulunamadı"));
    }
  };
};

const checkPriviliges = (...priviliges) => {
  
  
  return async (req,res,next)=>{
      if (res.locals.employee.permissions.includes(priviliges)) {
         next()
      }else{
        res.json(Response.unsuccessResponse(false,"İşlem için yetkiniz bulunmamaktadır."))
      }
      
  }
  };
  

export {
  authenticateToken,
  checkUser,
  verifyRoles,
  checkPriviliges,
  verifyactiveOrNot,

};
