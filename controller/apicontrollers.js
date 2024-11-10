import User from "../models/userModel.js";
import Employee from "../models/EmployeesModel.js";
import Appointment from "../models/appointmentModel.js";
import Company from "../models/companyModel.js";
import jwt from "jsonwebtoken";
import { CustomError } from "../helpers/error/CustomError.js";
import  {SESSION_STATUS_LIST,OPERATION_STATUS,APPOINTMENT_STATUS} from "../config/status_list.js";
import Operation from "../models/OperationsModel.js";


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

    
    const doctors = await Employee.find({
      company: res.locals.company._id,
      permissions: "appointment_get",
      activeOrNot: true,
    });

    // test codes
    const workHours = res.locals.company.workHours;
    const allDoctorAllSessions = [];

    const actualDate = new Date(req.params.date + ",Z00:00:00");
    const date = new Date(req.params.date + ",Z00:00:00");

    let firstDay = date.getDate();
    let lastDay = new Date(new Date(date.setMonth(date.getMonth() + 1)).setDate(0)).getDate();
   

    for (const i in doctors) {
      if (Object.hasOwnProperty.call(doctors, i)) {
        const element = doctors[i];

        const sessionsofdoctorforactualDay = await Appointment.find({
          date: actualDate,
          doctor: element,
        })
          .populate("user", ["name","surname"])
          .populate("doctor", ["name","surname"])
          .populate("operations","operationName")
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
      APPOINTMENT_STATUS,
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
const getAllAppointmentofSingleDoctor = async (req, res) => {
  try {
    
    const doctor=res.locals.employee._id
    const company=res.locals.company
   
   
    // test codes
    const workHours = res.locals.company.workHours;
  
    const actualDate = new Date(req.params.date + ",Z00:00:00");
    console.log(actualDate)
        const sessionsOfDoctorSingleDay = await Appointment.find({
          date: actualDate,
          doctor:doctor,
        })
          .populate(["user","operations"])
          .sort({ startHour: 1 });

    res.status(200).json({
      succes:true,
      message:"Randevular çekildi",
      workHours:workHours,
      sessionsOfDoctorSingleDay: sessionsOfDoctorSingleDay,
      company:company,
      SESSION_STATUS_LIST,
      OPERATION_STATUS,
      APPOINTMENT_STATUS
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
      permissions:"appointment_get",
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

          const sessionsofdoctorforsingleDay = await Appointment.find({
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
  getDaysFullorNot,
  getAllAppointmentofSingleDoctor
};
