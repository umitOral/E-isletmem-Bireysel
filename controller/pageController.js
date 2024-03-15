import User from "../models/userModel.js";
import Employee from "../models/EmployeesModel.js";
import ROLES_LIST from "../config/roles_list.js";

import Sessions from "../models/sessionModel.js";
import Payment from "../models/paymentsModel.js";
import Company from "../models/companyModel.js";
import Subscription from "../models/subscriptionModel.js";
import { Ticket } from "../models/ticketModel.js";
import bcrypt from "bcrypt";
import { CustomError } from "../helpers/error/CustomError.js";

let now = new Date();
let day = now.getDate();
let month = now.getMonth();
let year = now.getFullYear();




const firstDate = new Date(year, month, day);
const secondDate = new Date(year, month, day);
secondDate.setHours(23,59,59,999)


const getIndexPage = (req, res) => {
  try {
    res.status(200).render("front/index", {
      link: "indexAdmin",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};
const resetPasswordPage = async (req, res) => {
  try {
    res.status(200).render("front/newPassword", {
      token: req.params.token,
      link: "newPassword",
      message: "success",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "sunucu hatası",
    });
  }
};
const getForgotPasswordPage = async (req, res, next) => {
  try {
    res.status(200).render("front/forgotPassword", {
      link: "forgotPassword",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};
const getSuperAdminPage = async (req, res) => {
  try {
    let companies = await Company.find({});
    

    res.status(200).render("superAdmin/superAdminMain", {
      companies,
      count: companies.length,
      link: "companies",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};
const getSuperAdminTicketsPage = async (req, res) => {
  try {
    let tickets = await Ticket.find({});
   

    res.status(200).render("superAdmin/superAdminTickets", {
      tickets,
      count: tickets.length,
      link: "companies",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};

const getLoginPage = (req, res) => {
  try {
    res.status(200).render("front/login", {
      link: "login",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};
const getAboutUsPage = (req, res) => {
  try {
    res.status(200).render("front/about-us", {
      link: "about-us",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};
const getTermOfUsePage = (req, res) => {
  try {
    res.status(200).render("front/term-of-use", {
      link: "about-us",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};
const getServicesPage = (req, res) => {
  try {
    res.status(200).render("front/our-services", {
      link: "about-us",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};
const returnPoliciesPage = (req, res) => {
  try {
    res.status(200).render("front/return-policies", {
      link: "return-policies",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};
const privacyPoliciesPage = (req, res) => {
  try {
    res.status(200).render("front/privacy-policies", {
      link: "privacy-policies",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};
const kvkkPage = (req, res) => {
  try {
    res.status(200).render("front/kvkk", {
      link: "kvkk",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};
const getPricesPage = (req, res) => {
  try {
    res.status(200).render("front/prices", {
      link: "prices",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};
const getservicesPage = async (req, res) => {
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

const getRegisterPage = (req, res) => {
  try {
    res.status(200).render("front/register", {
      link: "register",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};
const getContactPage = (req, res) => {
  try {
    res.status(200).render("front/contact-us", {
      link: "register",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "pagecontroller",
    });
  }
};
const getAdminPage = (req, res) => {
  try {
    res.status(200).render("indexAdmin", {
      link: "index",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};

const getUsersPage = async (req, res) => {
  try {
    let query = User.find({});
    if (req.query) {
      const searchObject = {};

      searchObject["company"] = res.locals.company._id;
      searchObject["role"] = "customer";
      query = query.where(searchObject);
    }

    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await User.count()
      .where("role")
      .equals("customer")
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
    const users = await query;

    res.status(200).render("users", {
      users,
      total,
      count: users.length,
      pagination,
      link: "users",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "error",
    });
  }
};
const getEmployeesPage = async (req, res) => {
  try {
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
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};

const getAppointmentsPage = async (req, res) => {
  try {
    let services = await Company.findById({ _id: res.locals.company._id });
    const activeServices = [];
    services.services.forEach((element) => {
      if (element.activeorNot === true) {
        activeServices.push(element);
      }
    });
    // sort({ registerDate: 1 })

    const users = await User.find({
      role: "customer",
      company: res.locals.company._id,
    });

    res.status(200).render("appointments", {
      link: "appointments",
      users,
      services: activeServices,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};

const getPaymentStaticsPage = async (req, res) => {
  try {
    res.status(200).render("statics/payments-statics.ejs", {
      link: "statics",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const getUsersStaticsPage = async (req, res) => {
  try {
    res.status(200).render("statics/users-statics.ejs", {
      link: "statics",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const getEmployeessStaticsPage = async (req, res) => {
  try {
    res.status(200).render("statics/employees-statics.ejs", {
      link: "statics",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const getAppointmentsStaticsPage = async (req, res) => {
  try {
    res.status(200).render("statics/appointments-statics.ejs", {
      link: "statics",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const getSettingsPage = (req, res) => {
  try {
    const company = res.locals.company;

    res.status(200).render("settings", {
      link: "settings",
      company,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const companyPaymentPage = (req, res) => {
  try {
    const user = res.locals.company;
    res.status(200).render("companyPaymentPage", {
      link: "companyPaymentPage",
      user,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};


const companyPaymentsListPage = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ company: res.locals.company });
    
    res.status(200).render("companyPaymentsList", {
      link: "companyPaymentsList",
      subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const getPaymentsPage = async (req, res) => {
  try {
    
    
    const users = await User.find({ company: res.locals.company._id });
    const payments = await Payment.find({
      company: res.locals.company._id,
      createdAt: {
        $gte: firstDate,
        $lte: secondDate,
      },
    }).populate("fromUser", ["name","surname"]);
    console.log(firstDate)
    console.log(secondDate)
    
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalCash = 0;
    let totalCreditCard = 0;
    let netCash = 0;

    payments.forEach((payment) => {
      if (payment.totalPrice > 0) {
        totalIncome += payment.totalPrice;
        if (payment.cashOrCard === "Nakit") {
          totalCash += payment.totalPrice;
        } else {
          totalCreditCard += payment.totalPrice;
        }
      } else {
        totalExpenses += payment.totalPrice;
      }
    });

    netCash = totalCash - (totalExpenses*-1);

    res.status(200).render("payments", {
      link: "payments",
      users: users,
      payments: payments,
      totalIncome,
      totalExpenses,
      totalCash,
      totalCreditCard,
      netCash,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const getUserPage = async (req, res) => {
  try {
    
    const singleUser = await User.findById(req.params.id);
    const payments = await Payment.find({ fromUser: req.params.id });
    const sessions = await Sessions.find({ user: req.params.id }).populate(
      ["operations","doctor"]
    );
      
    res.status(200).render("user-details", {
      singleUser,
      sessions,
      payments,
      link: "users",
    });
  } catch (error) {
    
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const getSingleEmployeePage = async (req, res) => {
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
    res.status(500).json({
      succes: false,
      message: error,
    });
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
};
