import mongoose from 'mongoose';


const Schema = mongoose.Schema
const sessionSchema = new Schema({
    
    date:{type:Date},
    
    timeIndex: {
            type:Number, 
    },
    timeValue: {
            type:Date, 
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
    }],
    state:{
        type:String,
        default:"Bekleniyor"
    }

})




const Session = mongoose.model("Session", sessionSchema)
export default Session