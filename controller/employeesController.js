import User from "../models/userModel.js";
import Employee from "../models/EmployeesModel.js";
import Company from "../models/companyModel.js";

const createEmployees = async (req, res) => {
  try {

    const data = req.body;
    data.company = res.locals.company._id;

    const employee = await Employee.create(data);
    // TODO
    // await Company.updateOne(
    //   { _id: res.locals.company._id },
    //   {
    //     $push: {
    //       employees: employee,
    //     },
    //   }
    // );
    
    res.redirect("back");
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "usercontroller error",
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
