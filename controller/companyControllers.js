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
    data.notifications = NOTIFICATIONS.map((item, value) => item.key);

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
    console.log("updateCompanyInformations");
    console.log(req.body);
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

    let result = await Company.findByIdAndUpdate(req.params.id, req.body);
    console.log(result);
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
    console.log("addCompanyPayment");
    console.log(req.body);
    console.log(req.params);
    const id = uuidv4();
    const company = res.locals.company;
    const employee = res.locals.employee;
    console
    //req.body= { type: 'subscription', price: 750, paymentDuration: '1' }
    const { paymentDuration } = req.body;
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
        registrationAddress: company.address.address,
        city: company.address.city,
        country: "TR",
        ip:"85.34.78.112",
      },
      
      billingAddress: {
        address: company.billingAddress.address,
        contactName: employee.name,
        city: company.billingAddress.city,
        country: "TR",
      },
      basketItems: [
        {
          id: "BI101",
          price: price.toString(),
          name: "Binocular",
          category1: "Collectibles",
          category2: "Accessories",
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
      uri: "https://api.iyzipay.com"
    });
   

   

    iyzipay.checkoutFormInitialize.create(
      data,
      async function (err, result) {
        if (err) {

          return next(new CustomError("ödeme sunucusunda hata oluştu", 500, err));
        }else{
          console.log("result");
          console.log(result);
          if (result.status === "success") {
            let data = {
              company: res.locals.company,
              amount: price,
              paymentDuration: paymentDuration,
              systemTime: result.systemTime,
              conversationId: result.conversationId,
              token: result.token,
            };
            await Subscription.create(data);
            
          }
         
          // @@ GOTO
          // await orderSuccesEmail(result)
          res.json({
            success: true,
            message: "ödeme ekranına yönlendiriliyorsunuz",
            data: result,
          });
        }

      }
    );

    
    
    
  } catch (error) {
    console.log(error);
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const handlePaymentCallback = async (req, res, next) => {
  try {
    console.log("önemli");
    console.log(req.body);
    console.log(req.params);
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
        token: req.body.token,
      },
      async (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Ödeme doğrulama hatası",
            error: err
          });
        } else {
          subscription.status = result.paymentStatus;
          subscription.errorMessage = result.errorMessage;
          console.log(result);
          console.log("x") 
          await subscription.save()

          const redirectUrl = `/payment-result?status=${result.status}&message=${result.errorMessage || 'Ödeme başarılı'}`;

          // addSubscription(subscription);

          res.send(`
            <script>
              window.parent.postMessage({
                status: '${result.status}',
                message: '${result.errorMessage || 'Ödeme başarılı'}'
              }, '*');
            </script>
          `);
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
  console.log("xyxy:"+status+message);
  res.json({
    success: status === 'success',
    message: message
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
};
