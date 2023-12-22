import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const Schema = mongoose.Schema
const employeeSchema = new Schema({
    name: { type: String, require: true },
    surname: { type: String, require: true },
    activeOrNot:{type:Boolean,default:true},
    email: { type: String, require: true },
    sex: { type: String, require: false },
    birtdhDate: { type: Date, require: false },
    role: { type: Object },
    password: { type: String, require: false },
    phone: { type: String, require: false },
    address: { type: String, require: false },
    registerDate: { type: Date, default: new Date()},
    notes: { type: String, require: false },
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    }

})

employeeSchema.pre('save', function (next) {
    const employee = this
    bcrypt.hash(employee.password, 10, (err, hash) => {
        employee.password = hash
        next()
    });


});




const Employee = mongoose.model("Employee", employeeSchema)
export default Employee