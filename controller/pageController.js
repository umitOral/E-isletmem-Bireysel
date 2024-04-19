import User from "../models/userModel.js";
import Employee from "../models/EmployeesModel.js";
import { ROLES_LIST } from "../config/status_list.js";

import Sessions from "../models/sessionModel.js";
import Payment from "../models/paymentsModel.js";
import Company from "../models/companyModel.js";
import Subscription from "../models/subscriptionModel.js";
import { Ticket } from "../models/ticketModel.js";
import { ErrorLogger } from "../helpers/logger/logger.js";

import bcrypt from "bcrypt";
import { CustomError } from "../helpers/error/CustomError.js";

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

const resetPasswordPage = async (req, res,next) => {
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
const getSuperAdminPage = async (req, res,next) => {
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
const getSuperAdminTicketsPage = async (req, res,next) => {
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

const getLoginPage = (req, res,next) => {
  try {
    res.status(200).render("front/login", {
      link: "login",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getAboutUsPage = (req, res,next) => {
  try {
    res.status(200).render("front/about-us", {
      link: "about-us",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getTermOfUsePage = (req, res,next) => {
  try {
    res.status(200).render("front/term-of-use", {
      link: "about-us",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getServicesPage = (req, res,next) => {
  try {
    res.status(200).render("front/our-services", {
      link: "about-us",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const returnPoliciesPage = (req, res,next) => {
  try {
    res.status(200).render("front/return-policies", {
      link: "return-policies",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const privacyPoliciesPage = (req, res,next) => {
  try {
    res.status(200).render("front/privacy-policies", {
      link: "privacy-policies",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const kvkkPage = (req, res,next) => {
  try {
    res.status(200).render("front/kvkk", {
      link: "kvkk",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getPricesPage = (req, res,next) => {
  try {
    res.status(200).render("front/prices", {
      link: "prices",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getservicesPage = async (req, res,next) => {
  try {
    let company = res.locals.company;

    const services = await company.services;

    res.status(200).render("services", {
      services,

      link: "services",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};
const getDatasPage = async (req, res,next) => {
  try {
    res.status(200).render("datasPage", {
      link: "services",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const getRegisterPage = (req, res,next) => {
  try {
    res.status(200).render("front/register", {
      link: "register",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getContactPage = (req, res,next) => {
  try {
    res.status(200).render("front/contact-us", {
      link: "register",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getAdminPage = async (req, res,next) => {
  try {
    res.status(200).render("indexAdmin", {
      link: "index",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const getUsersPage = async (req, res, next) => {
  try {
    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.page) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let users = await User.find({
      company: res.locals.company._id,
      role: "customer",
    })
      .skip(startIndex)
      .limit(limit)
      .sort({ updatedAt: -1 });

    let total = await User.count({
      company: res.locals.company._id,
      role: "customer",
    });

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

    res.status(200).render("users", {
      users,
      total,
      count: users.length,
      pagination,
      link: "users",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const deneme = async (req, res, next) => {
  try {
    console.log(mmm);
    res.status(200).json({
      succes: true,
      message: "başarılı",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getEmployeesPage = async (req, res, next) => {
  try {
    console.log(mmm);
    let query = Employee.find({});
    let roles = Object.keys(ROLES_LIST);
    let rolesValues = Object.values(ROLES_LIST);
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
      roles: roles,
      rolesValues,
      link: "employees",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const getAppointmentsPage = async (req, res, next) => {
  try {
    console.log(mmm);
    let services = await Company.findById({ _id: res.locals.company._id });
    const activeServices = [];
    services.services.forEach((element) => {
      if (element.activeorNot === true) {
        activeServices.push(element);
      }
    });
    // sort({ registerDate: 1 })

    res.status(200).render("appointments", {
      link: "appointments",

      services: activeServices,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const getPaymentStaticsPage = async (req, res,next) => {
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

    res.status(200).render("settings", {
      link: "settings",
      company,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const companyPaymentPage = (req, res, next) => {
  try {
    const user = res.locals.company;
    res.status(200).render("companyPaymentPage", {
      link: "companyPaymentPage",
      user,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const companyPaymentsListPage = async (req, res,next) => {
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
const getPaymentsPage = async (req, res,next) => {
  try {
    const users = await User.find({ company: res.locals.company._id });

    res.status(200).render("payments", {
      link: "payments",
      users: users,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getUserPage = async (req, res, next) => {
  try {
    const singleUser = await User.findById(req.params.id);

    res.status(200).render("user-details", {
      singleUser,
      link: "users",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getSingleEmployeePage = async (req, res, next) => {
  try {
    const singleUser = await Employee.findById(req.params.id);
    const roles = Object.keys(ROLES_LIST);
    let rolesValue = [];

    for (const key in ROLES_LIST) {
      if (Object.hasOwnProperty.call(ROLES_LIST, key)) {
        const element = ROLES_LIST[key];
        rolesValue.push(element);
      }
    }

    const sessions = await Sessions.find({ doctor: req.params.id }).populate([
      "user",
    ]);

    res.status(200).render("employee-details", {
      singleUser,
      sessions,
      roles: roles,
      rolesValue,
      link: "employees",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

export {
  getForgotPasswordPage,
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
  getUserPage,
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
};
