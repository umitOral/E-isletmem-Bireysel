import Company from "../models/companyModel.js";
import Employee from "../models/EmployeesModel.js";
import Subscription from "../models/subscriptionModel.js";
import { CustomError } from "../helpers/error/CustomError.js";
import { orderSuccesEmail } from "./mailControllers.js";
import { iyziPayDeneme } from "./iyzipayController.js";
import axios from "axios";
import CryptoJS from "crypto-js";

import Iyzipay from "iyzipay";

import { v4 as uuidv4 } from "uuid";

const updateCompanyPassword = async (req, res) => {
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
    res.status(500).json({
      succes: false,
      message: "update error",
    });
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
    res.status(500).json({
      succes: false,
      message: "update company error",
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    res.redirect("back");
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "delete error",
    });
  }
};
const addCompanyPayment = async (req, res) => {
  try {
    // TODO
    // iyziPayDeneme(req)
    console.log(req.body);
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
        res.json({
          success: true,
          message: "ödeme sayfasına yönlendiriliyorsunuz.",
          data: result.paymentPageUrl,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "ödeme işlemi sırasında sistemsel bir hata oluştu.",
    });
  }
};

const companyPaymentResult = async (req, res) => {
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
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};

async function addSubscription(subscription) {
  let company= await Company.findById(subscription.company)
  
  console.log(subscription.paymentDuration)
  let today = new Date();
  let diffTime = Math.ceil(((company.subscribeEndDate - today))/(1000*60 * 60 * 24));
  console.log(diffTime);
  console.log(new Date().setDate(company.subscribeEndDate.getDate() + subscription.paymentDuration+diffTime));
  if (company.subscribeEndDate > today) {
    company.subscribeEndDate = new Date().setDate(company.subscribeEndDate.getDate() + subscription.paymentDuration+diffTime);
    await company.save()
  } else {
    company.subscribeEndDate =new Date().setDate( today.getDate() + subscription.paymentDuration);
    await company.save()
  }
}

export {
  updateCompanyPassword,
  deleteCompany,
  updateCompanyInformations,
  addCompanyPayment,
  companyPaymentResult,
};
