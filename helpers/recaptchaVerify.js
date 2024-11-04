import { CustomError } from "../helpers/error/CustomError.js";

import Company from "../models/companyModel.js";
import {Response} from "../helpers/error/Response.js";

const checkPassword = async (req, res, next) => {
  console.log("verifiyin password");
  if (req.body.password !== req.body.password2) {
    res.json(Response.unsuccessResponse(false, "Girdiğiniz şifreler farklıdır"));
  } else {
    next();
  }
};

const verifyCompanyUniqueness = async (req, res, next) => {
  try {
    console.log("verifiyin uniqueness");
    await Company.findOne({ email: req.body.email })
      .then((response) => {
        console.log(req.body.email);

        if (response != null) {
          res.json(
            Response.unsuccessResponse(
              false,
              "Bu mail ile kayıtlı kullanıcı bulunmaktadır"
            )
          );
        } else {
          next();
        }
      })
      .catch((err) => console.log(err));
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "sistemsel bir hata" + error,
    });
  }
};

const verifyRecaptcha = async (req, res, next) => {
  try {
    console.log("level1");

    const url = "https://www.google.com/recaptcha/api/siteverify";
    const params = new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRETKEY,
      response: req.body["g-recaptcha-response"],
      remoteip: req.ip,
    });
    console.log(params);
    fetch(url, {
      method: "POST",
      body: params,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          next();
        } else {
            res.json(Response.unsuccessResponse(false,"lütfen doğrulamayı giriniz"));
        }
      })
      .catch((err) => {
        res.json(Response.unsuccessResponse(false,"captcha sorunu oluştu "));
        
      });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "sistemsel bir hata" + error,
    });
  }
};

export { verifyRecaptcha, checkPassword, verifyCompanyUniqueness };
