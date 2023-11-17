import Session from "../models/sessionModel.js";
import Company from "../models/companyModel.js";
import Order from "../models/OrderModel.js";
import { CustomError } from "../helpers/error/CustomError.js";
import Iyzipay from "iyzipay";
import { v4 as uuidv4 } from "uuid";

const updateCompanyPassword = async (req, res, next) => {
  try {
    console.log(req.body);

    if (req.body.password !== req.body.password2) {
      return next(new Error("şifreler aynı değil"), 400);
    }

    const company = await Company.findOne({ _id: req.params.id });
    company.password = req.body.password;
    company.save();
    res.json({
      succes: true,
      message: "bilgiler başarıyla değiştirildi.",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "update error",
    });
  }
};
const updateCompanyInformations = async (req, res, next) => {
  try {
    console.log(req.body);
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
    
    const id = uuidv4();
    
    const company = await Company.findOne({ _id: res.locals.user._id });

    const { cardUserName, cardNumber, expireMonth, expireYear, cvc,price } = req.body;

    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY_TEST,
      secretKey: process.env.IYZICO_SECRET_KEY_TEST,
      uri: "https://sandbox-api.iyzipay.com",
    });

    var request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: uuidv4(),
      price: req.body.price,
      paidPrice: req.body.price,
      currency: Iyzipay.CURRENCY.TRY,
      installment: "1",
      basketId: "B67832",
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      paymentCard: {
        cardHolderName: cardUserName,
        cardNumber: cardNumber,
        expireMonth: expireMonth,
        expireYear: expireYear,
        cvc: cvc,
        registerCard: req.body.registerCard || "0",
      },
      buyer: {
        id: "BY789",
        name: "John",
        surname: "Doe",
        gsmNumber: "+905350000000",
        email: "email@email.com",
        identityNumber: "74300864791",
        lastLoginDate: "2015-10-05 12:43:35",
        registrationDate: "2013-04-21 15:12:09",
        registrationAddress:
          "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34742",
      },
      shippingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
      },
      billingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
      },
      basketItems: [
        {
          id: "BI101",
          name: "Binocular",
          category1: "Collectibles",
          category2: "Accessories",
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: req.body.price,
        },
      ],
    };

    
    iyzipay.payment.create(request, async function (err, result) {
      if (err) {
        console.log(err);
      }
      
      await Order.create({
        company: company._id,
        amount:result.paidPrice,
        paymentId:result.paymentId,
        paymentTransactionId:result.paymentTransactionId
      
      }).then(response=>console.log(response))
      .catch(err=>console.log(err));
      
      if (result.status==="success") {
        res.status(200).json({
          success:true,
          message:"işlem başarıyla gerçekleşti.",
          result
        });
      } else {
        res.status(200).json({
          success:false,
          result
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

export {
  updateCompanyPassword,
  deleteCompany,
  updateCompanyInformations,
  addCompanyPayment,
};
