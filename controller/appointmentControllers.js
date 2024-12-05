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
import User from "../models/userModel.js";
import { sendSingleSms } from "./smsControllers.js";

const createAppointment = async (req, res, next) => {
  try {
    console.log(req.body);
    req.body.appointmentData.company = res.locals.company;
    req.body.appointmentData.date = new Date(req.body.appointmentData.date);
    req.body.appointmentData.operations = [];
    let plannedOperations = [];

   

   
    let appointment = await Appointment.create(req.body.appointmentData);

    await Operation.updateMany(
      {
        _id: {
          $in: req.body.appointmentData.plannedOperations.oldOperations,
        },
      },
      {
        $push: {
          sessionOfOperation: {
            sessionDate: new Date(req.body.appointmentData.date),
            sessionState: SESSION_STATUS_LIST_AUTOMATIC.WAITING,
            refAppointmentID: appointment._id,
          },
        },
        $set: {
          operationStatus: OPERATION_STATUS_AUTOMATIC.PLANNED,
          operationAppointmentStatus: OPERATION_APPOINTMENT_AVALIABLE_STATUS.NO,
          "sessionOfOperation[sessionOfOperation.length-1].sessionState":
            SESSION_STATUS_LIST_AUTOMATIC.WAITING,
        },
      }
    );

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

const changeAppointmentStatus = async (req, res, next) => {
  try {
    console.log("change status appointment");
    console.log(req.body);

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, {
      appointmentState: req.body.status,
    });

    // appointment.operations.forEach(async (element, index) => {
    //   await Operation.updateOne(
    //     { _id: session.operations[index] },
    //     { $pull: { appointments: element } }
    //   );
    //   await Operation.updateOne(
    //     { _id: session.operations[index] },
    //     { $inc: { appointmensCount: -1 }, operationAppointmentStatus: "yok" }
    //   );
    // });

    res.json({
      succes: true,
      message: "Randevu durumu değiştirildi",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const resizeAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.body._id, {
      startHour: req.body.startHour,
      endHour: req.body.endHour,
    });

    res.json({
      success: true,
      message: "Randevu Saati değişti",
      data: appointment,
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const sendReminderSms = async (req, res, next) => {
  try {
    console.log("sendReminderSms");

    const appointment = req.body.appointment;
    const user = await User.findById(req.body.userID);

    let smsTemplate = res.locals.company.smsTemplates.find(
      (item) => item.smsName === "hatırlatma mesajı"
    );
    let messageTitle=smsTemplate.smsName
    let data=smsTemplate.content
    let company=res.locals.company
    data = data.replaceAll(
      "{{randevu-tarihi}}",
      new Date(appointment.date).toLocaleDateString()
    );
    data = data.replaceAll("{{randevu-saati}}", req.body.appointment.startHour);
    data = data.replaceAll("{{isim}}", user.name);
    data = data.replaceAll("{{soyisim}}", user.surname);
    console.log(data);
    //  @@ GOTO
    // let result=await sendSingleSms(user,company, data,messageTitle).then((response) => console.log(response)).catch(err=>console.log(err));
    console.log(result)
    res.json({
      success: true,
      message: "Sms Gönderildi",
      data:result
    });
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
    let foundedAppointment = await Appointment.findById(req.body.id);
    let foundedOperations =
      foundedAppointment.plannedOperations.oldOperations.map(
        (item) => (item = item.toString())
      );
    let requestedOperations =
      req.body.plannedOperations.oldOperations.map(
        (item) => (item = item._id)
      );
      console.log(foundedOperations)
    let newOperations = requestedOperations.filter(
      (item) => !foundedOperations.includes(item)
    ); //yeni gelen öğeler
    let deletedOperations = foundedOperations.filter(
      (item) => !requestedOperations.includes(item)
    ); //silinenler öğeler
    console.log(newOperations);
    console.log(deletedOperations);
    await Operation.updateMany(
      {
        _id: {
          $in: newOperations,
        },
      },
      {
        $push: {
          sessionOfOperation: {
            sessionDate: new Date(req.body.date),
            sessionState: SESSION_STATUS_LIST_AUTOMATIC.WAITING,
            refAppointmentID: req.body.id,
          },
        },
        $set: {
          operationStatus: OPERATION_STATUS_AUTOMATIC.PLANNED,
          operationAppointmentStatus: OPERATION_APPOINTMENT_AVALIABLE_STATUS.NO,
          "sessionOfOperation[sessionOfOperation.length-1].sessionState":
            SESSION_STATUS_LIST_AUTOMATIC.WAITING,
        },
      }
    );

    for (const element of newOperations) {
      foundedAppointment.plannedOperations.oldOperations.push(element);
    }

    for (const element of deletedOperations) {
      let foundedOperation = await Operation.findById(element);

      foundedOperation.operationStatus = OPERATION_STATUS_AUTOMATIC.WAITING;
      foundedOperation.operationAppointmentStatus =
        OPERATION_APPOINTMENT_AVALIABLE_STATUS.AVALIABLE;
      foundedOperation.appointmensCount = foundedOperation.appointmensCount - 1;
      let indexcontrol = foundedOperation.sessionOfOperation.findIndex(
        (item) => item.refAppointmentID === element
      );
      foundedOperation.sessionOfOperation.splice(indexcontrol, 1);
      await foundedOperation.save();
      let index = foundedAppointment.plannedOperations.oldOperations.findIndex(
        (item) => item.toString() === element
      );
      foundedAppointment.plannedOperations.oldOperations.splice(index, 1);
    }

    foundedAppointment.user = req.body.user;
    foundedAppointment.doctor = req.body.doctor;
    foundedAppointment.startHour = req.body.startHour;
    foundedAppointment.endHour = req.body.endHour;
    foundedAppointment.startHour = req.body.startHour;
    foundedAppointment.description = req.body.description;
    foundedAppointment.plannedOperations.newOperations =
      req.body.plannedOperations.newOperations;
    await foundedAppointment.save();

    res.json({
      success: true,
      // data: response,
      message: "randevu bilgileri değişti",
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
  changeAppointmentStatus,
  updateStateAppointment,
  updateAppointment,
  resizeAppointment,
  sendReminderSms,
};
