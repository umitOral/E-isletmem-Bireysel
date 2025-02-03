import User from "../models/userModel.js";
import moment from "moment";

import Employee from "../models/EmployeesModel.js";

import { COMPANY_DOCS, DOC_STATUS } from "../config/status_list.js";

import Company from "../models/companyModel.js";
import Product from "../models/productModel.js";
import { productGeneralSchema } from "../models/productGeneralModel.js";

import Subscription from "../models/subscriptionModel.js";
import { Ticket } from "../models/ticketModel.js";
import { CustomError } from "../helpers/error/CustomError.js";

import { APPOINTMENT_STATUS } from "../config/status_list.js";

import { getTenantDb } from "./db.js";
import { BRAND_LIST } from "../config/brands.js";

import Appointment from "../models/appointmentModel.js";
import CITIES from "../config/cities.js";


import CompanyPayment from "../models/companyPaymentModel.js";
import Blog from "../models/blogModel.js";
import COMPANY_TYPES from "../config/company_types.js";

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
      COMPANY_TYPES
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
const getOurServicesPage = (req, res, next) => {
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
const getBlogPage = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1; // URL'den sayfa numarasını al, yoksa 1
    let limit =3; // Sayfa başına gösterilecek blog sayısı

    const totalBlogs = await Blog.countDocuments(); // Toplam blog sayısı
    const blogs = await Blog.find()
      .sort({ createdAt: -1 }) // En yeni bloglar önce gelsin
      .skip((page - 1) * limit) // Sayfa başına veri kaydırma
      .limit(limit); // Limit kadar blog getir

    res.status(200).render("front/blog", {
      blogs,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit), // Toplam sayfa sayısı
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getSingleBlogPage = async (req, res, next) => {
  try {
    console.log(req.params);
    const singleBlog = await Blog.findOne({ title: req.params.blogName });
    console.log(singleBlog);
    res.status(200).render("front/blog-detail", {
      singleBlog,
      link: "prices",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getSSSPage = async (req, res, next) => {
  try {
    console.log("haho")
    res.status(200).render("front/sss", {
      link: "sss",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getservicesPage = async (req, res, next) => {
  try {
    let company = res.locals.company;

    let services = await company.services;
    //
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
    //pagination

    let limit = 10;

    let users = await User.find({
      company: res.locals.company._id,
      role: "customer",
    })
      .limit(limit)
      .sort({ updatedAt: -1 });

    const smsTemplates = res.locals.company.smsTemplates.filter(
      (item) => item.activeorNot === true && item.type === "general"
    );

    res.status(200).render("users", {
      users,
      smsTemplates,
      succes: true,
      link: "users",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getAppointmentReportsPage = async (req, res, next) => {
  try {
    //pagination

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

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let reports = await User.find(searchObject)

      .where("createdAt")
      .gt(startDate)
      .lt(endDate)
      .skip(startIndex)
      .limit(limit)
      .sort({ date: -1 });

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
      company: res.locals.company._id,
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
      APPOINTMENT_STATUS,
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
const companyPaymentPage = async (req, res, next) => {
  try {
    const company = res.locals.company;
    let activeSubscription = await Subscription.findOne({
      company: company._id,
      status: "active",
    });
    let waitingSubscriptions = await Subscription.find({
      company: company._id,
      status: "waiting",
    });
    let finishedSubscriptions = await Subscription.find({
      company: company._id,
      status: "finished",
    });

    res.status(200).render("companyPaymentPage", {
      link: "companyPaymentPage",
      company,
      moment,
      activeSubscription,
      waitingSubscriptions,
      finishedSubscriptions,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const companyPaymentsListPage = async (req, res, next) => {
  try {
    const companyPayments = await CompanyPayment.find({
      company: res.locals.company,
    });

    res.status(200).render("companyPaymentsList", {
      link: "companyPaymentsList",
      companyPayments,
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
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getUserDetailsPage = async (req, res, next) => {
  try {
    const singleUser = await User.findById(req.params.id);
    let smsTemplates = res.locals.company.smsTemplates.filter(
      (item) => item.type === "general"
    );
    const smsTemplatesReminder = res.locals.company.smsTemplates.filter(
      (item) => item.activeorNot === true && item.type === "reminder"
    );
    res.status(200).render("user-details", {
      moment,
      singleUser,
      smsTemplatesReminder,
      smsTemplates,
      link: "users",
      smsTemplates,
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
      moment,
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
      moment,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const getRandevuYonetimiPage = async (req, res, next) => {
  try {
    console.log("buraso");
    res.status(200).render("front/our-services-pages/randevu-yonetimi", {
      link: "Randevu Yönetimi",
      moment,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getSmsYonetimiPage = async (req, res, next) => {
  try {
    console.log("buraso");
    res.status(200).render("front/our-services-pages/sms-yonetimi", {
      link: "Sms Yönetimi",
      moment,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getHastaYonetimiPage = async (req, res, next) => {
  try {
    console.log("buraso");
    res.status(200).render("front/our-services-pages/hasta-yonetimi", {
      link: "Hasta Yönetimi",
      moment,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getPersonelYonetimiPage = async (req, res, next) => {
  try {
    console.log("buraso");
    res.status(200).render("front/our-services-pages/personel-yonetimi", {
      link: "Personel Yönetimi",
      moment,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getGelirGiderYonetimiPage = async (req, res, next) => {
  try {
    console.log("buraso");
    res.status(200).render("front/our-services-pages/gelir-gider-yonetimi", {
      link: "Gelir Gider Yönetimi",
      moment,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getUrunHizmetYonetimiPage = async (req, res, next) => {
  try {
    console.log("buraso");
    res.status(200).render("front/our-services-pages/urun-hizmet-yonetimi", {
      link: "Ürün-Hizmet Yönetimi",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getRaporYonetimiPage = async (req, res, next) => {
  try {
    console.log("buraso");
    res.status(200).render("front/our-services-pages/raporlama-yonetimi", {
      link: "Rapor Yönetimi",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

export {
  getRandevuYonetimiPage,
  getRaporYonetimiPage,
  getPersonelYonetimiPage,
  getGelirGiderYonetimiPage,
  getUrunHizmetYonetimiPage,
  getHastaYonetimiPage,
  getSmsYonetimiPage,
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
  getOurServicesPage,
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
  getBlogPage,
  getProductsPage,
  getAppointmentReportsPage,
  getUserReportsPage,
  getSmsPage,
  paymentReportsPage,
  getAllProductsPage,
  productReportsPage,
  getSmsReportsPage,
  getSantralPage,
  getSingleBlogPage,
  getSSSPage
};
