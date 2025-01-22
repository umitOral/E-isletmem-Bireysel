import mongoose from "mongoose";
import { CustomError } from "../helpers/error/CustomError.js";



const connectGeneralDb = async () => {
  try {
    console.log("connect fonksiyonu");

    if (process.env.NODE_ENV === "development") {
      await mongoose
        .connect(process.env.DB_URI_DEV, {
          dbName: process.env.DB_NAME_DEV,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then((response) => {
          console.log("db development bağlantısı başarılı:" + process.env.DB_NAME_DEV);
        })
        .catch((err) => {
          console.log("xxx"); 
          return new CustomError("Veritabanı bağlantısı başarısız", 500);
        });
    } else {
      await mongoose
        .connect(process.env.DB_URI, {
          dbName: process.env.DB_NAME,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then((response) => {
          console.log("db bağlantısı başarılı:" + process.env.DB_NAME);
        });
    }
  } catch (error) {
    console.log(error);
  }
};

// Var olan bir bayi bağlantısını al
const getTenantDb = (dbName, modelName,schema) => {
console.log(dbName)
  const db = mongoose.connection.useDb(dbName);
 
  const Model = db.model(modelName, schema);
 console.log(Model)
  return Model;
};

export { connectGeneralDb,getTenantDb };
