import User from "../models/userModel.js";
import Company from "../models/companyModel.js";
import Employee from "../models/EmployeesModel.js";
import { passwordResetMail } from "../controller/mailControllers.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CustomError } from "../helpers/error/CustomError.js";
import SERVICES_LIST from '../config/services_list.js'
import Order from "../models/OrderModel.js";

const createCompany = async (req, res, next) => {
  try {
    console.log("burasıx");
    const data = req.body;
    const newDate = new Date();
    req.body.subscribeEndDate = new Date(
      newDate.setMonth(newDate.getMonth() + 1)
    ).toISOString();

    const processes =SERVICES_LIST
    

    req.body.services = [];

    processes.forEach(process => {
      req.body.services.push({
        serviceName: process,
        servicePrice: 99,
        activeorNot: false,
      });
    });

    if (data.password !== data.password2) {
      return next(new Error("Girdiğiniz şifreler farklıdır", 400));
    }
    console.log(data)
    const company = await Company.create(data);
    data.role = "Admin";
    data.company = company._id;
    
    await Employee.create(data);
    let orderData={
      company:company._id,
      amount:0,
      paymentDuration:30,
      paymentTransactionId:0
    }
    await Order.create(orderData);
    next();
  } catch (error) {
    return next(error);
  }
};


const deactivateUser = async (req, res) => {
  try {
    console.log("başarılı");

    await User.findByIdAndUpdate(req.params.id, { activeOrNot: false });
    res.redirect("../../employess");
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "usercontroller delete error",
    });
  }
};
const activateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { activeOrNot: true });
    res.redirect("../../employees");
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "usercontroller delete error",
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

const addUser = async (req, res) => {
  try {
    const data = req.body;
    data.company = res.locals.company._id;

    const user = await User.create(data);

    res.redirect("./users");
    console.log(user);
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "usercontroller error",
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
      console.log(company)
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
      console.log(result);
      return { secure_url: result.secure_url, public_id: result.public_id };
    };

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
        console.log(file);
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

    res.redirect("back");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: "ekleme hatası",
      message: error,
    });
  }
};

const deletePhoto = async (req, res) => {
  try {
    cloudinary.uploader.destroy(
      "archimet/" + req.params.public_id,
      function (error, result) {
        if (error) {
          console.log(error);
        }
        console.log(result);
      }
    );

    console.log(req.params);

    await User.updateOne(
      { _id: req.params.id },
      {
        $pull: {
          images: { public_id: "archimet/" + req.params.public_id },
        },
      }
    );

    res.redirect("back");
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "delete photo error",
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
  addUser,
  loginUser,
  logOut,
  uploadPictures,
  editInformations,
  findUser,
  deactivateUser,
  findEmployees,
  activateUser,
  deletePhoto,
};
