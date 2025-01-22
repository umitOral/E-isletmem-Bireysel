import Company from "../models/companyModel.js";
import User from "../models/userModel.js";
import Sms from "../models/smsModel.js";
import { CustomError } from "../helpers/error/CustomError.js";
import { Response } from "../helpers/error/Response.js";
import mongoose from "mongoose";

import axios from "axios";
import { createSmsAuthorization } from "../helpers/smsHelpers.js";
import { sendCustomMail } from "./mailControllers.js";
import { SMS_STATUS } from "../config/status_list.js";
import Appointment from "../models/appointmentModel.js";

const addSmsTemplate = async (req, res, next) => {
  try {
    

    await Company.updateOne(
      { _id: res.locals.company._id },
      {
        $push: {
          smsTemplates: req.body,
        },
      }
    )
      .then((response) => {
        
        res.json({
          success: true,
          message: "sms eklendi",
        });
      })
      .catch((err) => {
        res.json({
          success: false,
          message: err.message,
        });
      });
  } catch (error) {
    res.json({
      success: false,
      message: "ürün eklenirken bir sorun oluştu",
      error: error,
    });
  }
};
const smsStatus = async (req, res, next) => {
  try {
    
    
    // 

    let data = await Sms.findOneAndUpdate(
      { "pkg.id": req.body.pkg.id },
      {
        pkg: req.body.pkg,
        items: req.body.items,
        userID: req.body.userID,
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      success: true,
      data: data,
      message: "sms-status-success",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "sms-status-error",
      error: error,
    });
  }
};

const deactivateSmsTemplate = async (req, res, next) => {
  try {
    await Company.updateOne(
      { "smsTemplates._id": req.params.id },
      {
        $set: {
          "smsTemplates.$[xxx].activeorNot": false,
        },
      },
      {
        arrayFilters: [{ "xxx._id": req.params.id }],
      }
    );
    res.redirect("back");
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const activateSmsTemplate = async (req, res, next) => {
  try {
    await Company.updateOne(
      { "smsTemplates._id": req.params.id },
      {
        $set: {
          "smsTemplates.$[xxx].activeorNot": true,
        },
      },
      {
        arrayFilters: [{ "xxx._id": req.params.id }],
      }
    );
    res.redirect("back");
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const editSmsTemplate = async (req, res, next) => {
  try {
    
    await Company.updateOne(
      { "smsTemplates._id": req.params.id },
      {
        $set: {
          "smsTemplates.$[xxx].content": req.body.content,
          "smsTemplates.$[xxx].credit": req.body.credit,
        },
      },
      {
        arrayFilters: [{ "xxx._id": req.params.id }],
      }
    );
    res.json({ success: true, message: "mesaj içeriği değiştirildi" });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const sendReminderSms = async (req, res, next) => {
  try {
    
    let appointment = await Appointment.findById(req.body.appointmentId);
    let messageContent = res.locals.company.smsTemplates.find(
      (item) => item.type === "reminder"
    ).content;
    let smsName = res.locals.company.smsTemplates.find(
      (item) => item.type === "reminder"
    ).smsName;
    await User.findById(req.body.user).then(async (response) => {
      if (response.phone !== "") {
        messageContent = messageContent
          .replace("{{isim}}", response.name)
          .replace("{{soyisim}}", response.surname)
          .replace("{{randevu-tarihi}}", appointment.date.toLocaleDateString())
          .replace("{{randevu-saati}}", appointment.startHour);
        let result = await sendSingleSms(
          response,
          res.locals.company,
          messageContent,
          smsName,
          res.locals.company.smsConfig.smsTitle
        );
        res.status(200).json({
          success: result.success,
          message: result.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "kullanıcının telefon numarası eksik",
        });
      }
    });
  } catch (error) {
    
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const sendSingleSms = async (
  user,
  companyID,
  smsContent,
  messageTitle,
  sender
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const company = await Company.findById(companyID).session(session);
    let message = {
      messageContent: smsContent,
      company: companyID,
      user: user._id,
      phone: user.phone,
    };
    

    let sendedSms = await Sms.create([message], { session });

    const pushSettings = {
      url:
        process.env.NODE_ENV === "production"
          ? process.env.PUSH_NOTIFICATION_URL_LIVE
          : process.env.PUSH_NOTIFICATION_URL_LOCAL,
    };

    let data = {
      type: 1,
      sendingType: 0,
      title: messageTitle || "",
      content: smsContent,
      number: user.phone,
      encoding: 0,
      sender: sender,
      validity: 60,
      commercial: false,
      skipAhsQuery: true,
      recipientType: 0,
      customID: sendedSms[0]._id,
      pushSettings: pushSettings,
    };
    

    // decoded user sms password
    const authorization = await createSmsAuthorization(company);
   
    const response=await axios
      .post("http://panel4.ekomesaj.com:9587/sms/create", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      })
      
        if (response.data.err) {
          await session.abortTransaction();
          
          return { success: false, message: "mesaj gönderilemedi." };
        }
       
        sendedSms[0].pkg = {
          pkgID: response.data.pkgID,
        };
        await sendedSms[0].save({ session });
        company.smsBalance -= 1;
        await company.save({ session });
        await session.commitTransaction();
        return { success: true, message: "mesaj gönderildi.", response };
      
  } catch (error) {
    
    await session.abortTransaction();
    return { success: false, message: "mesaj gönderilemedi.", error };
  } finally {
    session.endSession();
  }
};

const getSmsDetails = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    let data = {
      pkgID: req.params.packageId,
    };
    // decoded user sms password
    const authorization = await createSmsAuthorization(res.locals.company);
    let smsData;
    await axios
      .post("https://panel4.ekomesaj.com:9588/sms/list-item", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      })
      .then(async (response) => {
        
        smsData = response.data;
      });

    await session.commitTransaction();
    

    res.json({ success: true, data: smsData, SMS_STATUS });
  } catch (error) {
    await session.abortTransaction();
    
    return next(new CustomError("bilinmeyen hata", 500, error));
  } finally {
    session.endSession();
    
  }
};

export {
  addSmsTemplate,
  activateSmsTemplate,
  deactivateSmsTemplate,
  editSmsTemplate,
  sendReminderSms,
  sendSingleSms,
  smsStatus,
  getSmsDetails,
};
