import User from "../models/userModel.js";
import Sms from "../models/smsModel.js";

import { ProductGeneral } from "../models/productGeneralModel.js";
import Operation from "../models/OperationsModel.js";
import Payment from "../models/paymentsModel.js";
import Product from "../models/productModel.js";
import Appointment from "../models/appointmentModel.js";
import Subscription from "../models/subscriptionModel.js";
const addbulkproducttoGeneral = async (req, res, next) => {
  try {
    
    let data = [];

    let modifiedData = [];
    data.forEach((element) => {
      modifiedData.push({
        id: element.product.id,
        name: element.product.name,
        barcodes: element.barcodes,
      });
    });

    // await ProductGeneral.insertMany(modifiedData, { ordered: false })
    //   .then((response) => {
    //     res.json({
    //       success: true,
    //       message: "ürün eklendi",
    //       data: response,
    //     });
    //   })
    //   .catch((err) => {
    //     res.json({
    //       success: false,
    //       message: err.message,
    //     });
    //   });
  } catch (error) {
    res.json({
      success: false,
      message: "ürün eklenirken bir sorun oluştu",
      error: error,
    });
  }
};
const topluIslemler = async (req, res, next) => {
  try {
    
    
    // let response3 = await Subscription.deleteMany({status:"pending"});
    // let response4=  await Appointment.deleteMany({});
   
    res.status(200).json({
      success: true,
      message: "içerden sorgulandı",
      data: response3
    });
    // let barcode = Number(req.body.barcode)
    // let productModel = await getProductModelGeneral()
    // await productModel.findOne({ $or: [{ upc: barcode }, { ean: barcode }] })
    //   .then(response => {
    //     if (response) {
    //       
    //       res.status(200).json({
    //         success: true,
    //         message: "içerden sorgulandı",
    //         data: response
    //       })
    //     } else {
    //       

    //       axios.get(`https://api.vapi.co/products`, {
    //         headers: { Authorization: `Bearer NBpQS2bZ6aizi13S8KM37wKRFLpuUWvih`},
    //         // params:{name:"urofen"}
    //       })
    //         .then(function (response) {
    //           
    //           // response.data.items[0].productName=response.data.items[0].title

    //             productModel.insertMany(response.data.data)
    //             // productModel.insertMany(response.data.data)

    //           res.status(200).json({
    //             success: true,
    //             message: "dışardan sorgulandı",
    //             data: response.data
    //           })

    //         })
    //         .catch(function (error) {
    //           
    //            
    //         })
    //     }
    //   })
    //   .catch(err => {

    //   })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "toplu işlem yapılırken sorun oluştu",
      error: error,
    });
  }
};

export { topluIslemler, addbulkproducttoGeneral };
