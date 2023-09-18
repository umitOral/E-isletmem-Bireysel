import mongoose from 'mongoose';


const Schema = mongoose.Schema
const serviceSchema = new Schema({
    
    serviceName: {
        type: String
    },
    servicePrice:{type:Number},
    activeorNot:{type:Boolean,default:true},
    company:{
        type:Schema.Types.ObjectId,
        ref:"company"
    }
    
})




const Service = mongoose.model("Service", serviceSchema)
export default Service