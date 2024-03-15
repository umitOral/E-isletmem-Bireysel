import User from "../models/userModel.js";
import Company from "../models/companyModel.js";
import Operation from "../models/OperationsModel.js";
import Employee from "../models/EmployeesModel.js";
import Payment from "../models/paymentsModel.js";
import ORDER_STATUS_LIST from "../config/order_status_list.js";
import { passwordResetMail } from "../controller/mailControllers.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CustomError } from "../helpers/error/CustomError.js";
import SERVICES_LIST from "../config/services_list.js";
import Subscription from "../models/subscriptionModel.js";

const createCompany = async (req, res, next) => {
  try {
    console.log("burasıx");
    const data = req.body;
    const newDate = new Date();
    req.body.subscribeEndDate = new Date(
      newDate.setMonth(newDate.getMonth() + 1)
    ).toISOString();

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
      return next(new Error("Girdiğiniz şifreler farklıdır", 400));
    }
    console.log(data);
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
    return next(error);
  }
};

const deactivateEmployee = async (req, res) => {
  try {
    console.log("başarılı");

    await Employee.findByIdAndUpdate(req.params.id, { activeOrNot: false });
    res.redirect("back");
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "usercontroller delete error",
    });
  }
};
const activateEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, { activeOrNot: true });
    res.redirect("back");
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "usercontroller activate error",
    });
  }
};
const findUser = async (req, res) => {
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
    res.status(500).json({
      succes: false,
      message: "usercontroller error",
    });
  }
};
const findEmployees = async (req, res) => {
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
    res.status(500).json({
      succes: false,
      message: "usercontroller error",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const userEmail = req.body.email;
    req.body.company = res.locals.company;
    const searchEmail = await User.findOne({ email: userEmail });
    console.log(userEmail);
    if (searchEmail && !searchEmail === "") {
      res.json({
        success: false,
        message: "bu mail adresi kullanılmaktadır.",
      });
    } else {
      await User.create(req.body);
      res.json({
        success: true,
        message: "Kulllanıcı başarıyla kaydedildi.",
      });
    }
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "bir sorunla karşılaşıldı. Tekrar deneyin",
    });
  }
};
const editInformations = async (req, res) => {
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
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    let same = false;

    const employee = await Employee.findOne({ email: req.body.email });

    if (employee) {
      const company = await Company.findOne({ _id: employee.company });
      same = await bcrypt.compare(req.body.password, employee.password);
      console.log(company);
      if (same) {
        const token = createToken(company._id, employee._id);
        res.cookie("jsonwebtoken", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
        });

        res.status(401).json({
          success: true,
          message: "Giriş Başarılı,yönlendiriliyorsunuz ...",
        });
      } else {
        return next(new Error("Kullanıcı adı veya şifresi yanlış", 400));
      }
    } else {
      return next(new Error("Kayıtlı kullanıcı bulunamadı", 400));
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Girişte sistemsel bir hata oluştu.",
    });
  }
};

const uploadPictures = async (req, res) => {
  try {
    console.log("burası");
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
    console.log(error);
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const addDataToOperation = async (req, res) => {
  try {
    console.log("addd data");
    console.log(req.body);

    await Operation.updateOne(
      { _id: req.params.operationId },
      {
        $push: {
          operationData: {
            dataName: req.body.dataName,
            data: req.body.data,
          },
        },
      }
    ).then(response=>{
      res.json({
        succes: true,
        message: "resim başarıyla eklendi",
      });
    })

    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const addOperation = async (req, res) => {
  try {
    
    console.log(req.body);

    req.body.company = res.locals.company;
    req.body.user = req.params.id;
    req.body.doctor = {};

    req.body.operationName = req.body.selectedValues.productName;
    req.body.operationPrice = req.body.selectedValues.productPrice;

    if (req.body.selectedValues.serviceDataName) {
      req.body.operationData = {
        dataName: req.body.selectedValues.serviceDataName,
        data: req.body.selectedValues.serviceDataValue,
      };
    }
    
    if (req.body.selectedValues.productPrice===0) {
      req.body.paymentStatus ="ödendi"
    }
    

    // req.body.price=req.body.products.map(element=>element.productPrice).reduce((a,b)=>a+b)

    await Operation.create(req.body);

    res.json({
      succes: true,
      message: "işlem başarıyla eklendi",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: "işlem eklenirken bir hata oluştu.",
    });
  }
};
const deleteOperation = async (req, res) => {
  try {
    console.log("delete operation");
    console.log(req.params);

    await Operation.findByIdAndDelete(req.params.operationId)
      .then((response) => {
        response.images.forEach(async (element) => {
          await cloudinary.uploader.destroy(
            element.public_id,
            function (error, result) {
              if (error) {
                console.log(error);
              } else {
                console.log(result);
                res.json({
                  succes: true,
                  message: "işlem başarıyla Silindi",
                });
              }
            }
          );
        });
      })
      .catch((err) => {
        res.json({
          succes: true,
          message: "işlem Silinirken bir Sorun oluştu tekrar deneyiniz.",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: "işlem eklenirken bir hata oluştu.",
    });
  }
};

const deletePhoto = async (req, res) => {
  console.log("burası");
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
    res.status(500).json({
      succes: false,
      message: "delete photo error",
    });
  }
};
const getUsersOpenOperations = async (req, res) => {
  try {
    const operations = await Operation.find({
      user: req.params.id,
      operationAppointmentStatus: "açık",
    });

    res.json({ success: true, message: "işlemler çekildi", operations });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "resimler çekilirken bir hata oluştu",
    });
  }
};
const getUsersHasPaymentOperations = async (req, res) => {
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
    res.status(500).json({
      succes: false,
      message: "resimler çekilirken bir hata oluştu",
    });
  }
};
const getUsersAllOperations = async (req, res) => {
  try {
    console.log("burası");
    const operations = await Operation.find({
      user: req.params.id,
    });

    res.json({ success: true, message: "işlemler çekildi", data: operations });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "resimler çekilirken bir hata oluştu",
    });
  }
};
const getAllPhotos = async (req, res) => {
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
    res.status(500).json({
      succes: false,
      message: "resimler çekilirken bir hata oluştu",
    });
  }
};
const getUsersAllPayments = async (req, res) => {
  try {
    console.log(req.params);

    const payments = await Payment.find({fromUser:req.params.id});

    
    res.json({ success: true, message: "ödemeler çekildi", data:payments });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "Ödemeler çekilirken bir hata oluştu",
    });
  }
};

const logOut = (req, res) => {
  try {
    res.cookie("jsonwebtoken", "", {
      maxAge: 1,
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
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
      console.log(resetUrl);
      res.status(200).json({
        succes: true,
        message: "şifre sıfırlama maili gönderildi.",
      });
    }
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};

const createToken = (companyID, employeeID) => {
  return jwt.sign({ companyID, employeeID }, process.env.JWT_SECRET, {
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
  findUser,
  deactivateEmployee,
  findEmployees,
  activateEmployee,
  deletePhoto,
  deleteOperation,
  getAllPhotos,
  addOperation,
  getUsersAllOperations,
  getUsersOpenOperations,
  getUsersHasPaymentOperations,
  addDataToOperation,
  getUsersAllPayments
};
