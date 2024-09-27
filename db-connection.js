import mongoose from "mongoose";
const mongoOptions={
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex:true,
}
const connect=async (url) => {
    return new Promise(async (resolve,reject) => {
        const connection= await mongoose.createConnection(url,mongoOptions).asPromise();
        resolve(connection)
    })
    
}

export {
    connect
}