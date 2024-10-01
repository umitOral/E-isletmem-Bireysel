import Company from "../models/companyModel.js";
import User from "../models/userModel.js";
import { CustomError } from '../helpers/error/CustomError.js'

import { getProductModelGeneral, getProductModel } from "../tenantDb.js";
import axios from "axios";

const addProduct = async (req, res, next) => {
  try {
    console.log("add product")
    console.log(req.body)
    let tenantId = res.locals.company._id
    if (req.body.barcodeType === "ean") {
      req.body.ean = req.body.barcode
    } else {
      req.body.upc = req.body.barcode
    }

    let productModel = await getProductModel(tenantId)
    const product = await productModel.create(req.body)
      .then(response => {
        res.json({
          success: true,
          message: "ürün eklendi"
        })
      })
      .catch(err => {
        res.json({
          success: false,
          message: err.message
        })
      })


  } catch (error) {
    res.json({
      success: false,
      message: "ürün eklenirken bir sorun oluştu",
      error: error
    })
  }
}
const searchProduct = async (req, res, next) => {

  try {
    console.log(req.body)
    let barcode = Number(req.body.barcode)
    let productModel = await getProductModelGeneral()

    await productModel.findOne({ $or: [{ upc: barcode }, { ean: barcode }] })
      .then(response => {
        if (response) {
          res.status(200).json({
            success: true,
            message: "içerden sorgulandı",
            data: response
          })
        } else {
          console.log("burası")
          axios.get(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`)
            .then(function (response) {
              console.log(response.data);
              response.data.items[0].productName = response.data.items[0].title
              productModel.create(response.data.items[0])
              res.status(200).json({
                success: true,
                message: "dışardan sorgulandı",
                data: response.data.items[0]
              })

            })
            .catch(function (error) {
              console.log(error);
            })
        }
      })
      .catch(err => {

      })



  } catch (error) {
    res.json({
      success: false,
      message: "ürün bulunurken bir sorun oluştu",
      error: error
    })
  }
}



export {
  searchProduct,
  addProduct,

};
