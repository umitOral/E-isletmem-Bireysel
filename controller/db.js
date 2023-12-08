import mongoose from "mongoose";

const connect = async() => {
  await mongoose
    .connect(process.env.DB_URI, {
      dbName: "e-isletmem_dev",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((response) => console.log("db bağlantısı başarılı"))
    .catch((err=>console.log(err)));
};

export default connect;
