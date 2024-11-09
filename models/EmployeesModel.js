import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const Schema = mongoose.Schema;
const employeeSchema = new Schema({
  name: { type: String, require: true },
  surname: { type: String, require: true },
  activeOrNot: { type: Boolean, default: true },
  email: { type: String, require: true },
  sex: { type: String, require: false },
  birthDate: { type: Date, require: false },
  role: { type: Object },
  password: { type: String, require: false },
  phone: { type: String, require: false },
  address: { type: String, require: false },
  registerDate: { type: Date, default: new Date() },
  notes: { type: String, require: false },
 
  permissions: [
    
  ],
  notifications:[],
  employeeComission:{type:Number,default:0},
  workHours: {
    type: Object,
    workStart: {
      type: String,
    },
    workEnd: {
      type: String,
    },
    default: {
      workStart: "08:00",
      workEnd: "18:00",
    },
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },
});

employeeSchema.pre("save", function (next) {
  const employee = this;
  bcrypt.hash(employee.password, 10, (err, hash) => {
    employee.password = hash;
    next();
  });
});

employeeSchema.methods.createResetPasswordToken = function (employeeEmail) {
  

  const resetToken = jwt.sign( {employeeEmail} , process.env.JWT_SECRET, {
    expiresIn: '1h' ,
  });

  this.passwordResetToken = resetToken;
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; //10 minutes

  return resetToken;
};



const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
