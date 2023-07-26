import mongoose from 'mongoose';
import bcrypt from 'bcrypt';




const Schema = mongoose.Schema
const userSchema = new Schema({
    name: { type: String, require: true },
    surname: { type: String, require: true },
    email: { type: String, require: true },
    sex: { type: String, require: false },
    birtdhDate: { type: Date, require: false },
    role: { type: String, default: "customer" },
    password: { type: String, require: false },
    phone: { type: String, require: false },
    company: { type: String, require: false },
    address: { type: String, require: false },
    billingAddress: { type: String, require: false },
    registerDate: { type: Date, default: Date.now },
    notes: { type: String, require: false },
    debtStatus: { type: Number, require: 0 },
    images: [{
       
        description:String,
        url:String,
        uploadTime:Number
    }],
    related: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }


})

userSchema.pre('save', function (next) {
    const user = this
    bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash
        next()
    });


});




const User = mongoose.model("User", userSchema)
export default User