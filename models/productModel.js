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






const User = mongoose.model("User", userSchema)
export default User