import Company from "../models/companyModel.js";
import User from "../models/userModel.js";
import fs from "fs";

import { CustomError } from "../helpers/error/CustomError.js";
import {
  productGeneralSchema,
  ProductGeneral,
} from "../models/productGeneralModel.js";
import { getTenantDb } from "../controller/db.js";

import axios from "axios";
import Product from "../models/productModel.js";
import { BRAND_LIST } from "../config/brands.js";

const addPassiveProduct = async (req, res, next) => {
  try {
    

    req.body.barcodes = [req.body.barcode];
    req.body.company = res.locals.company._id;
    req.body.totalStock = req.body.stocks.quantity;

    await Product.create(req.body).then((response) => {
      res.json({
        success: true,
        message: "ürün eklendi",
      });
    });
  } catch (error) {
    return next(
      new CustomError("ürün eklenirken bir sorun oluştu", 500, error)
    );
  }
};
const addProduct = async (req, res, next) => {
  try {
    
    

    req.body.barcodes = [req.body.barcode];
    req.body.company = res.locals.company._id;
    let product = await ProductGeneral.findOne({
      "barcodes.barcode": req.body.barcode,
    });
    

    let brandList = BRAND_LIST;

    if (!brandList.includes(req.body.brand)) {
      
      brandList.push(req.body.brand);
      const updatedList = `const BRAND_LIST = ${JSON.stringify(
        brandList,
        null,
        2
      )}
      export {BRAND_LIST}`;

      // Güncellenmiş veriyi brandList.js dosyasına yaz
      fs.writeFileSync("./config/brands.js", updatedList, "utf8", (err) => {
        if (err) throw err;
      });
    }

    if (product === null) {
      await Product.create(req.body);
      let data = {
        name: req.body.name,
        barcodes: { barcode: req.body.barcode, skrsStatus: true },
        brand: req.body.brand,
      };

      // Yeni eleman ekle
      
      await ProductGeneral.create(data).then((response) => {
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
    
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const addStock = async (req, res, next) => {
  try {
    
    

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
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const fixStock = async (req, res, next) => {
  try {
    
    

    let product = await Product.findById(req.params.productId);

    product.stocks.push({
      quantity: req.body.quantity - product.totalStock,
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
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const updateComission = async (req, res, next) => {
  try {
    
    

    let product = await Product.findByIdAndUpdate(req.params.productId, {
      $set: { baseComission: req.body.comission },
    },{
      new:true
    });
    res.json({
      success: true,
      message: "Komisyon oranı değiştirildi.",
      data: product.baseComission,
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
   
  }
};
const editProduct = async (req, res, next) => {
  try {
    
    

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
    return next(new CustomError("bilinmeyen hata", 500, error));
    
  }
};
const searchProductInner = async (req, res, next) => {
  try {
    
    

    await Product.findOne({
      company: res.locals.company._id,
      barcodes: req.body.barcode,
    }).then((response) => {
      if (response === null) {
        res.json({
          success: false,
          message: "ürün bulunamadı",
          data: null,
        });
      } else {
        res.json({
          success: true,
          message: "ürün eklendi",
          data: response,
        });
      }
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  
  }
};
const searchProductName = async (req, res, next) => {
  try {
    
    let productName = req.body.productName;

    await Product.find({
      company: res.locals.company._id,
      name: { $regex: productName, $options: "i" },
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
              message: "Veri tabanında Ürün bulundu",
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
    return next(new CustomError("bilinmeyen hata", 500, error));
   
  }
};
const searchProduct = async (req, res, next) => {
  try {
    
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
              message: "Veri tabanında Ürün bulundu",
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
  searchProductName,
  addProduct,
  addPassiveProduct,
  editProduct,
  addStock,
  fixStock,
  searchProductInner,
  updateComission,
};
