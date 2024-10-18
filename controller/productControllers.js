import Company from "../models/companyModel.js";
import User from "../models/userModel.js";
import { CustomError } from "../helpers/error/CustomError.js";
import {
  productGeneralSchema,
  ProductGeneral,
} from "../models/productGeneralModel.js";
import { getTenantDb } from "../controller/db.js";

import axios from "axios";
import Product from "../models/productModel.js";

const addProduct2 = async (req, res, next) => {
  try {
    console.log("add product");
    let data = [];

    let modifiedData = [];
    data.forEach((element) => {
      modifiedData.push({
        id: element.product.id,
        name: element.product.name,
        barcodes: element.barcodes,
      });
    });

    let GeneralProductsModel = getTenantDb(
      process.env.DB_NAME_GENERAL,
      "productGeneral",
      productGeneralSchema
    );
    await GeneralProductsModel.insertMany(modifiedData, { ordered: false })
      .then((response) => {
        res.json({
          success: true,
          message: "ürün eklendi",
          data: response,
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
const addPassiveProduct = async (req, res, next) => {
  try {
    console.log("addPassiveProduct");
    
    req.body.barcodes = [
      {
        barcode:req.body.barcode,
       
      },
    ];
    
    Product.create(req.body)
      .then((response) => {
        console.log(response);
        res.json({
          success: true,
          message: "ürün eklendi",
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
const addProduct = async (req, res, next) => {
  try {
    console.log("add product");
    console.log(req.body);
    await Product.findOne({ "barcodes.barcode": req.body.barcode })
    .then(response=>{
      if (response!==null) {
        res.json({
          success: false,
          message: "bu barkodla kayıtlı ürün bulunmaktadır.",
        });
      }
      else{
         ProductGeneral
        .create(req.body)
        .then((response) => {
          Product.create(req.body)
          .then(()=>{
            res.json({
              success: true,
              message: "ürün eklendi",
            });
          })
        })
      }
    })

  
      
  } catch (error) {
    res.json({
      success: false,
      message: "ürün eklenirken bir sorun oluştu",
      error: error,
    });
  }
};
const searchProduct = async (req, res, next) => {
  try {
    console.log(req.body);
    let barcode = Number(req.body.barcode);
    await Product.findOne({ "barcodes": req.body.barcode }).then(
      async (response) => {
        if (response === null) {
          await ProductGeneral.findOne({
            "barcodes.barcode": req.body.barcode,
          }).then((response) => {
            if (response === null) {
              res.status(200).json({
                success: false,
                productFind:false,
                message:
                  "Veri tabanımızda ürün bulunamadı. barkodlu ürün olarak ekleyiniz.",
                data: response,
              });
            } else {
              res.status(200).json({
                success: true,
                productFind:false,
                message: "Pasif Ürün bulundu",
                data: response,
              });
            }
          });
        } else {
          res.status(200).json({
            success: true,
            productFind:true,
            message: "Aktif Ürün bulundu",
            data: response,
          });
        }
      }
    );
  } catch (error) {
    res.json({
      success: false,
      message: "ürün bulunurken bir sorun oluştu",
      error: error,
    });
  }
};

export { searchProduct, addProduct, addProduct2, addPassiveProduct };
