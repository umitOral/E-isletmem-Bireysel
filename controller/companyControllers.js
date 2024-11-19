import Company from "../models/companyModel.js";
import Employee from "../models/EmployeesModel.js";
import Subscription from "../models/subscriptionModel.js";
import { CustomError } from "../helpers/error/CustomError.js";
import { orderSuccesEmail, sendRegisterMail } from "./mailControllers.js";

import { cloudinaryImageUploadMethod } from "../helpers/imageHelpers.js";
import {
  SERVICES_LIST,
  DATAS_LIST,
  ROLES_LIST,
  COMPANY_DOCS,
  NOTIFICATION_PERMISSIONS,
} from "../config/status_list.js";
import { role_privileges } from "../config/role_priveleges.js";

import Iyzipay from "iyzipay";

import { v4 as uuidv4 } from "uuid";

const createCompany = async (req, res, next) => {
  try {
    const data = req.body;
    const newDate = new Date();
    req.body.subscribeEndDate = new Date(
      newDate.setMonth(newDate.getMonth() + 1)
    ).toISOString();

    req.body.serviceDatas = [];
    DATAS_LIST.forEach((singleData) => {
      req.body.serviceDatas.push({
        dataName: singleData.dataName,
        dataOptions: singleData.dataOptions,
      });
    });

    const processes = SERVICES_LIST;

    req.body.services = [];

    processes.forEach((process) => {
      req.body.services.push({
        serviceName: process,
        servicePrice: 100,
        activeorNot: true,
      });
    });

    const company = await Company.create(data);

    data.role = ROLES_LIST.ADMIN;
    data.company = company._id;
    data.permissions = role_privileges.privileges.map(
      (privilege, value) => privilege.key
    );
    data.notifications = NOTIFICATION_PERMISSIONS.map(
      (item, value) => item.key
    );

    await Employee.create(data);
    let subscriptionData = {
      company: company._id,
      amount: 0,
      paymentDuration: 30,
      paymentTransactionId: 0,
    };
    await Subscription.create(subscriptionData);
    await sendRegisterMail();
    res.json({
      createSuccess: true,
      message: "kaydınız başarıyla oluşturuldu",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const updateCompanyPassword = async (req, res, next) => {
  try {
    if (req.body.password !== req.body.password2) {
      res.status(400).json({
        succes: false,
        message: "şifreler aynı değil",
      });
    } else {
      const employee = await Employee.findOne({
        email: res.locals.company.email,
      });

      employee.password = req.body.password;
      employee.save();

      res.json({
        succes: true,
        message: "bilgiler başarıyla değiştirildi.",
      });
    }
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const updateCompanyInformations = async (req, res, next) => {
  try {
    req.body.workHours = {
      workStart: req.body.workStart,
      workEnd: req.body.workEnd,
      workPeriod: req.body.workPeriod,
    };

    await Company.findByIdAndUpdate(req.params.id, req.body);

    res.json({
      succes: true,
      message: "bilgiler başarıyla değiştirildi.",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const updateSmsConfig = async (req, res, next) => {
  try {
    console.log("updateSmsConfig");
    console.log(req.body);

    let { userName, password } = req.body;
    await Company.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          "smsConfig.userName": userName,
          "smsConfig.password": password,
        },
      }
    );

    res.json({
      succes: true,
      message: "bilgiler başarıyla değiştirildi.",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const updateCompanyDocs = async (req, res, next) => {
  try {
    console.log("updateCompanyDocs");

    console.log(req.params.docKey);
    const files = req.files;
    const path = files.file.tempFilePath;
    console.log(files.file.mimetype);
    const doc = await cloudinaryImageUploadMethod(path);
    console.log(doc);
    const name = COMPANY_DOCS.find((doc) => doc.key === req.params.docKey).name;
    let data = {
      docKey: req.params.docKey,
      mimetype: files.file.mimetype,
      url: doc.secure_url,
      public_id: doc.public_id,
    };

    let result = await Company.findOneAndUpdate(
      { _id: req.params.id, "companyDocs.docKey": req.params.docKey },
      {
        $set: {
          "companyDocs.$": data,
        },
      },
      {
        new: true,
      }
    );

    if (!result) {
      await Company.findByIdAndUpdate(
        req.params.id,
        {
          $push: { companyDocs: data },
        },
        { new: true }
      );
    }

    res.json({
      succes: true,
      message: "Dosya  Yüklendi..",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const addCompanyPayment = async (req, res, next) => {
  try {
    // TODO

    const id = uuidv4();
    const company = await Company.findOne({ _id: res.locals.company._id });

    const { price, paymentDuration } = req.body;
    console.log(price);
    let data = {
      locale: "tr",
      conversationId: id,
      price: price,
      basketId: "B67832",
      paymentGroup: "PRODUCT",
      buyer: {
        id: "BY789",
        name: "John",
        surname: "Doe",
        identityNumber: "74300864791",
        email: "email@email.com",
        gsmNumber: "+905350000000",
        registrationDate: "2013-04-21 15:12:09",
        lastLoginDate: "2015-10-05 12:43:35",
        registrationAddress:
          "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34732",
        ip: "85.34.78.112",
      },
      shippingAddress: {
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
      },
      billingAddress: {
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
      },
      basketItems: [
        {
          id: "BI101",
          price: price,
          name: "Binocular",
          category1: "Collectibles",
          category2: "Accessories",
          itemType: "PHYSICAL",
        },
      ],
      enabledInstallments: [1, 2, 3, 6, 9],
      callbackUrl: " http://localhost:3004/companyPaymentResultPage",
      currency: "TRY",
      paidPrice: price,
    };

    var iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: "https://api.iyzipay.com",
    });

    iyzipay.checkoutFormInitialize.create(data, async function (err, result) {
      if (err) {
        console.log(err);
      } else {
        let data = {
          company: res.locals.company,
          amount: price,
          paymentDuration: paymentDuration,
          systemTime: result.systemTime,
          conversationId: result.conversationId,
          token: result.token,
        };
        await Subscription.create(data);
        await orderSuccesEmail(result)
        res.json({
          success: true,
          message: "ödeme sayfasına yönlendiriliyorsunuz.",
          data: result.paymentPageUrl,
        });
      }
    });

    
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const companyPaymentResult = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ token: req.body.token });

    var iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: "https://api.iyzipay.com",
    });

    iyzipay.checkoutForm.retrieve(
      {
        locale: Iyzipay.LOCALE.TR,
        conversationId: subscription.conversationId,
        token: subscription.token,
      },
      async (err, result) => {
        if (err) {
          // console.log(err);
        } else {
          await Subscription.findOneAndUpdate(
            { conversationId: subscription.conversationId },
            {
              status: "success",
            }
          );
          addSubscription(subscription);
          res.status(200).render("front/companyPaymentResultPage", {
            success: true,
            link: "companyPaymentResultPage",
            message: "ödemeniz başarıyla alınmıştır.",
          });
        }
      }
    );
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

async function addSubscription(subscription) {
  let company = await Company.findById(subscription.company);

  console.log(subscription.paymentDuration);
  let today = new Date();
  let diffTime = Math.ceil(
    (company.subscribeEndDate - today) / (1000 * 60 * 60 * 24)
  );
  console.log(diffTime);
  console.log(
    new Date().setDate(
      company.subscribeEndDate.getDate() +
        subscription.paymentDuration +
        diffTime
    )
  );
  if (company.subscribeEndDate > today) {
    company.subscribeEndDate = new Date().setDate(
      company.subscribeEndDate.getDate() +
        subscription.paymentDuration +
        diffTime
    );
    await company.save();
  } else {
    company.subscribeEndDate = new Date().setDate(
      today.getDate() + subscription.paymentDuration
    );
    await company.save();
  }
}
const getCompanyNotificationPermission = async (req, res, next) => {
  try {
    console.log("getCompanyNotificationPermission");
    let company = res.locals.company;
    res.status(201).json({
      success: true,
      message: "izinler başarıyla çekildi",
      data: company.notifications,
      NOTIFICATION_PERMISSIONS,
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const updateCompanyNotification = async (req, res, next) => {
  console.log(req.body);
  try {
    let company = await Company.findById(res.locals.company._id);
    if (company.notifications.includes(req.body.notificationkey)) {
      company.notifications = company.notifications.filter((x) => x !== req.body.notificationkey);
    } else {
      company.notifications.push(req.body.notificationkey)
    }

    console.log(company.notifications);
    await company.save();
    res.status(200).json({
      success: true,
      message: "izin değiştirildi",
      data: req.body.notificationkey,
      link: "employees",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

export {
  updateCompanyPassword,
  updateCompanyInformations,
  addCompanyPayment,
  companyPaymentResult,
  createCompany,
  updateSmsConfig,
  updateCompanyDocs,
  getCompanyNotificationPermission,
  updateCompanyNotification
};
