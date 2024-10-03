import { connect } from "./db-connection.js";
import mongoose from "mongoose";
const url = "mongodb+srv://umitoral:melekmelekAa_1@cluster.ujtk4to.mongodb.net/?retryWrites=true&w=majority"


let db;

const productSchema = mongoose.Schema({
    drug: { id: Number, name: String },
    // productName: String,
    // price: String,
    // brand: String,
    // name:String,
    // category: String,
    // size:String,
    // color:String,
    // description: String,
    // ean: {type:Number,unique:[true,"bu barkodlu ürün zaten kayıtlıdır."] },
    // elid: Number,
    // upc:{type:Number,unique:[true,"bu barkodlu ürün zaten kayıtlıdır."] },
    // images: [
    //     String
    // ],
    // stock:Number

}, { timestamps: true })



const getTenantDb = async (tenantId) => {
    const dbName = `tenant-${tenantId}`
    db = db ? db : await connect(url)

    let tenantDb = db.useDb(dbName, { useCache: true })
    return tenantDb;
}


const getProductModelGeneral = async (modelName) => {
    const dbName = `general`
    db = db ? db : await connect(url)
    let generalDb = db.useDb(dbName, { useCache: true })
    return generalDb.model(modelName, productSchema)
}
const getProductModel= async (modelName,tenantId) => {
    let tenantDb = await getTenantDb(tenantId)
    return tenantDb.model(modelName, productSchema)
}


export { getProductModel,getProductModelGeneral,productSchema }

