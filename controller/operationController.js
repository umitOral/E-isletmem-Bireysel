import {
  OPERATION_STATUS,
  OPERATION_STATUS_AUTOMATIC,
  OPERATION_APPOINTMENT_AVALIABLE_STATUS
} from "../config/status_list.js";
import Operation from "../models/OperationsModel.js";
import {CustomError} from '../helpers/error/CustomError.js'
import { response } from "express";
import Appointment from "../models/appointmentModel.js";

const updateSessionStatusForNew = async (req,res,next) => {
  try {
    
   

  
    res.status(200).json({
      success: true,
      data:foundedOperation,
      message: "İşlem durumu değişti.",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const updateSessionStatus = async (req,res,next) => {
  try {
    
    
    let foundedOperation = await Operation.findOneAndUpdate(
      { _id: req.params.operationID },
      {
        $set: {
          "sessionOfOperation.$[elm].sessionState": req.body.value,
        },
      },
      {
        arrayFilters: [{ "elm._id": req.params.sessionID }],
        returnOriginal: false,
      }
    );

    
    if (foundedOperation.totalAppointments === foundedOperation.sessionOfOperation.length) {
      foundedOperation.operationStatus = OPERATION_STATUS_AUTOMATIC.FINISH;
      
    }
    foundedOperation.operationAppointmentStatus = OPERATION_APPOINTMENT_AVALIABLE_STATUS.AVALIABLE;
    await foundedOperation.save();
  

    res.status(200).json({
      success: true,
      data:foundedOperation,
      message: "İşlem durumu değişti.",
    });
  } catch (error) {
  }
};
const updateOperationStatus = async (req,res,next) => {
  try {
    
    
    
    let actualDate = new Date();
    let responseData = await Operation.findOneAndUpdate(
      { _id: req.params.operationID },
      {
        $set: {
          operationStatus: req.body.value,
        },
      },
      {
        returnOriginal: false,
      }
    );

    responseData.appointmensCount = responseData.sessionOfOperation.length;

    await responseData.save();
    

    res.status(200).json({
      success: true,
      responseData,
      message: "İşlem durumu değişti.",
    });
  } catch (error) {
   return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const deleteOperationsData = async (req,res,next) => {
  try {
    

    let responseData = {};
    await Operation.findOneAndUpdate(
      { _id: req.params.operationID },
      {
        $pull: {
          operationData: { _id: req.params.operationDataID },
        },
      },
      {
        returnOriginal: false,
      }
    )
      .then((res) => (responseData = res))
     

    res.status(200).json({
      success: true,
      responseData,
      message: "Data silindi.",
    });
  } catch (error) {
   return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const deleteSessionData = async (req,res,next) => {
  try {

    

    let responseData = {};
    await Operation.findOneAndUpdate(
      { _id: req.params.operationID },
      {
        $pull: {
          "sessionOfOperation.$[elm].sessionDatas": {
            _id: req.params.sessionDataID,
          },
        },
      },
      {
        arrayFilters: [{ "elm._id": req.params.sessionID }],
        returnOriginal: false,
      }
    )
      .then((res) => (responseData = res))
      

    res.status(200).json({
      success: true,
      responseData,
      message: "Data silindi.",
    });
  } catch (error) {
   return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const addSessionToOperation = async (req,res,next) => {
  try {
    
    
    await Operation.findByIdAndUpdate(
      { _id: req.params.operationID },
      {
        $inc: {
          totalAppointments: req.body.addSessionValue,
        },
      }
    ).then(async (response) => {
      if (response.operationStatus === OPERATION_STATUS.FINISH) {
        response.operationStatus = OPERATION_STATUS_AUTOMATIC.CONTINUE;
        await response.save();
      }
      res.json({
        succes: true,
        message: "seans başarıyla eklendi",
      });
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const addDescriptiontoSession = async (req,res,next) => {
  try {
    
    
    
    await Operation.findOneAndUpdate(
      { _id: req.params.operationID },
      {
        $set: {
          "sessionOfOperation.$[elm].sessionDescription": req.body.description,
        },
      },
      {
        arrayFilters: [{ "elm._id": req.params.sessionID }],
        returnOriginal: false,
      }
    ).then(async (response) => {
      res.json({
        succes: true,
        responseData: response,
        message: "Açıklama başarıyla eklendi",
      });
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const addDescriptiontoOperation = async (req,res,next) => {
  try {
    
    
    await Operation.findOneAndUpdate(
      { _id: req.params.operationID },
      {
        $set: {
          operationDescription: req.body.description,
        },
      },
      {
        returnOriginal: false,
      }
    ).then(async (response) => {
      
      res.json({
        succes: true,
        responseData: response,
        message: "Açıklama başarıyla eklendi",
      });
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const addDataToSessionInsideAppointment = async (req,res,next) => {
  try {
    
    
    

    let responseData = await Operation.findOneAndUpdate(
      { _id: req.params.operationID },

      {
        $push: {
          "sessionOfOperation.$[elm].sessionDatas": {
            dataName: req.body.dataName,
            data: req.body.data,
          },
        },
      },

      {
        arrayFilters: [{ "elm._id": req.params.sessionID }],
        returnOriginal: false,
      }
    );

    res.json({
      succes: true,
      responseData,
      message: "veri başarıyla eklendi",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const editDataofOperation = async (req,res,next) => {
  try {
    
    let responseData = await Operation.findOneAndUpdate(
      { _id: req.params.operationID },
      {
        $set: {
          "operationData.$[elm].data": req.body.value,
        },
      },

      {
        arrayFilters: [{ "elm._id": req.params.operatioDataID }],
        returnOriginal: false,
      }
    );
    

    res.status(200).json({
      responseData,
      succes: true,
      message: "başarıyla değiştirildi",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const editDataOfSession = async (req,res,next) => {
  try {
    
    
    

    let responseData = await Operation.findOneAndUpdate(
      { _id: req.params.operationID },
      {
        $set: {
          "sessionOfOperation.$[elm].sessionDatas.$[elm2].data": req.body.value,
        },
      },

      {
        arrayFilters: [
          { "elm._id": req.params.sessionID },
          { "elm2._id": req.params.sessionDataID },
        ],
        returnOriginal: false,
      }
    );
    

    res.status(200).json({
      responseData,
      succes: true,
      message: "başarıyla değiştirildi",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

export {
  addDataToSessionInsideAppointment,
  deleteSessionData,
  updateSessionStatus,
  updateOperationStatus,
  deleteOperationsData,
  editDataofOperation,
  editDataOfSession,
  addSessionToOperation,
  addDescriptiontoSession,
  addDescriptiontoOperation,
  updateSessionStatusForNew
};
