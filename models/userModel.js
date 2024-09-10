import mongoose from 'mongoose';
import bcrypt from 'bcrypt';




const Schema = mongoose.Schema
const userSchema = new Schema({
    name: { type: String, require: [true,"isim bilgisi gereklidir"],trim:true},
    surname: { type: String, require: [true,"soyisim bilgisi gereklidir"],trim:true},
    activeOrNot:{type:Boolean,default:true},
    email: { type: String, },
    sex: { type: String, require: false },
    birtdhDate: { type: Date, require: false },
    role: { type: String, default: "customer" },
    password: { type: String, require: false },
    phone: { type: String, require: true,unique:[true,"telefon bilgisi gereklidir"] },
    userCompany: { type: String, default:""},
    address: { type: String, require: false },
    billingAddress: { type: String, require: false },
    notes: { type: String, require: false },
    debtStatus: { type: Number, require: 0 },
    images: [{
        description:String,
        url:String,
        public_id:String,
        uploadTime:Number
    }],
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    }


},
{
    timestamps:true
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