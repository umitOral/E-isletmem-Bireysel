import Company from "../models/companyModel.js";
import User from "../models/userModel.js";
import Sms from "../models/smsModel.js";
import { CustomError } from "../helpers/error/CustomError.js";
import { Response } from "../helpers/error/Response.js";
import mongoose from "mongoose";

import axios from "axios";
import { createSmsAuthorization } from "../helpers/smsHelpers.js";
import { sendCustomMail } from "./mailControllers.js";

const addSmsTemplate = async (req, res, next) => {
  try {
    console.log("add sms");
    console.log(req.body);

    await Company.updateOne(
      { _id: res.locals.company._id },
      {
        $push: {
          smsTemplates: req.body,
        },
      }
    )
      .then((response) => {
        console.log(response);
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
    console.log("hahoo");
    console.log("smsStatus");
    console.log(req.body);
    await sendCustomMail(req.body)
    // await Sms.findOneAndUpdate(req.body);
    res.status(201).json({
      success: true,
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
    console.log(req.body);
    await Company.updateOne(
      { "smsTemplates._id": req.params.id },
      {
        $set: {
          "smsTemplates.$[xxx].content": req.body.content,
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
const sendBulkSms = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log("bulk sms");
    req.body.message.replace("{{isim}}");
    let messages = [];
    for (const element of req.body.users) {
      await User.findById(element)
        .then((response) => {
          messages.push({
            user: response.phone,
            message: req.body.message.replace("{{isim}}", response.name),
          });
        })
        .catch((err) => console.log(err));
    }
    console.log(messages);

    res.json({ success: true, message: "mesaj içeriği değiştirildi" });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const sendSingleSms = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log(req.body);
    let foundedUser = await User.findById(req.body.userId, null, { session });

    if (foundedUser.phone === "") {
      return next(
        new CustomError("kullanıcının telefon bilgisi eksiktir", 401)
      );
    }
    let modifiedMessage = req.body.messageContent.replace(
      "{{isim}}",
      foundedUser.name
    );

    let message = {
      messageContent: modifiedMessage,
      company: res.locals.company,
      user: foundedUser,
      phone: foundedUser.phone,
    };
    let sendedSms = await Sms.create(message);
    const pushSettings = {
      url: process.env.MODE === 'production' 
        ? process.env.PUSH_NOTIFICATION_URL_LIVE 
        : process.env.PUSH_NOTIFICATION_URL_LOCAL
    };
 console.log(pushSettings)

    let data = {
      type: 1,
      sendingType: 2,
      title: req.body.messageName|| "",
      numbers: [
        {
          nr: foundedUser.phone,
          msg: modifiedMessage,
        },
      ],
      encoding: 0,
      sender: res.locals.company.smsConfig.smsTitle,
      validity: 60,
      commercial: false,
      skipAhsQuery: true,
      recipientType: 0,
      customID: sendedSms._id,
      pushSettings: {
        pushSettings,
      },
    };

    // decoded user sms password
    const authorization = await createSmsAuthorization(res.locals.company);

    await axios
      .post("http://panel4.ekomesaj.com:9587/sms/create", data, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": authorization,
        },
      })
      .then(async(response) => {
        console.log(response.data);
        sendedSms.pkg.id = response.data.data.pkgID;
        await sendedSms.save();
      })

    await session.commitTransaction();
    console.log("Transaction başarılı!");

    res.json({ success: true, message: "mesaj gönderildi." });
  } catch (error) {
    await session.abortTransaction();
    console.log("transaction iptal!");
    return next(new CustomError("bilinmeyen hata", 500, error));
  } finally {
    session.endSession();
    console.log("oturum sonlandırıldı!");
  }
};

export {
  addSmsTemplate,
  activateSmsTemplate,
  deactivateSmsTemplate,
  editSmsTemplate,
  sendBulkSms,
  sendSingleSms,
  smsStatus,
};
