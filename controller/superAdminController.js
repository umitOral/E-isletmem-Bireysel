import { DOC_STATUS } from "../config/status_list.js";
import Company from "../models/companyModel.js";

const getCompanyDocs = async (req, res) => {
  try {
    console.log("getCompanyDocs");
    let docs = await Company.findById(req.params.companyId);
    res.status(200).json({
      docs: docs.companyDocs,
      DOC_STATUS,
      success: true,
      message: "bilgiler başarıyla çekildi.",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getCompanySmsActive = async (req, res) => {
  try {
    console.log("getCompanySmsActive");
    let docs = await Company.findById(req.params.companyId);
    res.status(200).json({
      companySmsActive: docs.smsActive,
      success: true,
      message: "bilgiler başarıyla çekildi.",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const updateDocStatus = async (req, res) => {
  try {
    console.log("updateDocStatus");
    await Company.findByIdAndUpdate(
      req.params.companyId,
      {
        $set: {
          "companyDocs.$[elm].status": req.body.status,
        },
      },
      {
        arrayFilters: [{ "elm._id": req.params.docId }],
        returnOriginal: false,
      }
    );

    res.status(200).json({
      sucess: true,
      message: "dosya durumu bşarıyla değiştirildi.",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const updateSmsStatus = async (req, res) => {
  try {
    console.log("updateSmsStatus");
    await Company.findByIdAndUpdate(
      req.params.companyId,
      {
        $set: {
          smsActive: req.body.status,
        },
      },
    
    );

    res.status(200).json({
      sucess: true,
      message: "sms Aktivite Durumu balarıyla değiştirildi",
    });
  } catch (error) {
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};

export { getCompanyDocs, updateDocStatus,getCompanySmsActive,updateSmsStatus};
