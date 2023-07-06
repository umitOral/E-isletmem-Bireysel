const mongoose = require("mongoose")
const Schema = mongoose.Schema
const UserSchema = new Schema({
    name: { type: String, require: true },
    surname: { type: String, require: true },
    email: { type: String, require: true },
    sex:{type:String,require:true},
    birtdhDate:{type:Date ,require:false},
    role:{type:String, default:"costumer"},
    password: { type: String, require: false },
    phone: { type: String, require: true },
    company: { type: String, require: false },
    address:{type:String, require:false},
    billingAddress:{type:String, require:false},
    registerDate: { type: Date, default: Date.now },
    notes:{type:String,require:false},
    debtStatus: {type:Boolean,require:true},
    imageURL:{type:Array}
    

})



module.exports = mongoose.model("User", UserSchema)