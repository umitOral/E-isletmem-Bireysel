import User from "../models/userModel.js";
import Company from "../models/companyModel.js";
import Order from "../models/OrderModel.js";
import Employee from "../models/EmployeesModel.js";
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
    const cloudinaryImageUploadMethod = async (file) => {
      const result = await cloudinary.uploader.upload(file, {
        use_filename: true,
        folder: "archimet",
      });

      return { secure_url: result.secure_url, public_id: result.public_id };
    };
    console.log("burası");

    const files = req.files.upload_file;

    if (files.length === undefined) {
      console.log("tek resim");
      const path = files.tempFilePath;
      const data = await cloudinaryImageUploadMethod(path);

      await User.updateOne(
        { _id: req.params.id },
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
        await User.updateOne(
          { _id: req.params.id },
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
const addOrder = async (req, res) => {
  try {
    console.log(req.body)
    console.log(req.params)
    
    req.body.status=ORDER_STATUS_LIST[0]
    req.body.company=res.locals.company
    req.body.user=req.params.id
    req.body.price=req.body.products.map(element=>element.productPrice).reduce((a,b)=>a+b)
    
    
    await Order.create(req.body)
  
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

    User.updateOne(
      { _id: req.params.id },
      {
        $pull: {
          images: { public_id: "archimet/" + req.params.public_id },
        },
      }
    )
      .then((response) => console.log(response))
      .catch((err) => console.log(err));

    res.json({ success: true, message: "resim başarıyla silindi" });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "delete photo error",
    });
  }
};
const getUsersOpenOrders = async (req, res) => {

  try {
    console.log("heylooo")
    const orders = await Order.find({
      user:req.params.id,
      status:"open"
    });

    let data=orders.map(element=>element.products).flat(1)
    
    res.json({ success: true, message: "işlemler çekildi", data:data });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "resimler çekilirken bir hata oluştu",
    });
  }
};
const getUsersAllOrders = async (req, res) => {

  try {
    console.log("burası")
    const orders = await Order.find({
      user:req.params.id
    });

    
  
    res.json({ success: true, message: "işlemler çekildi", data:orders });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "resimler çekilirken bir hata oluştu",
    });
  }
};
const getAllPhotos = async (req, res) => {
  try {
    const singleUser = await User.findById(req.params.id);

    const photos = singleUser.images.sort(compare);
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
  getAllPhotos,
  addOrder,
  getUsersAllOrders,
  getUsersOpenOrders
};
