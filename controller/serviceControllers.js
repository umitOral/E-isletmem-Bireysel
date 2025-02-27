import Company from "../models/companyModel.js";
import {CustomError} from '../helpers/error/CustomError.js'

import { v4 as uuidv4 } from "uuid";

const addService = async (req, res,next) => {
  try {
    console.log(res.locals.company._id);

    await Company.findByIdAndUpdate(res.locals.company._id, {
      $push: {
        services: {
          serviceId: uuidv4(),
          serviceName: req.body.serviceName,
          servicePrice: req.body.servicePrice,
        },
      },
    });

    console.log("başarılı");

    res.redirect("back");
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const deactivateService = async (req, res,next) => {
  try {
   
    await Company.updateOne(
      { "services._id": req.params.id },
      {
        $set: {
          "services.$[xxx].activeorNot": false,
        },
      },
      {
        arrayFilters: [{"xxx._id":req.params.id}],
      }
    );
    res.redirect("back");
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const activateService = async (req, res,next) => {
  try {
    await Company.updateOne(
      { "services._id": req.params.id },
      {
        $set: {
          "services.$[xxx].activeorNot": true,
        },
      },
      {
        arrayFilters: [{"xxx._id":req.params.id}],
      }
    );
    res.redirect("back");
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const findServices = async (req, res,next) => {
  try {
    //search
    let query = Service.find();
    if (req.query) {
      const searchObject = {};
      const regex = new RegExp(req.query.user, "i");
      searchObject["serviceName"] = regex;
      searchObject["company"] = res.locals.company._id;
      // searchObject["title"] = regex
      query = query.where(searchObject);
    }

    //pagination
    // 1 2 3 4 5..6 7 8

    const page = parseInt(req.query.page) || 1;
    const limit = 3;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await Service.count()
      .where("company")
      .equals(res.locals.company._id);
    const lastpage = Math.ceil(total / limit);
    const pagination = {};
    pagination["page"] = page;
    pagination["lastpage"] = lastpage;

    if (startIndex > 0) {
      pagination.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit: limit,
      };
    }

    query = query.skip(startIndex).limit(limit);

    const data = await query;

    console.log(data);

    res.status(200).render("search-results-services", {
      header: "Hizmetler",
      data,
      total,
      count: data.length,
      pagination: pagination,
      link: "users",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const editService = async (req, res,next) => {
  try {

    await Company.updateOne(
      { "services._id": req.params.id },
      {
        $set: {
          "services.$[xxx].servicePrice": req.body.servicePrice,
        },
      },
      {
        arrayFilters: [{"xxx._id":req.params.id}],
      }
    );
    

    res.status(200).json({
      success:true,
      message:"hizmet adı başarıyla değiştirildi."
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

export {
  addService,
 
  editService,
  findServices,
  deactivateService,
  activateService,
};
