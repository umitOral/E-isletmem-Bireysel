import Session from "../models/sessionModel.js";
import Company from "../models/companyModel.js";
import { CustomError } from "../helpers/error/CustomError.js";

const updateCompanyPassword = async (req, res, next) => {
  try {
    console.log(req.body);
    
      if (req.body.password !==req.body.password2) {
        return next(new Error("şifreler aynı değil"), 400);
      }
    

    const company = await Company.findOne({_id:req.params.id});
      company.password=req.body.password
      company.save()
    res.json({
      succes: true,
      message: "bilgiler başarıyla değiştirildi.",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "update error",
    });
  }
};
const updateCompanyInformations = async (req, res, next) => {
  try {
    req.body.workHours={
      "workStart":req.body.workStart,
      "workEnd":req.body.workEnd,
    }

    await Company.findByIdAndUpdate(req.params.id, req.body);
    console.log(req.body)
    res.json({
      succes: true,
      message: "bilgiler başarıyla değiştirildi.",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "create session error",
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    res.redirect("back");
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "delete error",
    });
  }
};

export { updateCompanyPassword, deleteCompany, updateCompanyInformations };
