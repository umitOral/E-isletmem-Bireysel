import User from "../models/userModel.js";
import Employee from "../models/EmployeesModel.js";
import Appointment from "../models/appointmentModel.js";
import Company from "../models/companyModel.js";
import jwt from "jsonwebtoken";
import { CustomError } from "../helpers/error/CustomError.js";
import  {SESSION_STATUS_LIST,OPERATION_STATUS,APPOINTMENT_STATUS, OPERATION_STATUS_AUTOMATIC, SESSION_STATUS_LIST_AUTOMATIC, OPERATION_APPOINTMENT_AVALIABLE_STATUS} from "../config/status_list.js";
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
const newOperationAddProved = async (req, res) => {
  try {
    console.log("denemex")
    console.log(req.params)
    console.log(req.body)
    
    let service=res.locals.company.services.find((item)=>item.serviceName===req.body.serviceName)
   



    ////////////////
    let data={
      user:req.params.userId,
      operationName:service.serviceName,
      operationPrice:service.servicePrice,
      company : res.locals.company,
      operationStatus : OPERATION_STATUS_AUTOMATIC.CONTINUE,
    }

    let foundedOperation = await Operation.create(data);
   
    foundedOperation.sessionOfOperation.push({
      sessionState:SESSION_STATUS_LIST_AUTOMATIC.WAITING,
      refAppointmentId:req.params.appointmentId,
      sessionDatas:[],
      sessionDate:new Date(),
    })


    if (foundedOperation.totalAppointments === foundedOperation.sessionOfOperation.length) {
      foundedOperation.operationStatus = OPERATION_STATUS_AUTOMATIC.FINISH;
      
    }
    foundedOperation.operationAppointmentStatus = OPERATION_APPOINTMENT_AVALIABLE_STATUS.AVALIABLE;
    await foundedOperation.save();

   
/////////////
    const appointment = await Appointment.findById(req.params.appointmentId );
    if (appointment.operations.length===0 ) {
      console.log("okey1")
      appointment.operations.push(req.params.operationId)
        await appointment.save()
    }else{
      console.log("okey2")
      console.log("okey2")
      console.log(foundedOperation._id)
      let index=appointment.operations.findIndex(item=>item===foundedOperation._id)
      console.log(index)
      if (  index===-1) {
        console.log("okey3")
        appointment.operations.push(foundedOperation._id)
        await appointment.save()
      }
    }
   
    res.status(200).json({
      data:appointment ,
      success:true,
      link: "users",
      message: "işlem eklendi",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      succes: false,
      message: "api hatası",
    });
  }
};

const oldOperationAddProved = async (req, res) => {
  try {
    console.log("hahooo")
    const appointment = await Appointment.findById(req.params.appointmentId );
    if (appointment.operations.length===0 ) {
      console.log("okey1")
      appointment.operations.push(req.params.operationId)
        await appointment.save()
    }else{
      let index=appointment.operations?.findIndex(item=>item===req.params.appointmentId)
      if (  index!==-1) {
        console.log("okey")
        appointment.operations.push(req.params.operationId)
        await appointment.save()
      }
    }
   
    res.status(200).json({
      data:appointment ,
      success:true,
      link: "users",
      message: "işlem eklendi",
    });
  } catch (error) {
    console.log(error)
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

const getSingleDayAllDoctorSessions = async (req, res,next) => {
  try {

    
    const doctors = await Employee.find({
      company: res.locals.company._id,
      permissions: "appointment_get",
      activeOrNot: true,
    });

    // test codes
    const workHours = res.locals.company.workHours;
    const allDoctorDatas = [];
    console.log(req.params)
    const actualDate = new Date(`${req.params.date.split("-")[0]}-${req.params.date.split("-")[1]}-${req.params.date.split("-")[2]}`);
    // actualDate.setHours(0,0,0,0)
    console.log(actualDate)


    for (const i in doctors) {
      if (Object.hasOwnProperty.call(doctors, i)) {
        const element = doctors[i];

        const sessionsofdoctorforactualDay = await Appointment.find({
          date: actualDate,
          doctor: element,
        })
          .populate("user", ["name","surname"])
          .populate("doctor", ["name","surname"])
          .populate('plannedOperations.oldOperations',"operationName")
          .sort({ startHour: 1 });
        
        allDoctorDatas.push({
          doctorInformations: doctors[i],
          sessionsofdoctorforactualDay
        });
      }
    }
   



    res.status(200).json({
      workHours,
      // doctors: doctors,
      APPOINTMENT_STATUS,
      // sessionsAllDoctor: sessionsAllDoctor,
      allDoctorDatas: allDoctorDatas,
    });
  } catch (error) {
    console.log(error)
    
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const getAllAppointmentofSingleDoctor = async (req, res) => {
  try {
    console.log("burası")
    const doctor=res.locals.employee._id
    const company=res.locals.company
   
   
    // test codes
    const workHours = res.locals.company.workHours;
    console.log(req.params)
    const actualDate = new Date(`${req.params.date.split("-")[0]}-${req.params.date.split("-")[1]}-${req.params.date.split("-")[2]}`);
    console.log(actualDate)
        const appointmentsOfDoctorSingleDay = await Appointment.find({
          date: actualDate,
          doctor:doctor,
        })
          .populate(["user","plannedOperations.oldOperations","operations"])
          .sort({ startHour: 1 });

    res.status(200).json({
      succes:true,
      message:"Randevular çekildi",
      workHours:workHours,
      allDoctorDatas:[{doctorInformations:res.locals.employee,
        sessionsofdoctorforactualDay:appointmentsOfDoctorSingleDay
      }],
      company:company,
      SESSION_STATUS_LIST,
      OPERATION_STATUS,
      APPOINTMENT_STATUS
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      succes: false,
      message: "bir sorun oluştu yöneticiye başvurun",
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
            // daysCount +=
            //   element.timeIndexes[1] - element.timeIndexes[0] + 1;
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
  getAllAppointmentofSingleDoctor,
  oldOperationAddProved,
  newOperationAddProved
};
