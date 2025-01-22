import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Company from "../models/companyModel.js";
import Employee from "../models/EmployeesModel.js";
import { CustomError } from "../helpers/error/CustomError.js";
import { Response } from "../helpers/error/Response.js";
import Subscription from "../models/subscriptionModel.js";

const checkUser = async (req, res, next) => {
  const token = req.cookies.jsonwebtoken;
  const token2 = req.cookies.userData;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.company = null;
        next();
      } else {
        jwt.verify(token2, process.env.JWT_SECRET, (err, decodedToken) => {
          res.locals.usersNames = decodedToken.usersNames;
        });
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
    return next(new CustomError("sunucuda bir sorun oluştu", 500, error));
  }
};
const checkSubscription = async (req, res, next) => {
  try {
    console.log("burası1")
    let company = res.locals.company;

    if (company.activeOrNot) {
      console.log("burası2")
      next();
    } else {
      console.log("burası3")
      console.log(req.path)

      if (req.path === "/companyPaymentPage" ||req.path === "/logout") {
        console.log("burası4")
        // Eğer endpoint hariç tutulmuşsa, middleware'i atla
         next();
      }else{
        res.redirect("/admin/companyPaymentPage");
      }
      
    }
  } catch (error) {
    return next(new CustomError("sunucuda bir sorun oluştu", 500, error));
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

const verifyEmployeeactiveOrNot = () => {
  return async (req, res, next) => {
    const employee = await Employee.findOne({ email: req.body.email });

    if (employee) {
      if (!employee.activeOrNot) {
        next(
          new Error(
            "Bu Kullanıcı Pasiftir. Lütfen Mağaza yetkiliniz ile iletişime geçiniz.",
            401
          )
        );
      }

      next();
    } else {
      res.json(
        Response.unsuccessResponse(
          false,
          "Bu mail adresi ile kayıtlı kullanıcı bulunamadı"
        )
      );
    }
  };
};
const checkEmployee = (req, res, next) => {
  console.log(req.params);
  console.log(res.locals.employee);
  if (req.params.id == res.locals.employee._id) {
    next();
  } else {
    res.json(
      Response.successResponse(true, "Bu sayfayı görmeye yetkili değilsiniz.")
    );
  }
};

const checkPriviliges = (...priviliges) => {
  return async (req, res, next) => {
    if (res.locals.employee.permissions.includes(priviliges)) {
      next();
    } else {
      res.json(
        Response.unsuccessResponse(
          false,
          "İşlem için yetkiniz bulunmamaktadır."
        )
      );
    }
  };
};
const checkEmployeeLimit = () => {
  return async (req, res, next) => {
    let employes= await Employee.find({company:res.locals.company,activeOrNot:true})
    let subscription= await Subscription.findOne({company:res.locals.company,status:"active"})
    console.log(employes.length)
    console.log(subscription.userCount)
    if (employes.length>=subscription.userCount) { 
   
      res.json(
        Response.unsuccessResponse(
          false,
          "Paketinize ait personel limitiniz Dolmuştur.</br> Maksimum Personel Sayısı:"+subscription.userCount+" </br> Ek Personel Satın alabilir ya da diğer personellerden bazılarını pasif edebilirsiniz.",
          400,
          "/admin/companyPaymentPage"
        )
      );
    } else {
      next();
    }
  };
};

const checkBillingInformations = (req, res, next) => {
  let company = res.locals.company;
  let employee = res.locals.employee;

  if (!employee.surname) {
    res.json(
      Response.unsuccessResponse(
        false,
        "Kullanıcı Soyadı Eksiktir.",
        400,
        `/admin/employeeSelf/${employee._id}`
      )
    );
  } else if (!employee.name) {
    res.json(
      Response.unsuccessResponse(
        false,
        "Kullanıcı İsmi Eksiktir.",
        400,
        `/admin/employeeSelf/${employee._id}`
      )
    );
  } else if (!company.VKN) {
    res.json(
      Response.unsuccessResponse(
        false,
        "Vergi Kimlik Numarası Eksiktir.",
        400,
        `/admin/settings`
      )
    );
  } else if (!company.billingAddress.address) {
    res.json(
      Response.unsuccessResponse(
        false,
        "Fatura Adres bilgisi Eksiktir.",
        400,
        `/admin/settings`
      )
    );
  } else if (!company.billingAddress.city) {
    res.json(
      Response.unsuccessResponse(
        false,
        "Fatura Şehir bilgisi Eksiktir.",
        400,
        `/admin/settings`
      )
    );
  } else {
    next();
  }
};

export {
  authenticateToken,
  checkUser,
  verifyRoles,
  checkPriviliges,
  verifyEmployeeactiveOrNot,
  checkEmployee,
  checkBillingInformations,
  checkSubscription,
  checkEmployeeLimit
};
