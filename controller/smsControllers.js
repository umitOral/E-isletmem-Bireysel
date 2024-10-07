import Company from "../models/companyModel.js";
import User from "../models/userModel.js";
import { CustomError } from "../helpers/error/CustomError.js";
import { getProductModel } from "../tenantDb.js";

const addSms = async (req, res, next) => {
  try {
    console.log("add sms");
    console.log(req.body);

    await Company.updateOne(
      { _id: res.locals.company._id },
      {
        $push: {
          sms: req.body,
        },
      }
    )
      .then((response) => {
        console.log(response);
        res.json({
          success: true,
          message: "sms eklendi",
        });
      })
      .catch((err) => {
        res.json({
          success: false,
          message: err.message,
        });
      });
  } catch (error) {
    res.json({
      success: false,
      message: "ürün eklenirken bir sorun oluştu",
      error: error,
    });
  }
};

const deactivateSms = async (req, res, next) => {
  try {
    await Company.updateOne(
      { "sms._id": req.params.id },
      {
        $set: {
          "sms.$[xxx].activeorNot": false,
        },
      },
      {
        arrayFilters: [{ "xxx._id": req.params.id }],
      }
    );
    res.redirect("back");
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const activateSms = async (req, res, next) => {
  try {
    await Company.updateOne(
      { "sms._id": req.params.id },
      {
        $set: {
          "sms.$[xxx].activeorNot": true,
        },
      },
      {
        arrayFilters: [{ "xxx._id": req.params.id }],
      }
    );
    res.redirect("back");
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const editSms = async (req, res, next) => {
  try {
    console.log(req.body);
    await Company.updateOne(
      { "sms._id": req.params.id },
      {
        $set: {
          "sms.$[xxx].content": req.body.content,
        },
      },
      {
        arrayFilters: [{ "xxx._id": req.params.id }],
      }
    );
    res.json({ success: true, message: "mesaj içeriği değiştirildi" });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const sendBulkSms = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log("bulk sms");
    req.body.message.replace("{{isim}}");
    let messages = [];
    for (const element of req.body.users) {
      await User.findById(element)
        .then((response) => {
          messages.push({
            user: response.phone,
            message: req.body.message.replace("{{isim}}", response.name),
          });
        })
        .catch((err) => console.log(err));
    }
    console.log(messages)

    res.json({ success: true, message: "mesaj içeriği değiştirildi" });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

export { addSms, activateSms, deactivateSms, editSms, sendBulkSms };
