import Session from "../models/appointmentModel.js";
import Operation from "../models/OperationsModel.js";
import { CustomError } from "../helpers/error/CustomError.js";
// import Order from '../models/OrderModel.js';
import {
  OPERATION_APPOINTMENT_AVALIABLE_STATUS,
  OPERATION_STATUS,
  OPERATION_STATUS_AUTOMATIC,
  SESSION_STATUS_LIST_AUTOMATIC,
  SESSION_STATUS_LIST,
} from "../config/status_list.js";
import { sendUserAppointmentMail } from "./mailControllers.js";
import Appointment from "../models/appointmentModel.js";

const createAppointment = async (req, res, next) => {
  try {
    console.log(req.body);
    req.body.appointmentData.company = res.locals.company;
    req.body.appointmentData.date = new Date(req.body.appointmentData.date);
    req.body.appointmentData.operations = [];
    let plannedOperations = [];

    if (req.body.appointmentData.plannedOperations.length !== 0) {
      req.body.appointmentData.plannedOperations.forEach((element) => {
        let service = res.locals.company.services.find(
          (item) => item.serviceName === element
        );
        let operation = {};

        operation.operationName = element;
        operation.operationPrice = service.servicePrice;
        operation.company = res.locals.company;
        operation.operationAppointmentStatus =
          OPERATION_APPOINTMENT_AVALIABLE_STATUS.NO;
        operation.user = req.body.appointmentData.user;

        operation.operationStatus = OPERATION_STATUS_AUTOMATIC.PLANNED;
        operation.sessionOfOperation = [
          {
            sessionID: "111111111111111111111111",
            sessionState: OPERATION_STATUS_AUTOMATIC.PLANNED,
            sessionDate: new Date(req.body.appointmentData.date),
          },
        ];
        operation.appointmensCount = 1;
        plannedOperations.push(operation);
      });
    }

    // await Operation.insertMany(plannedOperations).then((response) => {
    //   response.forEach((element) => {
    //     req.body.appointmentData.operations.push({
    //       operation: element._id,
    //       session: 1,
    //       type: "new",
    //     });
    //   });
    // });

    let appointment = await Appointment.create(req.body.appointmentData);

    // await Operation.updateMany(
    //   {
    //     _id: {
    //       $in: req.body.operations.oldOperations.map(
    //         (item) => item.operationID
    //       ),
    //     },
    //   },
    //   {
    //     $push: {
    //       sessionOfOperation: {
    //         sessionDate: new Date(req.body.appointmentData.date),
    //         sessionState: SESSION_STATUS_LIST_AUTOMATIC.WAITING,
    //         refAppointmentID: appointment._id,
    //       },
    //     },
    //     $set: {
    //       operationStatus: OPERATION_STATUS_AUTOMATIC.PLANNED,
    //       operationAppointmentStatus: OPERATION_APPOINTMENT_AVALIABLE_STATUS.NO,
    //       "sessionOfOperation[sessionOfOperation.length-1].sessionState":
    //         SESSION_STATUS_LIST_AUTOMATIC.WAITING,
    //     },
    //   }
    // );

    let data = {
      brandName: appointment.company.brandName,
      companyPhone: appointment.company.phone,
      date: req.body.appointmentData.date,
      startHour: req.body.appointmentData.startHour,
    };

    // sendUserAppointmentMail(req.body.userEmail, data);

    res.status(200).json({
      success: true,
      data: appointment,
      message: "randevu başarıyla eklenmiştir",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    console.log("delete appointment");

    let date = new Date();
    const session = await Appointment.findById(req.params.id);
    // let totalMinutes=Number(session.endHour.split(":")[0]*60)+Number(session.endHour.split(":")[1])
    console.log(session);
    session.date.setHours(
      session.endHour.split(":")[0],
      session.endHour.split(":")[1]
    );
    console.log(session.date);
    let diffTime = date - session.date;
    console.log(diffTime);
    if (diffTime < 0) {
      await Appointment.findByIdAndDelete(req.params.id);
      session.operations.forEach(async (element, index) => {
        await Operation.updateOne(
          { _id: session.operations[index] },
          { $pull: { appointments: element } }
        );
        await Operation.updateOne(
          { _id: session.operations[index] },
          { $inc: { appointmensCount: -1 }, operationAppointmentStatus: "yok" }
        );
      });

      res.json({
        succes: true,
        message: "Seans Başarıyla Silindi",
      });
    } else {
      res.json({
        succes: false,
        message: "Geçmişteki bir Randevu Silinemez!",
      });
    }
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const updateStateAppointment = async (req, res, next) => {
  try {
    console.log(req.query);
    console.log(req.params);

    const session = await Appointment.findByIdAndUpdate(req.params.id, {
      appointmentState: req.query.state,
    }).populate("operations");

    res.json({
      succes: true,
      message: "Randevu durumu değişti",
      data: req.query.state,
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const updateAppointment = async (req, res, next) => {
  try {
    console.log("uptt");
    console.log(req.body);
    const session = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).then(response=>{
      res.json({
        success: true,
        data: response,
        message: "randevu bilgileri değişti",
      });
    });
    
   
  } catch (error) {
    return next(new CustomError("Sistemde bir sorun oluştu", 500, error));
  }
};
const getAppointment = async (req, res, next) => {
  try {
    const session = await Appointment.findById(req.params.id).populate("user");

    res.json({
      succes: true,
      data: session,
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

export {
  getAppointment,
  createAppointment,
  deleteAppointment,
  updateStateAppointment,
  updateAppointment,
};
