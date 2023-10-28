import User from "../models/userModel.js";
import Company from "../models/companyModel.js";
import { passwordResetMail } from "../controller/mailControllers.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CustomError } from "../helpers/error/CustomError.js";

const createCompany = async (req, res, next) => {
  try {
    const data = req.body;

    if (data.password !== data.password2) {
      return next(new Error("Girdiğiniz şifreler farklıdır", 400));
    }
    const company = await Company.create(data);

    res.json({
      succes: true,
      message: "Kaydınız başarıyla gerçekleşti.",
      data: company,
    });

    next();
  } catch (error) {
    return next(error);
  }
};
const deactivateUser = async (req, res) => {
  try {
    console.log("başarılı");

    await User.findByIdAndUpdate(req.params.id, { activeOrNot: false });
    res.redirect("../../personels");
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
    res.redirect("../../personels");
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
      searchObject["company"] = res.locals.user._id;
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
      .equals(res.locals.user._id);
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
const findPersonels = async (req, res) => {
  try {
    //search
    let query = User.find();
    if (req.query) {
      const searchObject = {};
      const regex = new RegExp(req.query.user, "i");
      searchObject["name"] = regex;
      searchObject["company"] = res.locals.user._id;
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
      .equals(res.locals.user._id);
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
      header: "Personeller",
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
    const data = req.body;
    data.company = res.locals.user._id;

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
    const company = await Company.findOne({ email: req.body.email });

    if (company) {
      same = await bcrypt.compare(req.body.password, company.password);
    } else {
      return next(new Error("Kayıtlı kullanıcı Bulunamadı", 400));
    }

    if (same) {
      console.log("burası");
      const token = createToken(company._id);
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
      return { secure_url: result.secure_url, public_id:result.public_id };
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
            images: { url: data.secure_url, uploadTime: req.body.uploadTime,public_id:data.public_id},
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
              images: { url: data.secure_url, uploadTime: req.body.uploadTime,public_id:data.public_id },
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
    cloudinary.uploader.destroy("archimet/"+req.params.public_id, function (error, result) {
      if (error) {
        console.log(error);
      }
      console.log(result);
    });

    console.log(req.params);
    
    await User.updateOne(
      { _id: req.params.id },
      {
        $pull: {
          images: { public_id:"archimet/"+req.params.public_id },
        },
      }
    );

    res.redirect("back")
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
    const company = await Company.findOne({ email: req.body.email });

    if (!company) {
      next(new CustomError("Kayıtlı kullanıcı Bulunamadı", 400));
    } else {
      const email = req.body.email;
      const resetToken = company.createResetPasswordToken(company.email);

      await company.save();
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

const createToken = (userID) => {
  console.log(process.env.LOGIN_EXPIRES);
  return jwt.sign({ userID }, process.env.JWT_SECRET, {
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
  deactivateUser,
  findPersonels,
  activateUser,
  deletePhoto,
};
