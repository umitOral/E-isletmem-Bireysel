import mongoose from 'mongoose';
const connect=()=>{
    mongoose.connect(process.env.DB_URI,{  
        dbName:"archimet",
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log("mongodb atlas bağlantısı başarılı")
    })
    .catch((err)=>{
        console.log("Db error:"+err)
    })
}

export default connect

