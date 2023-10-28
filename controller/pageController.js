import User from "../models/userModel.js";
import Service from "../models/serviceModel.js";
import Sessions from "../models/sessionModel.js";
import Payment from "../models/paymentsModel.js";
import Companies from "../models/companyModel.js";
import bcrypt from "bcrypt";
import { CustomError } from "../helpers/error/CustomError.js";

let now = new Date();
now.setHours(0, 0, 0, 0);
let day = now.getDate();
let month = now.getMonth();
let year = now.getFullYear();

const todayDate = new Date(year, month, day);
const tomorrowDate = new Date(year, month, day + 1);

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
      token:req.params.token,
      link: "newPassword",
      message: "success",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "api hatası",
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
    let companies = await Companies.find({});
    console.log("başarılı");

    res.status(200).render("superAdmin", {
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

const getLoginPage = (req, res) => {
  try {
    res.status(200).render("login", {
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
const getservicesPage = async (req, res) => {
  try {
    let query = Service.find({});

    if (req.query) {
      const searchObject = {};
      searchObject["company"] = res.locals.user._id;
      query = query.where(searchObject);
    }

    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await Service.count()
      .where("company")
      .equals(res.locals.user._id);
    const lastpage = Math.ceil(total / limit);
    const pagination = {};
    pagination["page"] = page;
    pagination["lastpage"] = lastpage;
    console.log(lastpage);

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
    const services = await query;

    res.status(200).render("services", {
      services,
      total,
      count: services.length,
      pagination,
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
    res.status(200).render("register", {
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

      searchObject["company"] = res.locals.user._id;
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
      .equals(res.locals.user._id);
    const lastpage = Math.ceil(total / limit);
    const pagination = {};
    pagination["page"] = page;
    pagination["lastpage"] = lastpage;
    console.log(lastpage);

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
const getPersonelsPage = async (req, res) => {
  try {
    let query = User.find({});
    if (req.query) {
      const searchObject = {};

      searchObject["company"] = res.locals.user._id;
      searchObject["role"] = "doctor";
      query = query.where(searchObject);
    }

    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await User.count()
      .where("role")
      .equals("doctor")
      .where("company")
      .equals(res.locals.user._id);
    const lastpage = Math.ceil(total / limit);
    const pagination = {};
    pagination["page"] = page;
    pagination["lastpage"] = lastpage;
    console.log(lastpage);

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

    res.status(200).render("personels", {
      pagination,
      total,
      count: users.length,
      users,
      link: "personels",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};

const getSessionsPage = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      company: res.locals.user._id,
      activeOrNot: true,
    });
    // sort({ registerDate: 1 })

    const users = await User.find({ role: "customer" });
    const sessions = await Sessions.find({})
      .sort({ time: 1 })
      .populate(["user", "doctor"]);
    const services = await Service.find({ activeorNot: { $ne: false } });

    res.status(200).render("sessions", {
      link: "sessions",
      doctors,
      users,
      sessions,
      services,
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
      link: "user-statics",
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
      link: "payments-statics",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const getPersonelsStaticsPage = async (req, res) => {
  try {
    res.status(200).render("statics/personels-statics.ejs", {
      link: "personels-statics",
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
      link: "appointments-statics",
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
    
    const user = res.locals.user;
    res.status(200).render("settings", {
      link: "settings",
      user,
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
    // console.log(now.toLocaleString())
    // console.log(todayDate.toLocaleString())
    // console.log(tomorrowDate.toLocaleString())

    const users = await User.find({ company: res.locals.user._id });
    const payments = await Payment.find({
      company: res.locals.user._id,
      createdAt: {
        $gte: todayDate,
        $lte: tomorrowDate,
      },
    }).populate("fromUser", "name");
    // console.log(payments)

    let totalIncome = 0;
    let totalExpenses = 0;
    let totalCash = 0;
    let totalCreditCard = 0;
    let netCash = 0;

    payments.forEach((payment) => {
      if (payment.value > 0) {
        totalIncome += payment.value;
        if (payment.cashOrCard === "Nakit") {
          totalCash += payment.value;
        } else {
          totalCreditCard += payment.value;
        }
      } else {
        totalExpenses += payment.value;
      }
    });

    netCash = totalCash - -totalExpenses;

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
const getSinglePage = async (req, res) => {
  try {
    const singleUser = await User.findById(req.params.id);
    const payments = await Payment.find({fromUser:req.params.id});
    const sessions = await Sessions.find({}).populate(["doctor"])

    
    
    res.status(200).render("user-details", {
      singleUser,
      sessions,
      payments,
      link: "user_details",
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
  getPersonelsStaticsPage,
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
  getSessionsPage,
  getSinglePage,
  getservicesPage,
  getPersonelsPage,
  resetPasswordPage,
};
