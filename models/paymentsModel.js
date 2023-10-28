import mongoose from 'mongoose';


const Schema = mongoose.Schema
const paymentSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    fromUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    value: {
        type: Number,
        require: true
    },
    cashOrCard: {
        type: String,
        default:"Nakit"
    },
    description: {
        type: String
    }
    

},
{ timestamps: true }
)






const Payment = mongoose.model("Payment", paymentSchema)
export default Payment