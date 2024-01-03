import User from "../models/userModel.js";
import Employee from "../models/EmployeesModel.js";
import Company from "../models/companyModel.js";
import { CustomError } from "../helpers/error/CustomError.js";

const createEmployees = async (req, res, next) => {
  try {
    
    const userEmail = req.body.email;
    req.body.company=res.locals.company
    const searchEmail = await Employee.findOne({ email: userEmail });
    console.log(userEmail)
    if (searchEmail) {  
      res.json({
        success: false,
        message: "bu mail adresi kullanılmaktadır.",
      });
    } else {

      await Employee.create(req.body);
      res.json({
        success: true,
        message: "Kulllanıcı başarıyla kaydedildi.",
      });
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
    console.log(error)
    res.json({
      success: false,
      message: "bir sorunla karşılaşıldı. Tekrar deneyin",
    });
  }
};
const editInformationsEmployees = async (req, res) => {
  try {
    console.log(req.body);
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

export { createEmployees, editInformationsEmployees };
