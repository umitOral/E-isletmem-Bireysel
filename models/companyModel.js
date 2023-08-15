import mongoose from 'mongoose';
import bcrypt from 'bcrypt';




const Schema = mongoose.Schema
const companySchema = new Schema({
    
    authorizedName: { type: String, require: true },
    companyName: { type: String, require: false },
    email: { type: String, require: true },
    
    password: { type: String, require: false },
    phone: { type: String, require: false },
    address: { type: String, require: false },
    billingAddress: { type: String, require: false },
    registerDate: { type: Date, default: Date.now },
    notes: { type: String, require: false },
    debtStatus: { type: Number, require: 0 },
    doctors: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]

})

companySchema.pre('save', function (next) {
    const company = this
    bcrypt.hash(company.password, 10, (err, hash) => {
        company.password = hash
        next()
    });


});




const Company = mongoose.model("Company", companySchema)
export default Company