import Operation from "../models/OperationsModel.js";
import Session from "../models/appointmentModel.js";
import Company from "../models/companyModel.js";
import { CustomError } from "../helpers/error/CustomError.js";

const addData = async (req, res) => {
  try {
    console.log(req.body);

    await Company.findByIdAndUpdate(res.locals.company._id, {
      $push: {
        serviceDatas: {
          dataName: req.body.dataName,
        },
      },
    });
    res.redirect("back");
    console.log("başarılı");
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "usercontroller error",
    });
  }
};
const addOptiontoData = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.params);

    await Company.updateOne(
      { _id: res.locals.company._id },
      { $push: { "serviceDatas.$[elm].dataOptions": req.body.dataOption } },

      { arrayFilters: [{ "elm._id": req.params.id }], upsert: true }
    )
      .then((response) => console.log(response))
      .catch((err) => console.log(err));

    res.redirect("back");
    
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "usercontroller error",
    });
  }
};
const deleteOptionofData = async (req, res) => {
  try {
    console.log(req.params);
    
    await Company.updateOne(
      { _id: res.locals.company._id },
      { $pull: { "serviceDatas.$[elm].dataOptions": req.params.optionName} },
      { arrayFilters: [{ "elm._id": req.params.id }], upsert: true }
    )
      .then((response) => res.status(201).json({
        succes:true,
        message:"opsiyon başarıyla silindi"
      }))
      .catch((err) =>{
        return new CustomError("silinirken bir hata yaşandı",500,err)
      });

   
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error,
    });
  }
};
const editOptionofData = async (req, res) => {
  try {
    
    console.log(req.body);
    console.log(req.params);
    let optionName = req.params.optionName;

    await Company.updateOne(
      { _id: res.locals.company._id },
      {
        $set: {
          "serviceDatas.$[elm].dataOptions.$[optionName]": req.body.dataOption,
        },
      },

      {
        arrayFilters: [
          { "elm._id": req.params.dataId },
          { optionName: optionName },
        ],
        upsert: true,
      }
    )
      .then((response) => console.log(response))
      .catch((err) => console.log(err));

    res.redirect("back");
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "usercontroller error",
    });
  }
};

const getData = async (req, res) => {
  try {
    
    let serviceDatas = res.locals.company.serviceDatas
    res.status(200).json({
      success: true,
      message: "veriler çekildi",
      serviceDatas,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "usercontroller error",
    });
  }
};
const deleteOption = async (req, res) => {
  try {
    console.log(req.params);
    console.log(req.query);

    let responseData = await Operation.findOneAndUpdate(
      { _id: req.params.operationID },
      { $pull: { operationData: { _id: req.params.dataID } } },
      { returnOriginal: false }
    );

    res.status(200).json({
      success: true,
      responseData,
      message: "data silindi",
    });

  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "bir sorun oluştu.",
    });
  }
};

export {
  addData,
  addOptiontoData,
  editOptionofData,
  getData,
  deleteOptionofData,
  deleteOption,
};
