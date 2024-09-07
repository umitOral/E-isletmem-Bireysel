
import express from "express";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import fileUpload from "express-fileupload"; ///çoook önemli enctype="multipart/form-data" forma eklenecek
import { v2 as cloudinary } from "cloudinary";
import connect from "./controller/db.js";
import dotenv from "dotenv";
import pageRoute from "./routes/pageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import api from "./routes/api.js";
import { ErrorHandler } from "./middlewares/errorHandlerMiddleware.js";

import * as authMiddleware from "./middlewares/authMiddleware.js";


//dotenv config
dotenv.config();

//app ana yapısı
const app = express();

//db connection
connect()
 

//önemli cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//template engine
app.set("view engine", "ejs");

//body parser çok önemli
app.use(express.json());
//çok önemli form içindeki veriyi almak için
app.use(express.urlencoded({ extended: true }));
//önemli cookie parser
app.use(cookieParser());
// çok önemli put methodunu kullanmak için geçerli
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);
//ÇÇOK ÖNEMLİ DOSYA YüKLEMELERİ İÇİN

app.use(fileUpload({ useTempFiles: true }));

//static files css,js
app.use(express.static("public"));


app.get("/views/front-side/main.ejs");
//routes,middlewares
app.use("/", pageRoute);


app.use("/api", authMiddleware.checkUser, api);

app.use(
  "/admin",
  [
    authMiddleware.authenticateToken,
  authMiddleware.checkUser],
  adminRoutes
);

app.use(
  "/superAdmin",
  authMiddleware.authenticateToken,
  authMiddleware.checkUser,
  superAdminRoutes
);
//error handlers
app.use(ErrorHandler);
app.get("*",(req,res)=>{res.status(404).render("404")})


////////////////////////////////////////////
app.listen(process.env.PORT || 3004, () => {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "application run on " + "http://localhost:" + process.env.PORT
  );
});
