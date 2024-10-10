import mongoose from "mongoose";
import { CustomError } from "../helpers/error/CustomError.js";

const connect = async () => {
  try {
    console.log( "connect fonksiyonu")

    if (process.env.MODE === "development") {
     
      await mongoose
        .connect(process.env.DB_URI_DEV, {
          dbName: process.env.DB_NAME_DEV,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then((response) => {
          console.log("db development bağlantısı başarılı:" + process.env.DB_NAME_DEV)
            
        })
        .catch((err) => {
          console.log("yyyy");
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
        })
        
    }
  } catch (error) {
    console.log(error)
  }
  

};

export default connect;

