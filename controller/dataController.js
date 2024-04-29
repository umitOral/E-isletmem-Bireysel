import Operation from "../models/OperationsModel.js";
import Session from "../models/sessionModel.js";
import Company from "../models/companyModel.js";

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
  
  deleteOption,
};
