import mongoose from "mongoose";
import bcrypt from "bcrypt";
import randombytes from "randombytes";
import jwt from "jsonwebtoken";

const Schema = mongoose.Schema;
const companySchema = new Schema(
  {
    brandName: { type: String, require: true,lowercase: true},
    companyName: { type: String, require: false,lowercase: true},
    email: { type: String, require: true, index: { unique: true },lowercase: true},

    password: {
      type: String,
      require: true,
      minLength: [4, "şifre uzunluğu en az 4 karakter olmalıdır."],
    },
    phone: { type: String},
    address: { type: String ,lowercase:true },
    billingAddress: { type: String, lowercase:true },
    registerDate: { type: Date, default: Date.now },
    notes: { type: String, require: false,lowercase:true},
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
    serviceDatas: [
      {
        dataName: { type:String, lowercase: true, trim: true },
        dataOptions:[{type:String,lowercase:true, trim:true}]
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
    sms: [
      {
        smsName: {
          type: String,
        },
        activeorNot: { type: Boolean, default: true },
        content:String,
      },
    ],
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

// companySchema.methods.createResetPasswordToken = function (companyEmail) {
//   const resetToken = jwt.sign({ companyEmail }, process.env.JWT_SECRET, {
//     expiresIn: "60m",
//   });
//   console.log(resetToken)
//   this.passwordResetToken = resetToken;
//   this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; //10 minutes

//   return resetToken;
// };

const Company = mongoose.model("Company", companySchema);
export default Company;
