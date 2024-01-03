import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Company from "../models/companyModel.js";
import Employee from "../models/EmployeesModel.js";

const checkUser = async (req, res, next) => {
  const token = req.cookies.jsonwebtoken;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.company = null;
        next();
      } else {
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
          res.redirect("login");
        } else {
          next();
        }
      });
    } else {
      res.redirect("login");
    }
  } catch (error) {
    res.status(401).json({
      succes: false,
      message: "yetkisizlikten gelen hata",
    });
  }
};

const verifyRoles = (...roles) => {
  return async (req, res, next) => {
    console.log("burası" + roles);
    console.log(res.locals.employee.role);
    if (!roles.includes(res.locals.employee.role)) {
      next(new Error("Buraya giriş yetkiniz bulunmamaktadır.", 401));
    }
    next();
  };
};

const verifyactiveOrNot = () => {
  return async (req, res, next) => {
    
    const employee = await Employee.findOne({email:req.body.email})
    console.log(employee.activeOrNot)
    if (!employee.activeOrNot) {
      next(new Error("Hesabınız Pasiftir. Lütfen Mağaza yetkiliniz ile iletişime geçiniz.", 401));
    }
    next();
  };
};



export { authenticateToken, checkUser, verifyRoles, verifyactiveOrNot };
