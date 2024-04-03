import Session from "../models/sessionModel.js";
import Operation from "../models/OperationsModel.js";
// import Order from '../models/OrderModel.js';
import {
  OPERATION_STATUS,
  OPERATION_STATUS_AUTOMATIC,
} from "../config/status_list.js";

const createAppointment = async (req, res) => {
  try {
    console.log(req.body);

    req.body.appointmentData.startHour = new Date(
      `${req.body.appointmentData.date},${req.body.appointmentData.startHour}`
    );
    req.body.appointmentData.endHour = new Date(
      `${req.body.appointmentData.date},${req.body.appointmentData.endHour}`
    );

    req.body.appointmentData.date = new Date(req.body.appointmentData.date);
    req.body.appointmentData.operations = [];

    if (req.body.operations.newOperations) {
      req.body.operations.newOperations.forEach((element) => {
        element.company = res.locals.company;
        element.user = req.body.appointmentData.user;

        element.operationStatus = OPERATION_STATUS_AUTOMATIC.PLANNED;
        element.sessionOfOperation = [
          {
            sessionID: "111111111111111111111111",
            sessionState: OPERATION_STATUS_AUTOMATIC.PLANNED,
            sessionDate: new Date(req.body.appointmentData.date),
          },
        ];
        element.appointmensCount = element.sessionOfOperation.length;
      });
    }

    if (req.body.operations.oldOperations) {
      req.body.operations.oldOperations.forEach((element) => {
        req.body.appointmentData.operations.push(element);
      });
    }

    await Operation.insertMany(req.body.operations.newOperations).then(
      (response) => {
        response.forEach((element) => {
          req.body.appointmentData.operations.push(element._id);
        });
      }
    );

    let session = await Session.create(req.body.appointmentData);

    await Operation.updateMany(
      { _id: { $in: req.body.operations.oldOperations } },
      {
        $push: {
          sessionOfOperation: {
            sessionDate: new Date(req.body.appointmentData.date),
            sessionState: OPERATION_STATUS_AUTOMATIC.PLANNED,
            refAppointmentID: session._id,
          },
        },
        $set: {
          operationStatus: OPERATION_STATUS_AUTOMATIC.PLANNED,
          "sessionOfOperation[sessionOfOperation.length-1].sessionState":OPERATION_STATUS_AUTOMATIC.PLANNED,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "randevu başarıyla eklenmiştir",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "create session error",
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    console.log("delete appointment");

    let date = new Date();
    const session = await Session.findById(req.params.id);

    session.date.setTime(session.startHour);
    let diffTime = date - session.date;
    console.log(diffTime);
    if (diffTime < 0) {
      await Session.findByIdAndDelete(req.params.id);
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
    res.status(500).json({
      succes: false,
      message: "delete session error",
    });
  }
};
const updateStateAppointment = async (req, res) => {
  try {
    console.log("updateStateAppointment");
    console.log(req.query);
    console.log(req.params);

    const session = await Session.findByIdAndUpdate(req.params.id, {
      appointmentState: req.query.state,
    }).populate("operations");

   

    res.json({
      succes: true,
      message: "Randevu durumu değişti",
      data: req.query.state,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "Sunucuda bir hata yaşandı lütfen tekrar deneyiniz",
    });
  }
};
const updateAppointment = async (req, res) => {
  try {
    console.log("uptt");
    console.log(req.body);
    const session = await Session.findByIdAndUpdate(req.params.id, req.body);

    res.json({
      succes: true,
      message: "randevu bilgileri değişti",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "update session error",
    });
  }
};
const getAppointment = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("user");

    res.json({
      succes: true,
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "update session error",
    });
  }
};

export {
  getAppointment,
  createAppointment,
  deleteAppointment,
  updateStateAppointment,
  updateAppointment,
};
