import mongoose from 'mongoose';


const Schema = mongoose.Schema
const sessionSchema = new Schema({
    
    date:{type:Date},
    time: {
        type:Object,
        index:{
            type:Number,
            default:0
        },
        value:{
            type:String,
            default:""
        }
        
    },
    
    timepicker:{
        type:String
    },
    
    description: { type: String },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    doctor: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    
    services: [{
        type: String,

    }]

})




const Session = mongoose.model("Session", sessionSchema)
export default Session