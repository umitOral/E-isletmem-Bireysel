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
  SMS_TEMPLATES,
} from "../config/status_list.js";
import { role_privileges } from "../config/role_priveleges.js";

import Iyzipay from "iyzipay";

import { v4 as uuidv4 } from "uuid";
import { NOTIFICATIONS } from "../config/notifications.js";
import User from "../models/userModel.js";
import CompanyPayment from "../models/companyPaymentModel.js";
import { PRODUCTS } from "../config/companyProducts.js";
import { Response } from "../helpers/error/Response.js";
import moment from "moment";

const createCompany = async (req, res, next) => {
  try {
    console.log(req.body);
    const data = req.body;

    req.body.serviceDatas = [];
    req.body.smsTemplates = [];
    DATAS_LIST.forEach((singleData) => {
      req.body.serviceDatas.push({
        dataName: singleData.dataName,
        dataOptions: singleData.dataOptions,
      });
    });
    SMS_TEMPLATES.forEach((template) => {
      req.body.smsTemplates.push(template);
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
    data.notifications = NOTIFICATIONS.notifications.map(
      (item, value) => item.key
    );

    await Employee.create(data);
    let subscriptionData = {
      company: company._id,
      paymentDuration: 14,
      subscriptionType: "trial",
      status: "active",
      userCount: 5,
      startDate: Date.now(),
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
    console.log("updateCompanyInformations");
    console.log(Number(req.body.VKN)=== res.locals.company.VKN);
    console.log( res.locals.company.VKN);

    if (req.body.VKN !== "" &&( res.locals.company.VKN!==Number(req.body.VKN))) {
      console.log("heyt")
      let company = await Company.findOne({ VKN: req.body.VKN });
      if (company) {
        console.log("burası");
        res.json(
          Response.unsuccessResponse(
            false,
            "Bu VKN adresi kullanılmaktadır.",
            401
          )
        );
      } else {
        
        req.body.address = {
          address: req.body["address[address]"],
          city: req.body["address[city]"],
        };

        req.body.billingAddress = {
          address: req.body["billingAddress[address]"],
          city: req.body["billingAddress[city]"],
        };

        req.body.workHours = {
          workStart: req.body["workHours[workStart]"],
          workEnd: req.body["workHours[workEnd]"],
          workPeriod: req.body["workHours[workPeriod]"],
        };
        await Company.findOneAndUpdate({_id:req.params.id},req.body)
        res.json({
          success: true,
          message: "bilgiler başarıyla değiştirildi.",
        });
      }
    }else{
      req.body.address = {
        address: req.body["address[address]"],
        city: req.body["address[city]"],
      };

      req.body.billingAddress = {
        address: req.body["billingAddress[address]"],
        city: req.body["billingAddress[city]"],
      };

      req.body.workHours = {
        workStart: req.body["workHours[workStart]"],
        workEnd: req.body["workHours[workEnd]"],
        workPeriod: req.body["workHours[workPeriod]"],
      };
      await Company.findOneAndUpdate({_id:req.params.id},req.body)
      res.json({
        success: true,
        message: "bilgiler başarıyla değiştirildi.",
      });
    }

    
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
    console.log("addCompanyPayment");
    console.log(req.body);
    const id = uuidv4();
    const company = res.locals.company;
    const employee = res.locals.employee;
    console;
    //req.body= { type: 'subscription', price: 750, paymentDuration: '1' }
    let { paymentDuration } = req.body;
    paymentDuration = paymentDuration * 30;
    let price = 1;

    let data = {
      locale: "tr",
      conversationId: id,
      price: price.toString(),
      basketId: `basket-${Date.now()}`,

      buyer: {
        id: company._id.toString(),
        name: employee.name,
        surname: employee.surname,
        identityNumber: company.VKN,
        email: company.email,
        gsmNumber: company.phone,
        registrationAddress: company.billingAddress.address,
        city: company.billingAddress.city,
        country: "TR",
        ip: "85.34.78.112",
      },

      billingAddress: {
        address: company.billingAddress.address,
        contactName: employee.name,
        city: company.billingAddress.city,
        country: "TR",
      },
      basketItems: [
        {
          id: PRODUCTS.subscriptionPurchase.id,
          price: price.toString(),
          name: PRODUCTS.subscriptionPurchase.name,
          category1: PRODUCTS.subscriptionPurchase.category,
          itemType: "VIRTUAL",
        },
      ],
      enabledInstallments: [1],
      callbackUrl: "http://localhost:3004/handlePaymentCallback",
      currency: "TRY",
      paidPrice: price.toString(),
    };

    var iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_URI,
    });

    iyzipay.checkoutFormInitialize.create(data, async function (err, result) {
      if (err) {
        return next(new CustomError("ödeme sunucusunda hata oluştu", 500, err));
      } else {
        console.log("result");
        console.log(result);
        if (result.status === "success") {
          let data = {
            company: res.locals.company,
            price: price,
            systemTime: result.systemTime,
            conversationId: result.conversationId,
            token: result.token,
            product: {
              userCount: req.body.userCount,
              paymentDuration: paymentDuration,
              price: price,
            },
            paymentType: "subscription",
          };
          await CompanyPayment.create(data);
          res.json({
            success: true,
            message: "ödeme ekranına yönlendiriliyorsunuz",
            data: result,
          });
        } else {
          res.json({
            success: false,
            message: result.errorMessage,
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const addEmployeeToSubscription = async (req, res, next) => {
  try {
    // TODO
    console.log("addEmployeePayment");
    console.log(req.body);
    const id = uuidv4();
    const company = res.locals.company;
    const employee = res.locals.employee;
    // const price = req.body.price;
    let price = 1;

    let data = {
      locale: "tr",
      conversationId: id,
      price: price.toString(),
      basketId: `basket-${Date.now()}`,

      buyer: {
        id: company._id.toString(),
        name: employee.name,
        surname: employee.surname,
        identityNumber: company.VKN,
        email: company.email,
        gsmNumber: company.phone,
        registrationAddress: company.billingAddress.address,
        city: company.billingAddress.city,
        country: "TR",
        ip: "85.34.78.112",
      },

      billingAddress: {
        address: company.billingAddress.address,
        contactName: employee.name,
        city: company.billingAddress.city,
        country: "TR",
      },
      basketItems: [
        {
          id: PRODUCTS.userPurchaseForSubscription.id,
          price: price.toString(),
          name: PRODUCTS.userPurchaseForSubscription.name,
          category1: PRODUCTS.userPurchaseForSubscription.category,
          itemType: "VIRTUAL",
        },
      ],
      enabledInstallments: [1],
      callbackUrl:
        "http://localhost:3004/handlePaymentCallback?paymentType=User_Purchase",
      currency: "TRY",
      paidPrice: price.toString(),
    };

    var iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_URI,
    });

    iyzipay.checkoutFormInitialize.create(data, async function (err, result) {
      if (err) {
        return next(new CustomError("ödeme sunucusunda hata oluştu", 500, err));
      } else {
        console.log("result");
        console.log(result);
        if (result.status === "success") {
          let data = {
            company: res.locals.company,
            price: price,
            systemTime: result.systemTime,
            conversationId: result.conversationId,
            token: result.token,
            product: {
              userCount: req.body.userCount,
              price: price,
            },
            paymentType: PRODUCTS.userPurchaseForSubscription.name,
          };
          await CompanyPayment.create(data);
        }

        res.json({
          success: true,
          message: "ödeme ekranına yönlendiriliyorsunuz",
          data: result,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const handlePaymentCallback = async (req, res, next) => {
  try {
    console.log("önemli");
    console.log(req.body);
    console.log(req.query);

    const companyPayment = await CompanyPayment.findOne({
      token: req.body.token,
    });

    let company = await Company.findById(companyPayment.company._id);

    var iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: "https://api.iyzipay.com",
    });

    iyzipay.checkoutForm.retrieve(
      {
        locale: Iyzipay.LOCALE.TR,
        conversationId: companyPayment.conversationId,
        token: req.body.token,
      },
      async (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Ödeme doğrulama hatası",
            error: err,
          });
        } else {
          let message = "Ödeme Başarılı";
          companyPayment.paymentStatus = result.paymentStatus;
          companyPayment.errorMessage = result.errorMessage;
          console.log(result);
          console.log("x");
          if (result.paymentStatus === "SUCCESS") {
            companyPayment.price = result.paidPrice;
            companyPayment.paymentId = result.paymentId;
            if (req.query.paymentType === "User_Purchase") {
              await Subscription.findOneAndUpdate(
                { company: company, status: "active" },
                {
                  $push: {
                    payments: {
                      paymentId: companyPayment._id,
                      price: companyPayment.price,
                    },
                  },
                  $inc: { userCount: companyPayment.product.userCount },
                }
              );
            } else {
              await Subscription.create({
                status:company.activeOrNot?"waiting": "active",
                startDate: company.activeOrNot
                  ? company.subscribeEndDate
                  : Date.now(),
                endDate: company.activeOrNot
                  ? moment(company.subscribeEndDate).add(
                      companyPayment.product.paymentDuration,
                      "days"
                    )
                  : moment().add(
                      companyPayment.product.paymentDuration,
                      "days"
                    ),
                company: companyPayment.company,
                subscriptionType: "purchased",
                payments: [
                  {
                    paymentId: companyPayment._id,
                    price: companyPayment.price,
                  },
                ],
                paymentDuration: companyPayment.product.paymentDuration,
                userCount: companyPayment.product.userCount,
              });

              company.subscribeEndDate = company.activeOrNot
                ? moment(company.subscribeEndDate).add(
                    companyPayment.product.paymentDuration,
                    "days"
                  )
                : moment().add(companyPayment.product.paymentDuration, "days");
              await company.save();
            }
            await orderSuccesEmail({
              paymentType: (req.query.paymentType==="User_Purchase")?"Ek Personel Alımı":"Abonelik Satın Alımı",
              price: companyPayment.price,
            });
          }

          await companyPayment.save();
          
          if (result.paymentStatus === "FAILURE") {
            message = "Ödeme Başarısız";
          }

          const redirectUrl = `/payment-result?status=${
            result.paymentStatus
          }&message=${result.errorMessage || message}`;

          // addSubscription(subscription);

          res.redirect(redirectUrl);
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

const updateCompanyNotification = async (req, res, next) => {
  console.log(req.body);
  try {
    let company = await Company.findById(res.locals.company._id);
    if (company.notifications.includes(req.body.notificationkey)) {
      company.notifications = company.notifications.filter(
        (x) => x !== req.body.notificationkey
      );
    } else {
      company.notifications.push(req.body.notificationkey);
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

const handlePaymentResult = async (req, res) => {
  const { status, message } = req.query;
  console.log("xyxy:" + status + message);
  res.render("front/payment-result", {
    success: status,
    message: message,
  });
};

export {
  updateCompanyPassword,
  handlePaymentResult,
  updateCompanyInformations,
  addCompanyPayment,
  handlePaymentCallback,
  createCompany,
  updateSmsConfig,
  updateCompanyDocs,
  updateCompanyNotification,
  addEmployeeToSubscription,
};
