import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema
const productSchema = new Schema({
    name: { type: String, require: true },
    activeOrNot:{type:Boolean,default:true},
    price:{type:Number},
    qr:{type:String},
    images: [{
        url:String,
        public_id:String,
        uploadTime:Number
    }],
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