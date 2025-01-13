import User from "../models/userModel.js";
import moment from "moment";
import fs from "fs";
import Employee from "../models/EmployeesModel.js";

import { COMPANY_DOCS, DOC_STATUS } from "../config/status_list.js";

import Sessions from "../models/appointmentModel.js";
import Payment from "../models/paymentsModel.js";
import Company from "../models/companyModel.js";
import Product from "../models/productModel.js";
import { productGeneralSchema } from "../models/productGeneralModel.js";

import Subscription from "../models/subscriptionModel.js";
import { Ticket } from "../models/ticketModel.js";

import bcrypt from "bcrypt";
import { CustomError } from "../helpers/error/CustomError.js";
import { query } from "express";

import Session from "../models/appointmentModel.js";
import {
  APPOINTMENT_STATUS,

} from "../config/status_list.js";
import { searchProduct } from "./productControllers.js";
import { getTenantDb } from "./db.js";
import { BRAND_LIST } from "../config/brands.js";
import { sendRegisterMail } from "./mailControllers.js";
import Appointment from "../models/appointmentModel.js";
import CITIES from "../config/cities.js";
import { Console } from "console";

let now = new Date();
let day = now.getDate();
let month = now.getMonth();
let year = now.getFullYear();

const firstDate = new Date(year, month, day);
const secondDate = new Date(year, month, day);
secondDate.setHours(23, 59, 59, 999);

const getIndexPage = (req, res) => {
  try {
    res.status(200).render("front/index", {
      link: "indexAdmin",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const resetPasswordPage = async (req, res, next) => {
  try {
    res.status(200).render("front/newPassword", {
      token: req.params.token,
      link: "newPassword",
      message: "success",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getForgotPasswordPage = async (req, res, next) => {
  try {
    res.status(200).render("front/forgotPassword", {
      link: "forgotPassword",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getSuperAdminPage = async (req, res, next) => {
  try {
    let companies = await Company.find({});

    res.status(200).render("superAdmin/superAdminMain", {
      companies,
      count: companies.length,
      link: "companies",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getSuperAdminTicketsPage = async (req, res, next) => {
  try {
    let tickets = await Ticket.find({});

    res.status(200).render("superAdmin/superAdminTickets", {
      tickets,
      count: tickets.length,
      link: "companies",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const getLoginPage = (req, res, next) => {
  try {
    res.status(200).render("front/login", {
      link: "login",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const getAboutUsPage = (req, res, next) => {
  try {
    res.status(200).render("front/about-us", {
      link: "about-us",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getTermOfUsePage = (req, res, next) => {
  try {
    res.status(200).render("front/term-of-use", {
      link: "about-us",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getServicesPage = (req, res, next) => {
  try {
    res.status(200).render("front/our-services", {
      link: "about-us",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const returnPoliciesPage = (req, res, next) => {
  try {
    res.status(200).render("front/return-policies", {
      link: "return-policies",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const privacyPoliciesPage = (req, res, next) => {
  try {
    res.status(200).render("front/privacy-policies", {
      link: "privacy-policies",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const kvkkPage = (req, res, next) => {
  try {
    res.status(200).render("front/kvkk", {
      link: "kvkk",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getPricesPage = (req, res, next) => {
  try {
    res.status(200).render("front/prices", {
      link: "prices",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getservicesPage = async (req, res, next) => {
  try {
    let company = res.locals.company;
    console.log("burası");
    let services = await company.services;
    // console.log(services)
    console.log(req.query);

    if (req.query.serviceName) {
      if (req.query.serviceName !== "") {
        services = services.filter((item) =>
          item.serviceName.includes(req.query.serviceName.toLowerCase())
        );
      }
    }

    res.status(200).render("services", {
      serviceName: req.query.serviceName,
      services,
      link: "services",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const getProductsPage = async (req, res, next) => {
  try {
    res.status(200).render("products", {
      BRAND_LIST: BRAND_LIST,
      link: "products",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const getAllProductsPage = async (req, res, next) => {
  try {
    const GeneralProductModel = getTenantDb(
      process.env.DB_NAME_GENERAL,
      "productGeneral",
      productGeneralSchema
    );
    const products = await GeneralProductModel.find({});

    res.status(200).render("allProducts", {
      products,
      link: "products",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const getSmsPage = async (req, res, next) => {
  try {
    const company = await Company.findById(res.locals.company._id);
    const smsTemplates = company.smsTemplates;

    res.status(200).render("smsPage", {
      smsTemplates,
      link: "services",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const getDatasPage = async (req, res, next) => {
  try {
    let serviceDatas = res.locals.company.serviceDatas;

    if (req.query.dataName) {
      if (req.query.dataName !== "") {
        serviceDatas = serviceDatas.filter((item) =>
          item.dataName.includes(req.query.dataName.toLowerCase())
        );
      }
    }

    res.status(200).render("datasPage", {
      link: "services",
      serviceDatas: serviceDatas,
      dataName: req.query.dataName,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const getRegisterPage = (req, res, next) => {
  try {
    res.status(200).render("front/register", {
      link: "register",
      RECAPTCHA_SITEKEY: process.env.RECAPTCHA_SITEKEY,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getContactPage = (req, res, next) => {
  try {
    res.status(200).render("front/contact-us", {
      link: "register",
      RECAPTCHA_SITEKEY: process.env.RECAPTCHA_SITEKEY,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getAdminPage = async (req, res, next) => {
  try {
    res.status(200).render("indexAdmin", {
      link: "index",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getSantralPage = async (req, res, next) => {
  try {
    res.status(200).render("santral", {
      link: "santral",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const getUsersPage = async (req, res, next) => {
  try {
    console.log("users page");
    //pagination

    let limit = 10;

    let users = await User.find({
      company: res.locals.company._id,
      role: "customer",
    })
      .limit(limit)
      .sort({ updatedAt: -1 });

      

      const smsTemplates = res.locals.company.smsTemplates.filter(
        (item) => item.activeorNot === true && item.type === 'general'
      );
      
     
    res.status(200).render("users", {
      users,
      smsTemplates,
      succes: true,
      link: "users",
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getAppointmentReportsPage = async (req, res, next) => {
  try {
    //pagination
    console.log(req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    let searchObject = {
      company: res.locals.company._id,
    };
    let personels;
    let status;
    let startDate;
    let endDate;

    if (req.query.endDate) {
      endDate = new Date(req.query.endDate);
      endDate.setHours(24, 0, 0);
    } else {
      endDate = new Date();
      endDate.setHours(24, 0, 0);
    }
    if (req.query.startDate) {
      startDate = new Date(req.query.startDate);
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(24, 0, 0);
    } else {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(24, 0, 0);
    }

    if (typeof req.query.personelInput === "string") {
      personels = [req.query.personelInput];
    } else {
      personels = req.query.personelInput;
    }

    if (typeof req.query.status === "string") {
      status = [req.query.status];
    } else {
      status = req.query.status;
    }

    if (req.query.personelInput) {
      searchObject.doctor = { $in: personels };
    }
    if (req.query.status) {
      searchObject.appointmentState = { $in: status };
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let reports = await Appointment.find(searchObject)

      .where("date")
      .gt(startDate)
      .lt(endDate)
      .populate("user", ["name", "surname"])
      .populate("doctor", ["name", "surname"])
      .skip(startIndex)
      .limit(limit)
      .sort({ date: -1 });

    let employes = await Employee.find({
      company: res.locals.company._id,
      activeOrNot: true,
    });

    let total = await Appointment.find(searchObject)
      .where("date")
      .gt(startDate)
      .lt(endDate);

    total = total.length;

    const lastpage = Math.ceil(total / limit);
    const pagination = {};
    pagination["page"] = page;
    pagination["lastpage"] = lastpage;

    if (startIndex > 0) {
      pagination.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit: limit,
      };
    }

    let STATUS = { ...APPOINTMENT_STATUS };
    STATUS = Object.values(STATUS);
    console.log(pagination);
    res.status(200).render("reports/appointmentReports", {
      reports,
      STATUS,
      employes,
      total,
      count: reports.length,
      pagination,
      query: req.query,
      link: "reports",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const paymentReportsPage = async (req, res, next) => {
  try {
    let users = await User.find({ company: res.locals.company._id });
    let employes = await Employee.find({ company: res.locals.company._id });
    res.status(200).render("reports/paymentReports", {
      users,
      employes,
      link: "reports",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const productReportsPage = async (req, res, next) => {
  try {
    let products = await Product.find({});
    res.status(200).render("reports/productReports", {
      products,
      link: "reports",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getSmsReportsPage = async (req, res, next) => {
  try {
    //pagination

    res.status(200).render("reports/smsReports", {
      link: "reports",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getUserReportsPage = async (req, res, next) => {
  try {
    //pagination

    const page = 1;
    const limit = 5;

    let searchObject = {
      company: res.locals.company._id,
    };

    let startDate;
    let endDate;

    endDate = new Date();
    endDate.setHours(24, 0, 0);

    startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(24, 0, 0);
    console.log(startDate);
    console.log(endDate);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let reports = await User.find(searchObject)

      .where("createdAt")
      .gt(startDate)
      .lt(endDate)
      .skip(startIndex)
      .limit(limit)
      .sort({ date: -1 });
    console.log(reports);

    let total = reports.length;

    const lastpage = Math.ceil(total / limit);
    const pagination = {};
    pagination["page"] = page;
    pagination["lastpage"] = lastpage;

    if (startIndex > 0) {
      pagination.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit: limit,
      };
    }

    console.log(pagination);
    res.status(200).render("reports/userReports", {
      reports,
      total,
      moment,
      count: reports.length,
      pagination,
      lastpage,
      query: req.query,
      link: "reports",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const deneme = async (req, res, next) => {
  try {
    res.status(200).render("deneme", {
      succes: true,
      message: "başarılı",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getEmployeesPage = async (req, res, next) => {
  try {
    let query = Employee.find({});

    if (req.query) {
      const searchObject = {};
      searchObject["company"] = res.locals.company._id;
      query = query.where(searchObject);
    }

    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await Employee.count()

      .where("company")
      .equals(res.locals.company._id);
    const lastpage = Math.ceil(total / limit);
    const pagination = {};
    pagination["page"] = page;
    pagination["lastpage"] = lastpage;

    if (startIndex > 0) {
      pagination.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit: limit,
      };
    }

    query = query.skip(startIndex).limit(limit);
    const employees = await query;

    res.status(200).render("employees", {
      pagination,
      total,
      count: employees.length,
      employees,
      link: "employees",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const getAppointmentsPage = async (req, res, next) => {
  try {
    let services = await Company.findById({ _id: res.locals.company._id });
    let doctors = await Employee.find({
      activeOrNot: true,
      permissions: "appointment_get",
      company:res.locals.company._id
    });
    const activeServices = [];
    services.services.forEach((element) => {
      if (element.activeorNot === true) {
        activeServices.push(element);
      }
    });
    // sort({ registerDate: 1 })

    res.status(200).render("appointments", {
      link: "appointments",
      doctors: doctors,
      services: activeServices,
      APPOINTMENT_STATUS
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const getPaymentStaticsPage = async (req, res, next) => {
  try {
    res.status(200).render("statics/payments-statics.ejs", {
      link: "statics",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getUsersStaticsPage = async (req, res, next) => {
  try {
    res.status(200).render("statics/users-statics.ejs", {
      link: "statics",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getEmployeessStaticsPage = async (req, res, next) => {
  try {
    res.status(200).render("statics/employees-statics.ejs", {
      link: "statics",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getAppointmentsStaticsPage = async (req, res, next) => {
  try {
    res.status(200).render("statics/appointments-statics.ejs", {
      link: "statics",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getSettingsPage = (req, res, next) => {
  try {
    const company = res.locals.company;
    let missedDocs = [];
    let finishedDocs = [];

    COMPANY_DOCS.forEach((element, index) => {
      let indexcontrol = company.companyDocs.findIndex(
        (item) => item.docKey === element.key
      );

      if (indexcontrol === -1) {
        missedDocs.push(element);
      } else {
        finishedDocs.push(company.companyDocs[indexcontrol]);
        finishedDocs[finishedDocs.length - 1].name = element.name;
      }
    });
    res.status(200).render("settings", {
      DOC_STATUS,
      finishedDocs,
      missedDocs,
      CITIES: CITIES,
      link: "settings",
      company,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const companyPaymentPage = async(req, res, next) => {
  try {
    const user = res.locals.company;
    let subscriptions=await Subscription.find({ company: user._id, status:"SUCCESS"})
    console.log(subscriptions)
    res.status(200).render("companyPaymentPage", {
      link: "companyPaymentPage",
      user,
      activeSubscription:subscriptions.length>0?subscriptions[0]:null,
      passiveSubscriptions:subscriptions.length>1?subscriptions.slice(1):[]
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const companyPaymentsListPage = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({
      company: res.locals.company,
    });

    res.status(200).render("companyPaymentsList", {
      link: "companyPaymentsList",
      subscriptions,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getPaymentsPage = async (req, res, next) => {
  try {
    const users = await User.find({ company: res.locals.company._id });
    const employees = await Employee.find({ company: res.locals.company._id });
  

    res.status(200).render("payments", {
      link: "payments",
      users: users,
      employees,
      subscriptions
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getUserDetailsPage = async (req, res, next) => {
  try {
    const singleUser = await User.findById(req.params.id);
    let smsTemplates=res.locals.company.smsTemplates.filter(item=>item.type==="general")
    const smsTemplatesReminder = res.locals.company.smsTemplates.filter(
      (item) => item.activeorNot === true && item.type === 'reminder'
    );
    res.status(200).render("user-details", {
      moment,
      singleUser,
      smsTemplatesReminder,
      smsTemplates,
      link: "users",
      smsTemplates
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getSingleEmployeePage = async (req, res, next) => {
  try {
    const singleUser = await Employee.findById(req.params.id);

    res.status(200).render("employee-details", {
      singleUser,

      link: "employees",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getEmployeeSelfPage = async (req, res, next) => {
  try {
    const singleUser = res.locals.employee;

    res.status(200).render("employee-self", {
      singleUser,
      link: "employees",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

export {
  getForgotPasswordPage,
  getEmployeeSelfPage,
  getSuperAdminPage,
  getSettingsPage,
  getAppointmentsStaticsPage,
  getEmployeessStaticsPage,
  getUsersStaticsPage,
  getPaymentStaticsPage,
  getPaymentsPage,
  getIndexPage,
  getLoginPage,
  getRegisterPage,
  getContactPage,
  getAdminPage,
  getServicesPage,
  getUsersPage,
  getAboutUsPage,
  getAppointmentsPage,
  getUserDetailsPage,
  getservicesPage,
  getEmployeesPage,
  resetPasswordPage,
  companyPaymentPage,
  getTermOfUsePage,
  returnPoliciesPage,
  privacyPoliciesPage,
  kvkkPage,
  getPricesPage,
  getSuperAdminTicketsPage,
  companyPaymentsListPage,
  getSingleEmployeePage,
  getDatasPage,
  deneme,
  
  getProductsPage,
  getAppointmentReportsPage,
  getUserReportsPage,
  getSmsPage,
  paymentReportsPage,
  getAllProductsPage,
  productReportsPage,
  getSmsReportsPage,
  getSantralPage,
};
