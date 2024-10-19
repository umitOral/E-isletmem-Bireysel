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

const addPassiveProduct = async (req, res, next) => {
  try {
    console.log("addPassiveProduct");
    console.log(req.body);

    req.body.barcodes = [req.body.barcode];

    req.body.company = res.locals.company._id;
    req.body.totalStock = req.body.stocks.quantity;
    Product.create(req.body)
      .then((response) => {
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

    req.body.barcodes = [req.body.barcode];
    req.body.company = res.locals.company._id;
    let product = await ProductGeneral.findOne({
      "barcodes.barcode": req.body.barcode,
    });
    console.log(req.body);
    if (product === null) {
      await Product.create(req.body);
      let data = {
        name: req.body.name,
        barcodes: { barcode: req.body.barcode, skrsStatus: true },
        brand: req.body.brand,
      };

      await ProductGeneral.create(data).then(() => {
        res.json({
          success: true,
          message: "ürün eklendi",
        });
      });
    } else {
      res.json({
        success: false,
        message: "bu barkodla kayıtlı ürün bulunmaktadır.",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error,
      error: error,
    });
  }
};
const addStock = async (req, res, next) => {
  try {
    console.log("addStock");
    console.log(req.body);

    await Product.findOneAndUpdate(
      { _id: req.params.productId },
      {
        $push: { stocks: req.body },
        $inc: { totalStock: req.body.quantity },
      },
      { new: true }
    ).then((response) => {
      res.json({
        success: true,
        message: "stok eklendi",
        data: response,
      });
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error,
    });
  }
};
const fixStock = async (req, res, next) => {
  try {
    console.log("fixStock");
    console.log(req.body);

    let product = await Product.findById(req.params.productId);
   
    
    product.stocks.push({
      quantity: (req.body.quantity) - (product.totalStock),
      unitCost: 0,
    });
    product.totalStock = req.body.quantity;
    await product.save().then((response) => {
      res.json({
        success: true,
        message: "stok düzeltildi.",
        data: response,
      });
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error,
    });
  }
};
const editProduct = async (req, res, next) => {
  try {
    console.log("edit product");
    console.log(req.body);

    await Product.findByIdAndUpdate(req.params.productId, req.body, {
      new: true,
    }).then((response) => {
      res.json({
        success: true,
        message: "ürün başarıyla düzenlendi",
        data: response,
      });
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error,
    });
  }
};
const searchProduct = async (req, res, next) => {
  try {
    console.log(req.body);
    let barcode = Number(req.body.barcode);
    await Product.findOne({
      company: res.locals.company._id,
      barcodes: req.body.barcode,
    }).then(async (response) => {
      if (response === null) {
        await ProductGeneral.findOne({
          "barcodes.barcode": req.body.barcode,
        }).then((response) => {
          if (response === null) {
            res.status(200).json({
              success: false,
              productFind: false,
              message:
                "Veri tabanımızda ürün bulunamadı. barkodlu ürün olarak ekleyiniz.",
              data: response,
            });
          } else {
            res.status(200).json({
              success: true,
              productFind: false,
              message: "Pasif Ürün bulundu",
              data: response,
            });
          }
        });
      } else {
        res.status(200).json({
          success: true,
          productFind: true,
          message: "Aktif Ürün bulundu",
          data: response,
        });
      }
    });
  } catch (error) {
    res.json({
      success: false,
      message: "ürün bulunurken bir sorun oluştu",
      error: error,
    });
  }
};

export {
  searchProduct,
  addProduct,
  addPassiveProduct,
  editProduct,
  addStock,
  fixStock,
};
