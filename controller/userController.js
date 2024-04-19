import User from "../models/userModel.js";
import Company from "../models/companyModel.js";
import Operation from "../models/OperationsModel.js";
import Employee from "../models/EmployeesModel.js";
import Payment from "../models/paymentsModel.js";
import Session from "../models/sessionModel.js";
import { passwordResetMail } from "../controller/mailControllers.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CustomError } from "../helpers/error/CustomError.js";
import {
  APPOINTMENT_STATUS,
  SERVICES_LIST,
  OPERATION_STATUS_AUTOMATIC,
} from "../config/status_list.js";
import Subscription from "../models/subscriptionModel.js";
import { response } from "express";

const createCompany = async (req, res, next) => {
  try {
    const data = req.body;
    const newDate = new Date();
    req.body.subscribeEndDate = new Date(
      newDate.setMonth(newDate.getMonth() + 1)
    ).toISOString();

    req.body.serviceDatas = [
      {
        dataName: "saç yapısı",
        dataOptions: ["kuru", "karma", "normal"],
      },
    ];

    const processes = SERVICES_LIST;

    req.body.services = [];

    processes.forEach((process) => {
      req.body.services.push({
        serviceName: process,
        servicePrice: 99,
        activeorNot: false,
      });
    });

    if (data.password !== data.password2) {
      return next(new CustomError("Girdiğiniz şifreler farklıdır", 400));
    }

    const company = await Company.create(data);
    data.role = "yönetici";
    data.company = company._id;

    await Employee.create(data);
    let subscriptionData = {
      company: company._id,
      amount: 0,
      paymentDuration: 30,
      paymentTransactionId: 0,
    };
    await Subscription.create(subscriptionData);
    next();
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const deactivateEmployee = async (req, res, next) => {
  try {
    console.log("başarılı");

    await Employee.findByIdAndUpdate(req.params.id, { activeOrNot: false });
    res.redirect("back");
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const activateEmployee = async (req, res, next) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, { activeOrNot: true });
    res.redirect("back");
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const getUsersAllSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ user: req.params.id }).populate([
      "doctor",
      "operations",
    ]);

    res.status(200).json({
      succes: true,
      sessions: sessions,
      APPOINTMENT_STATUS,
      message: "seanslar başarıyla çekildi",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const findUsers = async (req, res, next) => {
  try {
    //search
    let query = User.find();
    if (req.query) {
      const searchObject = {};
      const regex = new RegExp(req.query.user, "i");
      searchObject["name"] = regex;
      searchObject["company"] = res.locals.company._id;
      searchObject["role"] = "customer";

      // searchObject["title"] = regex
      query = query.where(searchObject);
    }

    //pagination
    // 1 2 3 4 5..6 7 8

    const page = parseInt(req.query.page) || 1;
    const limit = 3;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await User.count()
      .where("role")
      .equals("customer")
      .where("company")
      .equals(res.locals.company._id);
    const lastpage = Math.round(total / limit);
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

    const data = await query;

    res.status(200).render("search-results", {
      header: "hastalar",
      data,
      total,
      count: data.length,
      pagination: pagination,
      link: "users",
      defaultSearchValue: req.query.user,
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const findSingleUser = async (req, res,next) => {
  try {
    //search

    console.log(req.query);
    let query = User.find();

    if (req.query) {
      const searchObject = {};
      const regex = new RegExp(req.query.userName, "i");
      searchObject["name"] = regex;
      searchObject["company"] = res.locals.company._id;
      searchObject["role"] = "customer";

      // searchObject["title"] = regex
      query = query.where(searchObject);
    }

    const data = await query;

    res.status(200).json({
      message: "hasta çekildi",
      data: data,
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const findEmployees = async (req, res,next) => {
  try {
    //search
    let query = User.find();
    if (req.query) {
      const searchObject = {};
      const regex = new RegExp(req.query.user, "i");
      searchObject["name"] = regex;
      searchObject["company"] = res.locals.company._id;
      searchObject["role"] = "doctor";

      // searchObject["title"] = regex
      query = query.where(searchObject);
    }

    //pagination
    // 1 2 3 4 5..6 7 8

    const page = parseInt(req.query.page) || 1;
    const limit = 3;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await User.count()
      .where("role")
      .equals("doctor")
      .where("company")
      .equals(res.locals.company._id);
    const lastpage = Math.round(total / limit);
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

    const data = await query;

    res.status(200).render("search-results", {
      header: "Çalışanlar",
      data,
      total,
      count: data.length,
      pagination: pagination,
      link: "users",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const createUser = async (req, res, next) => {
  try {
    const userEmail = req.body.email;
    req.body.company = res.locals.company;

    const searchEmail = await User.findOne({ email: userEmail });

    if (searchEmail && !searchEmail === "") {
      return next(
        new CustomError(
          "Bu mail adresi ile kayıtlı kullanıcı bulunmaktadır",
          400
        )
      );
    } else {
      await User.create(req.body).then((response) => {
        jwt.verify(
          req.cookies.userData,
          process.env.JWT_SECRET,
          async (err, decodedToken) => {
            if (err) {
              console.log(err);
            }

            decodedToken.usersNames.push({
              _id: response._id,
              name: response.name,
              surname: response.surname,
            });
            console.log(decodedToken);
            const updatedToken = createTokenSingleData(decodedToken.usersNames);
            res.cookie("userData", updatedToken, {
              httpOnly: true,
              maxAge: 1000 * 60 * 60 * 24,
            });

            res.json({
              success: true,
              data: {
                _id: response._id,
                name: response.name,
                surname: response.surname,
              },
              message: "Kulllanıcı başarıyla kaydedildi.",
            });
          }
        );
      });
    }
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const editInformations = async (req, res,next) => {
  try {
    console.log(req.body);
    await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      address: req.body.address,
      sex: req.body.sex,
      birtdhDate: req.body.birtdhDate,
      phone: req.body.phone,
      company: req.body.company,
      billingAddress: req.body.billingAddress,
      notes: req.body.notes,
      userCompany: req.body.userCompany,
    });
    res.redirect("back");
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const loginUser = async (req, res, next) => {
  try {
    let same = false;
   
    const employee = await Employee.findOne({ email: req.body.email });

    if (employee) {
      const company = await Company.findOne({ _id: employee.company });
      same = await bcrypt.compare(req.body.password, employee.password);

      if (same) {
        const token = createToken(company._id, employee._id);

        const usersNames = await User.find(
          { role: "customer", company: company },
          { name: true, surname: true }
        );

        const token2 = createTokenSingleData(usersNames);

        res.cookie("jsonwebtoken", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
        });
        res.cookie("userData", token2, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
        });

        let today = new Date();
        let endDate = new Date(company.subscribeEndDate);
        let diffTime = endDate - today;
        console.log(diffTime);
        if (diffTime < 0) {
          res.cookie("companySubscribe", false, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
          });
        } else {
          res.cookie("companySubscribe", true, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
          });
        }

        res.status(401).json({
          success: true,
          message: "Giriş Başarılı,yönlendiriliyorsunuz",
        });
      } else {
        return next(new CustomError("Kullanıcı adı veya şifresi yanlış", 400));
      }
    } else {
      return next(new CustomError("Kayıtlı kullanıcı bulunamadı", 400));
    }
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const uploadPictures = async (req, res, next) => {
  try {
    console.log(req.body);
    const cloudinaryImageUploadMethod = async (file) => {
      const result = await cloudinary.uploader.upload(file, {
        use_filename: true,
        folder: "archimet",
      });

      return { secure_url: result.secure_url, public_id: result.public_id };
    };

    const files = req.files.upload_file;

    if (files.length === undefined) {
      console.log("tek resim");
      const path = files.tempFilePath;
      const data = await cloudinaryImageUploadMethod(path);

      await Operation.updateOne(
        { _id: req.body.operationID },
        {
          $push: {
            images: {
              url: data.secure_url,
              uploadTime: req.body.uploadTime,
              public_id: data.public_id,
            },
          },
        }
      );

      fs.unlinkSync(files.tempFilePath);
    }

    if (files.length > 0) {
      console.log("ÇOKLU RESİM");

      for (const file of files) {
        const path = file.tempFilePath;
        const data = await cloudinaryImageUploadMethod(path);
        await Operation.updateOne(
          { _id: req.body.operationID },
          {
            $push: {
              images: {
                url: data.secure_url,
                uploadTime: req.body.uploadTime,
                public_id: data.public_id,
              },
            },
          }
        );

        fs.unlinkSync(file.tempFilePath);
      }
    }

    res.json({
      succes: true,
      message: "resim başarıyla eklendi",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const addDataToOperation = async (req, res, next) => {
  try {
    console.log("addd data operaiton");
    console.log(req.body);
    console.log(req.params);

    let responseData = await Operation.findOneAndUpdate(
      { _id: req.params.operationID },

      {
        $push: {
          operationData: {
            dataName: req.body.dataName,
            data: req.body.data,
          },
        },
      },

      {
        returnOriginal: false,
      }
    );

    res.json({
      succes: true,
      responseData,
      message: "veri başarıyla eklendi",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const addOperation = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.params);

    req.body.selectedOperations.forEach((element) => {
      element.company = res.locals.company;
      element.operationStatus = OPERATION_STATUS_AUTOMATIC.WAITING;
      element.user = req.params.id;

      if (req.body.discount !== 0) {
        element.discount = req.body.discount;
      }
    });

    await Operation.insertMany(req.body.selectedOperations);

    res.json({
      succes: true,
      message: "işlem başarıyla eklendi",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const addDiscountToOperation = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.params);

    await Operation.findByIdAndUpdate(req.params.operationID, {
      $set: { discount: req.body.discount },
    });

    res.json({
      succes: true,
      message: "işlem başarıyla eklendi",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const addOperationInsideAppointment = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.params);

    req.body.selectedOperations.forEach((element) => {
      element.company = res.locals.company;
      element.user = req.params.id;
      element.operationStatus = OPERATION_STATUS_AUTOMATIC.PLANNED;
      element.sessionOfOperation = [
        {
          sessionID: req.body.appointment,
        },
      ];
      element.percentDiscount = req.body.percentDiscount;
      element.discount = element.operationDiscount;
    });

    const results = await Operation.insertMany(req.body.selectedOperations);

    for (const iterator of results) {
      await Session.findByIdAndUpdate(req.body.appointment, {
        $push: { operations: iterator._id },
      });
    }

    res.json({
      succes: true,
      responseData: results,
      message: "işlem başarıyla eklendi",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const deleteOperation = async (req, res, next) => {
  try {
    console.log("delete operation");
    let operation = await Operation.findById(req.params.operationId).then(
      (response) => {
        if (response.sessionOfOperation.length !== 0) {
          res.status(200).json({
            succes: true,
            message: "işleme ait seanslar bulunmaktadır.Silinemez",
          });
        } else if (response.payments.length !== 0) {
          res.status(200).json({
            succes: true,
            message: "işleme ait ödemeler bulunmaktadır.Silinemez",
          });
        } else {
          res.status(200).json({
            succes: true,
            message: "işlem başarıyla silindi.",
          });
        }
      }
    );

    // let operation = await Operation.findById(req.params.operationId).populate(
    //   "appointments"
    // );
    // console.log(operation)
    // let appointmentsDates = operation.appointments.map((item) =>
    //   item.date.setTime(item.startHour)
    // );
    // let date = new Date();
    // let diffTime = [];

    // console.log(appointmentsDates);
    // appointmentsDates.forEach(async (element) => {
    //   diffTime.push(date - element);
    // });

    // let result = diffTime.findIndex((item) => item > 0);
    // console.log(result);
    // if (result !== -1) {
    //   res.status(200).json({
    //     succes: false,
    //     message: "İşleme ait geçmiş Randevular olduğundan İşlem Silinemez.",
    //   });
    // } else if (operation.payments.length !== 0) {
    //   res.status(200).json({
    //     succes: false,
    //     message: "İşleme ait geçmiş Ödemeler olduğundan İşlem Silinemez.",
    //   });
    // } else {
    //   await Session.deleteMany({ _id: { $in: operation.appointments } });
    //   await Operation.findByIdAndDelete(req.params.operationId)
    //     .then((response) => {
    //       console.log("işlem silindi");
    //       if (response.images.length !== 0) {
    //         console.log("resimvar");
    //         response.images.forEach(async (element) => {
    //           await cloudinary.uploader.destroy(
    //             element.public_id,
    //             function (error, result) {
    //               if (error) {
    //                 console.log(error);
    //               } else {
    //                 console.log(result);
    //               }
    //             }
    //           );
    //         });
    //         res.status(200).json({
    //           succes: true,
    //           message: "işlem başarıyla Silindi",
    //         });
    //       } else {
    //         res.status(200).json({
    //           succes: true,
    //           message: "işlem başarıyla Silindi",
    //         });
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       res.status(500).json({
    //         succes: false,
    //         message: "işlem Silinirken bir Sorun oluştu tekrar deneyiniz.",
    //       });
    //     });
    // }
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const deletePhoto = async (req, res, next) => {
  console.log(req.params);
  try {
    //TODO
    // resim silmeye çalışan müşteri kendisi mi kontrol ediecek  @@SECURITY

    cloudinary.uploader.destroy(
      "archimet/" + req.params.public_id,
      function (error, result) {
        if (error) {
          console.log(error);
        }
      }
    );

    Operation.updateOne(
      { _id: req.params.operationid },
      {
        $pull: {
          images: { _id: req.params.photoid },
        },
      }
    )
      .then((response) =>
        res.json({ success: true, message: "resim başarıyla silindi" })
      )
      .catch((err) =>
        res.json({
          success: false,
          message: "resim silinirken bir sorun oluştu.",
        })
      );
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const getUsersPlannedOperations = async (req, res, next) => {
  try {
    console.log(req.body);
    const operations = await Operation.find({ _id: { $in: req.body } });

    res.json({
      success: true,
      message: "işlemler çekildi",
      operations,
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const getUsersContinueOperations = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.params);

    const operations = await Operation.find({
      user: req.params.id,
      operationStatus: {
        $in: [
          OPERATION_STATUS_AUTOMATIC.WAITING,
          OPERATION_STATUS_AUTOMATIC.CONTINUE,
        ],
      },
    });

    res.json({
      success: true,
      message: "işlemler çekildi",
      operations,
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const getUsersHasPaymentOperations = async (req, res, next) => {
  try {
    const operations = await Operation.find({
      user: req.params.id,
      paymentStatus: "ödenmedi",
    });

    res.json({
      success: true,
      message: "ödenmeyen işlemler çekildi",
      operations,
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const getUsersOldOperations = async (req, res, next) => {
  try {
    const operations = await Operation.find({
      user: req.params.id,
    });

    res.json({ success: true, message: "işlemler çekildi", data: operations });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const getUsersAllOperations = async (req, res, next) => {
  try {
    const operations = await Operation.find({
      user: req.params.id,
    });

    res.json({ success: true, message: "işlemler çekildi", data: operations });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const getAllPhotos = async (req, res, next) => {
  try {
    console.log(req.params);

    const operation = await Operation.findById(req.params.operationId);

    const photos = operation.images.sort(compare);
    function compare(a, b) {
      if (a.uploadTime > b.uploadTime) {
        return 1;
      }
      if (a.uploadTime < b.uploadTime) {
        return -1;
      }
      return 0;
    }
    console.log(photos);

    res.json({ success: true, message: "resimler çekildi", photos });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const getUsersAllPayments = async (req, res, next) => {
  try {
    console.log(req.params);

    const payments = await Payment.find({ fromUser: req.params.id });
    if (payments.length === 0) {
      res.json({ success: true, message: "ödeme bulunamadı", data: payments });
    } else {
      res.json({ success: true, message: "ödemeler çekildi", data: payments });
    }
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const logOut = (req, res, next) => {
  try {
    res.cookie("jsonwebtoken", "", {
      maxAge: 1,
    });
    res.cookie("userData", "", {
      maxAge: 1,
    });
    res.cookie("companySubscribe", "", {
      maxAge: 1,
    });
    res.redirect("/");
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const resetPasswordMail = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ email: req.body.email });

    if (!employee) {
      next(new CustomError("Kayıtlı kullanıcı Bulunamadı", 400));
    } else {
      const email = req.body.email;

      const resetToken = employee.createResetPasswordToken(email);

      await employee.save();
      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/newPassword/${resetToken}`;
      passwordResetMail(email, resetUrl);

      res.status(200).json({
        succes: true,
        message: "şifre sıfırlama maili gönderildi.",
      });
    }
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const createToken = (companyID, employeeID) => {
  return jwt.sign({ companyID, employeeID }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const createTokenSingleData = (usersNames) => {
  return jwt.sign({ usersNames: usersNames }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export {
  resetPasswordMail,
  createCompany,
  createUser,
  loginUser,
  logOut,
  uploadPictures,
  editInformations,
  findUsers,
  findSingleUser,
  deactivateEmployee,
  findEmployees,
  activateEmployee,
  deletePhoto,
  deleteOperation,
  getAllPhotos,
  addOperation,
  getUsersAllOperations,
  getUsersPlannedOperations,
  getUsersContinueOperations,
  getUsersHasPaymentOperations,
  getUsersAllPayments,
  addOperationInsideAppointment,
  addDataToOperation,
  addDiscountToOperation,
  getUsersOldOperations,
  getUsersAllSessions,
};
