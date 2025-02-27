import User from "../models/userModel.js";
import axios from "axios";
import Company from "../models/companyModel.js";
import Operation from "../models/OperationsModel.js";
import Employee from "../models/EmployeesModel.js";
import Payment from "../models/paymentsModel.js";
import Session from "../models/appointmentModel.js";
import { sendPasswordResetMail } from "../controller/mailControllers.js";
import { cloudinaryImageUploadMethod } from "../helpers/imageHelpers.js";
import { createSmsAuthorization } from "../helpers/smsHelpers.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CustomError } from "../helpers/error/CustomError.js";
import {
  APPOINTMENT_STATUS,
  SERVICES_LIST,
  OPERATION_STATUS_AUTOMATIC,
  PAYMENT_STATUS,
  SMS_PACKAGE_STATUS,
  OPERATION_APPOINTMENT_AVALIABLE_STATUS,
  SESSION_STATUS_LIST_AUTOMATIC,
} from "../config/status_list.js";
import Subscription from "../models/subscriptionModel.js";

import { Response } from "../helpers/error/Response.js";

import { AuditLogs } from "../helpers/auditLogs.js";
import Sms from "../models/smsModel.js";
import { NOTIFICATIONS } from "../config/notifications.js";
import Appointment from "../models/appointmentModel.js";
import { sendSingleSms } from "./smsControllers.js";

const deactivateEmployee = async (req, res, next) => {
  try {
    

    await Employee.findByIdAndUpdate(req.params.id, { activeOrNot: false });
    res.redirect("back");
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const activateEmployee = async (req, res, next) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, { activeOrNot: true });
    res.json(Response.successResponse(true,"personel aktifleştirildi",200));
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const getUsersAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({
      user: req.params.id,
    }).populate(["doctor", "plannedOperations.oldOperations"]);

    res.status(200).json({
      succes: true,
      appointments,
      APPOINTMENT_STATUS,
      message: "seanslar başarıyla çekildi",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const getUsersAllSms = async (req, res, next) => {
  try {
    
    
    if ( res.locals.company.smsConfig.password === undefined) {
      
      res.json(
        Response.unsuccessResponse(
          false,
          "Sms Gönderiminiz Aktif Değil",400,"/admin/settings"
        )
      );
      return
    }
    
    const authorization = await createSmsAuthorization(res.locals.company);
    let sendedSms = await Sms.find({ user: req.params.id });
    let data = {
      sender: res.locals.company.smsConfig.smsTitle,
      customIDs: sendedSms.map((item) => item._id),
    };
    
    await axios
      .post("https://panel4.ekomesaj.com:9588/sms/list", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      })
      .then(async (response) => {
        
        
        // 
        // 
        if (!response.data.err) {
          res.status(200).json({
            success: true,
            sms: response.data.data,
            SMS_PACKAGE_STATUS,
            message: "sms başarıyla çekildi",
          });
        }
      })
      .catch((err) => {
        
        res.status(500).json({
          success: false,
          sms: err,
          message: "sms çekilirken hata oluştu",
        });
      });
  } catch (error) {
    
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const sendSingleSmsController = async (req, res, next) => {
  try {
    
    await User.findById(req.body.userId).then(async (response) => {
      if (response.phone !== "") {
        req.body.messageContent = req.body.messageContent
          .replace("{{isim}}", response.name)
          .replace("{{soyisim}}", response.surname);
        await sendSingleSms(
          response,
          res.locals.company,
          req.body.messageContent,
          req.body.messageTitle,
          res.locals.company.smsConfig.smsTitle
        ).then((response) => {
          
          res.status(200).json({
            success: true,
            message: "mesaj gönderildi",
          });
        });
      } else {
        res.status(400).json({
          success: false,
          message: "kullanıcının telefon numarası eksik",
        });
      }
    });
  } catch (error) {
    
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const findUser = async (req, res, next) => {
  try {
    //search

    let searchObject = {
      company: res.locals.company._id,
    };
    if (req.body.name !== "") {
      searchObject.name = { $regex: "^" + req.body.name + "$", $options: "i" };
    }
    if (req.body.surname !== "") {
      searchObject.surname = req.body.surname;
    }
    if (req.body.phone !== "") {
      searchObject.phone = req.body.phone;
    }
    if (req.body.identity !== "") {
      searchObject.identity = req.body.identity;
    }

    
    let users = await User.find(searchObject);

    res.status(200).json({
      data: users,
      link: "users",
      success: true,
      message: "hastalar başarıyla çekildi",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const findSingleUser = async (req, res, next) => {
  try {
    //search

    
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
const findEmployees = async (req, res, next) => {
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
 
    req.body.company = res.locals.company;
    let searchEmail;
    let searchPhone;
    if (req.body.email !== "") {
     
      searchEmail = await User.findOne({
        email: req.body.email,
        company: res.locals.company,
      });
      
    }

    if (req.body.phone !== "") {
     
       searchPhone = await User.findOne({
        phone: req.body.phone,
        company: res.locals.company,
      });
      
    }
    
    
    if (searchEmail) {
      
      res.json(
        Response.unsuccessResponse(
          false,
          "Bu mail adresi ile kayıtlı kullanıcı bulunmaktadır"
        )
      );
    } else if (searchPhone) {
     
      res.json( 
        Response.unsuccessResponse(
          false,
          "Bu Telefon adresi ile kayıtlı kullanıcı bulunmaktadır"
        )
      );
    } else {
      
      await User.create(req.body).then((response) => {
        
        jwt.verify(
          req.cookies.userData,
          process.env.JWT_SECRET,
          async (err, decodedToken) => {
            if (err) {
              
            }

            decodedToken.usersNames.push({
              _id: response._id,
              name: response.name,
              surname: response.surname,
              email: response?.email,
            });
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
              message: "hasta başarıyla kaydedildi.",
            });
          }
        );
      });
    }
  } catch (error) {
    return next(new CustomError("tanımlanmayan hata", 500, error));
  }
};
const editInformations = async (req, res, next) => {
  try {
    let searchEmail;
    let searchPhone;
    let user = await User.findById(req.params.id);

    if (user.email !== req.body.email && req.body.email !== "") {
      searchEmail = await User.findOne({
        email: req.body.email,
        company: res.locals.company,
      });
    }

    if (user.phone !== req.body.phone && req.body.phone !== "") {
      searchPhone = await User.findOne({
        phone: req.body.phone,
        company: res.locals.company,
      });
    }

    if (searchEmail) {
      res.json(
        Response.unsuccessResponse(
          false,
          "Bu mail ile kayıtlı kullanıcı bulunmaktadır"
        )
      );
    } else if (searchPhone) {
      res.json(
        Response.unsuccessResponse(
          false,
          "Bu Telefon ile kayıtlı kullanıcı bulunmaktadır"
        )
      );
    } else {
      let updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          address: req.body.address,
          sex: req.body.sex,
          birthDate: req.body.birthDate,
          identity: req.body.identity,
          phone: req.body.phone,
          company: req.body.company,
          billingAddress: req.body.billingAddress,
          notes: req.body.notes,
          userCompany: req.body.userCompany,
        },
        { new: true }
      );

      res.json(
        Response.successResponse(true, "bilgiler başarıyla değiştirildi", 200, {
          user: updatedUser,
        })
      );
    }

    AuditLogs.info(res.locals.employee.email, "user", "edit", {
      _id: req.params._id,
      ...req.body,
    });
  } catch (error) {
    return next(new CustomError("Yetkili ile iletişime geçiniz", 500, error));
  }
};

const loginUser = async (req, res, next) => {
  try {
   
    let same = false;

    const employee = await Employee.findOne({ email: req.body.email });

    if (employee) {
      const company = await Company.findOne({ _id: employee.company });
      same =await bcrypt.compare(req.body.password, employee.password);
      
      if (same) {
        
        const token = createToken(company._id, employee._id);

        const usersNames = await User.find(
          { role: "customer", company: company },
          { name: true, surname: true, email: true }
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

        res.status(200).json({
          success: true,
          message: "Giriş Başarılı,yönlendiriliyorsunuz",
        });
      } else {
        res.json(
          Response.unsuccessResponse(false, "Kullanıcı adı veya şifresi yanlış",401)
        );
      }
    } else {
      res.json(
        Response.unsuccessResponse(false, "Kayıtlı kullanıcı bulunamadı",400)
      );
    }
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const uploadPictures = async (req, res, next) => {
  try {
    

    
    const files = req.files.upload_file;
    
    if (files.length === undefined) {
      
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
    
    

    req.body.selectedOperations.forEach((element) => {
      element.company = res.locals.company;
      element.operationStatus = OPERATION_STATUS_AUTOMATIC.CONTINUE;
      element.user = req.params.id;

      if (req.body.discount !== 0) {
        element.percentDiscount = req.body.discount;
      }
      if (element.operationPrice === 0) {
        element.paymentStatus = PAYMENT_STATUS.PAID;
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
    
    

    if ((req.body.discount === "") & (req.body.percentDiscount === "")) {
      res.json(
        Response.unsuccessResponse(
          false,
          "en az 1 adet indirim tanımlamanız gerekmektedir"
        )
      );
    } else if ((req.body.discount !== "") & (req.body.percentDiscount === "")) {
      await Operation.findByIdAndUpdate(req.params.operationID, {
        $set: {
          discount: req.body.discount,
        },
      });
    } else if ((req.body.percentDiscount !== "") & (req.body.discount === "")) {
      await Operation.findByIdAndUpdate(req.params.operationID, {
        $set: {
          percentDiscount: req.body.percentDiscount,
        },
      });
    } else if ((req.body.percentDiscount !== "") & (req.body.discount !== "")) {
      await Operation.findByIdAndUpdate(req.params.operationID, {
        $set: {
          percentDiscount: req.body.percentDiscount,
          discount: req.body.discount,
        },
      });
    }

    res.json({
      success: true,
      message: "indirim başarıyla tanımlandı",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const addOperationInsideAppointment = async (req, res, next) => {
  try {
    
    
    
    let foundedAppointment = await Appointment.findById(
      req.body.appointment
    ).populate("plannedOperations.oldOperations");
    if (req.body.selectedOperationsForAdd.new === "") {
      
      let operation = await Operation.findById(
        req.body.selectedOperationsForAdd.old
      );
      operation.sessionOfOperation.push({
        refAppointmentID: foundedAppointment._id,
        sessionState: SESSION_STATUS_LIST_AUTOMATIC.WAITING,
        sessionDate: req.body.date,
      });
      operation.appointmensCount = operation.appointmensCount + 1;
      operation.operationAppointmentStatus =
        OPERATION_APPOINTMENT_AVALIABLE_STATUS.NO;
      foundedAppointment.plannedOperations.oldOperations.push(operation._id);
      await operation.save();
    } else {
      
      let service = res.locals.company.services.find(
        (item) => item.serviceName === req.body.selectedOperationsForAdd.new
      );
      
      let newOperation = {};
      newOperation.operationName = service.serviceName;
      newOperation.operationPrice = service.servicePrice;
      newOperation.company = res.locals.company;
      newOperation.user = req.params.userId;
      newOperation.operationAppointmentStatus =
        OPERATION_APPOINTMENT_AVALIABLE_STATUS.NO;
      newOperation.operationStatus = OPERATION_STATUS_AUTOMATIC.CONTINUE;
      newOperation.sessionOfOperation = [
        {
          sessionDate: new Date(req.body.date),
          sessionState: SESSION_STATUS_LIST_AUTOMATIC.WAITING,
          refAppointmentID: req.body.appointment,
        },
      ];

      let operation = await Operation.create(newOperation);
      foundedAppointment.plannedOperations.oldOperations.push(operation._id);
      foundedAppointment.plannedOperations.oldOperations.push(operation._id);
    }

    await foundedAppointment.save();
    let modifiedAppointment = await Appointment.findById(
      req.body.appointment
    ).populate("plannedOperations.oldOperations");
    res.json({
      succes: true,
      message: "işlem başarıyla eklendi",
      data: modifiedAppointment,
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const deleteOperation = async (req, res, next) => {
  try {
    
    let operation = await Operation.findById(req.params.operationId).then(
      async (response) => {
        if (response.sessionOfOperation.length !== 0) {
          res.status(200).json({
            succes: false,
            message: "işleme ait seanslar bulunmaktadır.Silinemez",
          });
        } else if (response.payments.length !== 0) {
          res.status(200).json({
            succes: false,
            message: "işleme ait ödemeler bulunmaktadır.Silinemez",
          });
        } else {
          await Operation.findByIdAndDelete(req.params.operationId);
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
    // 
    // let appointmentsDates = operation.appointments.map((item) =>
    //   item.date.setTime(item.startHour)
    // );
    // let date = new Date();
    // let diffTime = [];

    // 
    // appointmentsDates.forEach(async (element) => {
    //   diffTime.push(date - element);
    // });

    // let result = diffTime.findIndex((item) => item > 0);
    // 
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
    //   await Appointment.deleteMany({ _id: { $in: operation.appointments } });
    //   await Operation.findByIdAndDelete(req.params.operationId)
    //     .then((response) => {
    //       
    //       if (response.images.length !== 0) {
    //         
    //         response.images.forEach(async (element) => {
    //           await cloudinary.uploader.destroy(
    //             element.public_id,
    //             function (error, result) {
    //               if (error) {
    //                 
    //               } else {
    //                 
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
    //       
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
const getSessionsofOperation = async (req, res, next) => {
  try {
    
    Operation.findById(req.params.operationId).then(async (response) => {
      
      if (response.sessionOfOperation.length === 0) {
        res.status(200).json({
          succes: false,
          data: {},
          message: "işleme ait seanslar bulunmamaktadır.",
        });
      } else {
        res.status(200).json({
          succes: true,
          data: response,
          message: "işleme ait seanslar çekildi.",
        });
      }
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const deletePhoto = async (req, res, next) => {
  
  try {
    //TODO
    // resim silmeye çalışan müşteri kendisi mi kontrol ediecek  @@SECURITY

    cloudinary.uploader.destroy(
      "archimet/" + req.params.public_id,
      function (error, result) {
        if (error) {
          
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
    
    

    const operations = await Operation.find({
      user: req.params.id,
      operationAppointmentStatus:
        OPERATION_APPOINTMENT_AVALIABLE_STATUS.AVALIABLE,
      $expr: {
        $ne: [{ $size: "$sessionOfOperation" }, "$totalAppointments"],
      },
    });

    // let filteredOperations = operations.filter((item) => {
    //   item.sessionOfOperation.length === item.totalAppointments;
    // });

    res.json({
      success: true,
      message: "işlemler çekildi",
      operations: operations,
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
      operationPrice: { $ne: 0 },
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
    
    res.json({
      success: true,
      message: "işlemler çekildi",
      data: operations,
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const getAllPhotos = async (req, res, next) => {
  try {
    

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
    

    res.json({ success: true, message: "resimler çekildi", photos });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const getUsersAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({
      fromUser: req.params.id,
      company: res.locals.company._id,
    })
      .populate("products.productId")
      .populate("operations.operationId");
    payments.forEach((element) => {
      
    });

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

const getUserNotifications = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    let userNotifications = user.notifications || {};
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

const updateUserNotifications = async (req, res, next) => {
  
  try {
    let user = await User.findById(req.params.id);
    if (user.notifications.includes(req.body.notificationkey)) {
      user.notifications = user.notifications.filter(
        (x) => x !== req.body.notificationkey
      );
    } else {
      user.notifications.push(req.body.notificationkey);
    }

    
    await user.save();
    res.status(200).json({
      success: true,
      message: "izin değiştirildi",
      data: req.body.notificationkey,
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

const resetPasswordMail = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ email: req.body.email });

    if (!employee) {
      res.json(
        Response.unsuccessResponse(false, "Kayıtlı kullanıcı Bulunamadı")
      );
    } else {
      const email = req.body.email;
      const resetToken = employee.createResetPasswordToken(email);
      await employee.save();
      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/newPassword/${resetToken}`;

      sendPasswordResetMail(email, resetUrl);

      res.status(200).json({
        success: true,
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
  createUser,
  loginUser,
  logOut,
  uploadPictures,
  editInformations,
  findUser,
  findSingleUser,
  deactivateEmployee,
  findEmployees,
  activateEmployee,
  updateUserNotifications,
  deletePhoto,
  deleteOperation,
  getSessionsofOperation,
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
  getUsersAllAppointments,
  getUsersAllSms,
  getUserNotifications,
  sendSingleSmsController,
};
