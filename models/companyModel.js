import mongoose from "mongoose";
import bcrypt from "bcrypt";
import randombytes from "randombytes";
import jwt from "jsonwebtoken";

const Schema = mongoose.Schema;
const companySchema = new Schema(
  {
    authorizedName: { type: String, require: true },
    companyName: { type: String, require: false },
    email: { type: String, require: true, index: { unique: true } },

    password: {
      type: String,
      require: true,
      minLength: [4, "şifre uzunluğu en az 4 karakter olmalıdır."],
    },
    phone: { type: String, require: false },
    address: { type: String, require: false },
    billingAddress: { type: String, require: false },
    registerDate: { type: Date, default: Date.now },
    notes: { type: String, require: false },
    debtStatus: { type: Number, require: 0 },
    doctors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    workHours: {
      type: Object,
      workStart: {
        type: String,
        default: "8:00",
      },
      workEnd: {
        type: String,
        default: "8:00",
      },
      workPeriod: {
        type: Number,
        default: 15,
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
    services: [
      {
        serviceName: {
          type: String,
        },
        servicePrice: { type: Number },
        activeorNot: { type: Boolean, default: true },
      }
    ]
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

companySchema.methods.createResetPasswordToken = function (companyEmail) {
  const resetToken = jwt.sign({ companyEmail }, process.env.JWT_SECRET, {
    expiresIn: "60m",
  });

  this.passwordResetToken = resetToken;
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; //10 minutes

  return resetToken;
};

const Company = mongoose.model("Company", companySchema);
export default Company;
