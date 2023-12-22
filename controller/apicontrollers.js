import User from "../models/userModel.js";
import Employee from "../models/EmployeesModel.js";
import Session from "../models/sessionModel.js";
import Company from "../models/companyModel.js";
import jwt from "jsonwebtoken";
import { CustomError } from "../helpers/error/CustomError.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: res.locals.company._id } });

    res.status(200).json({
      users: users,
      link: "users",
      message: "success",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "api hatası",
    });
  }
};

const newPassword = async (req, res, next) => {
  try {
    const token = req.params.token;

    if (req.body.password !== req.body.password2) {
      return next(new Error("şifreler aynı değil", 400));
    }
    if (!token) {
      return next(new Error("Token bulunamadı", 400));
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(
            new Error(
              "Mailin süresi doldu. Yeniden sıfırlama maili gönderiniz."
            ),
            400
          );
        }
        return next(err);
      }
    });

    const email=jwt.verify(token, process.env.JWT_SECRET).companyEmail

    const user = await Company.findOne({ email: email});
      user.password=req.body.password
      await user.save()


    res.status(200).json({
        succes: true,
        message:
          "şifre sıfırlama başarılı.Giriş sayfasına yönlendiriliyorsunuz...",
      });
  } catch (error) {
    return next(new CustomError(error))
    
  }
};



const getSingleDayAllDoctorSessions = async (req, res) => {
  try {
   
    const doctors = await Employee.find({company:res.locals.company._id,role:"doktor",activeOrNot:true});
    const workHours = res.locals.company.workHours;
    
   
   
    const sessionsAllDoctor = [];
    const date = new Date(req.params.date+',Z00:00:00');
    
    for (const i of doctors) {

      const sessionsofdoctor = await Session.find({
        date: date,
        doctor: i,
      })
        .populate(["user", "doctor"])
        .sort({ startHour: 1 });
        
      sessionsAllDoctor.push({
        doctorName: i.name,
        sessionsofdoctor: sessionsofdoctor,
      });
    }
    
    res.status(200).json({
      workHours,
      doctors: doctors,
      sessionsAllDoctor: sessionsAllDoctor,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "api hatası",
    });
  }
};

export {
  getAllUsers,
  getSingleDayAllDoctorSessions,
  newPassword
};
