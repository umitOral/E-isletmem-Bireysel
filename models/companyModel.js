import mongoose from "mongoose";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import { DOC_STATUS } from "../config/status_list.js";

const Schema = mongoose.Schema;
const companySchema = new Schema(
  {
    brandName: { type: String, require: true, lowercase: true },
    companyName: { type: String, require: false, lowercase: true },
    email: {
      type: String,
      require: true,
      index: { unique: true },
      lowercase: true,
    },

    password: {
      type: String,
      require: true,
      minLength: [4, "şifre uzunluğu en az 4 karakter olmalıdır."],
    },
    phone: { type: String },
    address: { type: String, lowercase: true },
    billingAddress: { type: String, lowercase: true },
    registerDate: { type: Date, default: Date.now },
    notes: { type: String, require: false, lowercase: true },
    debtStatus: { type: Number, require: 0 },
    employees: [
      {
        type: Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    workHours: {
      type: Object,
      workStart: {
        type: String,
      },
      workEnd: {
        type: String,
      },
      workPeriod: {
        type: Number,
      },
      default: {
        workStart: "08:00",
        workEnd: "18:00",
        workPeriod: 15,
      },
    },

    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    plan: {
      type: String,
      enum: ["deneme", "premium", "hediye"],
      default: "deneme",
    },
    subscribeEndDate: { type: Date, default: null },

    activeOrNot: { type: Boolean, default: true },
    smsConfig: {
      userName: String,
      password: String,
      smsTitle: String,
    },
    serviceDatas: [
      {
        dataName: { type: String, lowercase: true, trim: true },
        dataOptions: [{ type: String, lowercase: true, trim: true }],
      },
    ],
    services: [
      {
        serviceName: {
          type: String,
        },
        servicePrice: { type: Number },
        activeorNot: { type: Boolean, default: true },
        serviceData: [],
      },
    ],
    smsActive: {
      type: Boolean,
      default: false,
    },
    notifications:[],
    smsTemplates: [
      {
        smsName: {
          type: String,
        },
        type:{type:String, enum:["general","system","reminder"],default:"general"},
        activeorNot: { type: Boolean, default: true },
        content: { type: String },
      },
    ],
    companyDocs: [
      {
        docKey: String,
        mimetype: String,
        status: {
          type: String,
          default: DOC_STATUS.WAITING,
        },
        key: String,
        url: String,
        public_id: String,
      },
    ],
    smsBalance:{type:Number,default:0}
  },
  
  { timestamps: true }
);

companySchema.pre("save", function (next) {
  const company = this;
  bcrypt.hash(company.password, 10, (err, hash) => {
    company.password = hash;
    next();
  });
});

companySchema.pre("findOneAndUpdate", async function (next) {

  const update = this.getUpdate();
  const passwordChange = update["$set"]["smsConfig.password"];
 

  // console.log(update['$set']['smsConfig.userName']);

  if (update && passwordChange) {
    console.log("xx");
    let hashedPassword = CryptoJS.AES.encrypt(
      update["$set"]["smsConfig.password"],
      process.env.JWT_SECRET
    ).toString();

    update["$set"]["smsConfig.password"] = hashedPassword;
  }
  next();
});

const Company = mongoose.model("Company", companySchema);
export default Company;
