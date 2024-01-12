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
const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.params.userID }).populate([
      "doctor",
    ]);

    res.status(200).json({
      succes: true,
      sessions: sessions,
      message: "seanslar başarıyla çekildi",
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
    console.log("burası");
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
      } else {
        console.log(decoded);
      }
    });

    const email = jwt.verify(token, process.env.JWT_SECRET).employeeEmail;

    const employee = await Employee.findOne({ email: email });
    employee.password = req.body.password;
    await employee.save();

    res.status(200).json({
      succes: true,
      message:
        "şifre sıfırlama başarılı.Giriş sayfasına yönlendiriliyorsunuz...",
    });
  } catch (error) {
    return next(new CustomError(error));
  }
};

const getSingleDayAllDoctorSessions = async (req, res) => {
  try {

    console.log("burası")
    const doctors = await Employee.find({
      company: res.locals.company._id,
      role: "doktor",
      activeOrNot: true,
    });

    // test codes
    const workHours = res.locals.company.workHours;
    const allDoctorAllSessions = [];

    const actualDate = new Date(req.params.date + ",Z00:00:00");
    const date = new Date(req.params.date + ",Z00:00:00");

    let firstDay = date.getDate();
    let lastDay = new Date(new Date(date.setMonth(date.getMonth() + 1)).setDate(0)).getDate();
    console.log(firstDay);
    console.log(lastDay);

    for (const i in doctors) {
      if (Object.hasOwnProperty.call(doctors, i)) {
        const element = doctors[i];

        const sessionsofdoctorforactualDay = await Session.find({
          date: actualDate,
          doctor: element,
        })
          .populate(["user", "doctor"])
          .sort({ startHour: 1 });
        
        allDoctorAllSessions.push({
          doctorName: doctors[i].name,
          sessionsofdoctorforactualDay
        });
      }
    }
   

    console.log(allDoctorAllSessions)


    res.status(200).json({
      workHours,
      doctors: doctors,
      // sessionsAllDoctor: sessionsAllDoctor,
      allDoctorAllSessions: allDoctorAllSessions,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "api hatası",
    });
  }
};
const getDaysFullorNot = async (req, res) => {
  try {

    const doctors = await Employee.find({
      company: res.locals.company._id,
      role: "doktor",
      activeOrNot: true,
    });

    const workHours = res.locals.company.workHours;
    const actualDate = new Date(req.params.date + ",Z00:00:00");
    const date = new Date(req.params.date + ",Z00:00:00");

    
    let lastDay = new Date(new Date(date.setMonth(date.getMonth() + 1)).setDate(0)).getDate();
    console.log(actualDate);
    console.log(lastDay);

    let sessionsFullorNot= []
   
    for (let index = 1; index <= lastDay; index++) {
        let daysCount=0
      for (const i in doctors) {
        if (Object.hasOwnProperty.call(doctors, i)) {
          const element = doctors[i];

          const sessionsofdoctorforsingleDay = await Session.find({
            date: new Date(actualDate.setDate(index)),
            doctor: doctors[i],
          }).sort({ startHour: 1 });
          
          sessionsofdoctorforsingleDay.forEach((element) => {
            daysCount +=
              element.timeIndexes[1] - element.timeIndexes[0] + 1;
          });

        }
      }
     let fullorNot=false
     if (daysCount ===(Number(workHours.workEnd.split(":")[0]) -Number(workHours.workStart.split(":")[0])) *(60 / workHours.workPeriod)*doctors.length
     ) {
      fullorNot=true
     } else {
      fullorNot=false
     }

      sessionsFullorNot.push(
        fullorNot
      );
    

    }


    res.status(200).json({
      sessionsFullorNot:sessionsFullorNot
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
  newPassword,
  getAllSessions,
  getDaysFullorNot
};
