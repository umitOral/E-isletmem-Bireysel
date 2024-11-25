import User from "../models/userModel.js";
import Employee from "../models/EmployeesModel.js";
import Sessions from "../models/appointmentModel.js";
import Payment from "../models/paymentsModel.js";
import { CustomError } from "../helpers/error/CustomError.js";
import { APPOINTMENT_STATUS } from "../config/status_list.js";
import { role_privileges } from "../config/role_priveleges.js";
import { NOTIFICATIONS } from "../config/notifications.js";
import { sendEmployeeRegisterMail, sendRegisterMail } from "./mailControllers.js";

const createEmployees = async (req, res, next) => {
  try {
    const userEmail = req.body.email;
    req.body.company = res.locals.company;
    if (req.body.email !== "") {
      console.log("burası");
      const searchEmail = await Employee.findOne({
        email: userEmail,
        company: res.locals.company,
      });
      if (searchEmail) {
        res.json({
          success: false,
          message: "bu mail adresi kullanılmaktadır.",
        });
      } else {
        await Employee.create(req.body);
        sendEmployeeRegisterMail(userEmail,{email:userEmail,password:req.body.password})
        res.json({
          success: true,
          message: "Kulllanıcı başarıyla kaydedildi.",
        });
      }
    }

    // await Company.updateOne(
    //   { _id: res.locals.company._id },
    //   {
    //     $push: {
    //       employees: employee,
    //     },
    //   }
    // );
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "bir sorunla karşılaşıldı. Tekrar deneyin",
    });
  }
};
const editInformationsEmployees = async (req, res) => {
  try {
    console.log("hahı");
    console.log(req.body);
    if (req.body.workHours) {
      req.body.workHours = {
        workStart: req.body.workHours[0],
        workEnd: req.body.workHours[1],
      };
    }
    
    await Employee.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "kullanıcı bilgileri başarıyla değiştirildi.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
const getEmployesAppointments = async (req, res, next) => {
  console.log(req.params);
  try {
    const appointments = await Sessions.find({ doctor: req.params.employeesID })
      .populate("user", ["name", "surname"])
      .populate("operations.operation");
    console.log(appointments);

    res.status(200).json({
      appointments,
      APPOINTMENT_STATUS: Object.values(APPOINTMENT_STATUS),
      link: "employees",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getEmployeePermissions = async (req, res, next) => {
  try {
    let employee =await Employee.findById(req.params.id)
    let employeePermissions =employee.permissions;
    let allPermissions = role_privileges;

    res.status(200).json({
      success: true,
      data: { employeePermissions, allPermissions },
      link: "employees",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const updateEmployeeNotifications = async (req, res, next) => {
  console.log(req.body);
  try {
    let employee = await Employee.findById(req.params.id);
    if (employee.notifications.includes(req.body.notificationkey)) {
      employee.notifications = employee.notifications.filter(
        (x) => x !== req.body.notificationkey
      );
    } else {
      employee.notifications.push(req.body.notificationkey);
    }
    

    await employee.save();
    res.status(200).json({
      success: true,
      message: "izin değiştirildi",
      data: req.body.notificationkey,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const getEmployeeNotifications = async (req, res, next) => {
  try {
    let employee=await Employee.findById(req.params.id)
    let userNotifications = employee.notifications || {};
    let allNotifications = NOTIFICATIONS;

    res.status(200).json({
      success: true,
      data: { userNotifications, allNotifications },
      link: "employees",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getEmployeesPayments = async (req, res, next) => {
  try {
    let payments = await Payment.find({
      comissionEmployee: req.params.id,
      products: { $exists: true, $not: { $size: 0 } }
    });

    res.status(200).json({
      success: true,
      data: payments,
      link: "employees",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const updateEmployeesPermissions = async (req, res, next) => {
  console.log(req.body);
  try {
    let employee = await Employee.findById(req.params.id);
    if (employee.permissions.includes(req.body.permissionkey)) {
      employee.permissions = employee.permissions.filter(
        (x) => x !== req.body.permissionkey
      );
    } else {
      employee.permissions.push(req.body.permissionkey);
    }

    console.log(employee.permissions);
    await employee.save();
    res.status(200).json({
      success: true,
      message: "izin değiştirildi",
      data: req.body.permissionkey,
      link: "employees",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

export {
  createEmployees,
  editInformationsEmployees,
  getEmployesAppointments,
  getEmployeePermissions,
  updateEmployeesPermissions,
  getEmployeesPayments,
  getEmployeeNotifications,
  updateEmployeeNotifications
};
