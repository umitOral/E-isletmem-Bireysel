import mongoose from "mongoose";
import { CustomError } from "../helpers/error/CustomError.js";



const connectGeneralDb = async (dbName) => {
  try {
    console.log("connect fonksiyonu");

    if (process.env.MODE === "development") {
      await mongoose
        .connect(process.env.DB_URI_DEV, {
          dbName: dbName,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then((response) => {
          console.log("db development bağlantısı başarılı:" + dbName);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await mongoose
        .connect(process.env.DB_URI, {
          dbName: dbName,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then((response) => {
          console.log("db bağlantısı başarılı:" + dbName);
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
