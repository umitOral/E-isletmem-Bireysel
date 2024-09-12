
import { CustomError } from "../helpers/error/CustomError.js";
import axios from "axios";
import  Company  from "../models/companyModel.js";


const checkPassword = async (req,res,next) => {
    console.log("verifiyin password")
    if (req.body.password !== req.body.password2) {
        return next(new CustomError("Girdiğiniz şifreler farklıdır", 400));
      }else{
        next()
      }
}

const verifyCompanyUniqueness = async (req,res,next) => {
  try {
    console.log("verifiyin uniqueness")
    await Company.findOne({email:req.body.email})
    .then(response=>{
        console.log(req.body.email)
        
        if (response!=null) {
            
            return next(new CustomError("Bu mail ile kayıtlı kullanıcı bulunmaktadır", 400));
        } else {
            next()
        }
    })
    .catch(err=>console.log(err))
  } catch (error) {
    res.status(500).json({
        succes: false,
        message: "sistemsel bir hata" + error
    })
  }


}

const verifyRecaptcha = async (req, res, next) => {
    try {
        console.log("level1")

        const url = "https://www.google.com/recaptcha/api/siteverify"
        const params = new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRETKEY,
            response: req.body["g-recaptcha-response"],
            remoteip: req.ip
        })
        console.log(params)
        fetch(url, {
            method: "POST",
            body:
                params

        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.success) { next() }
                else {
                    { return next(new CustomError("lütfen doğrulamayı giriniz", 400)); }
                }
            })
            .catch(err => { return next(new CustomError("captcha sorunu oluştu ", 400)); })


    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "sistemsel bir hata" + error
        })
    }
}






export { verifyRecaptcha,checkPassword,verifyCompanyUniqueness};
