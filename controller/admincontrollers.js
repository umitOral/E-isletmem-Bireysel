import User from "../models/userModel.js";
const topluIslemler = async (req, res, next) => {
  try {

    console.log("admin operations");
    await User.find({sex:{$ne:"female"}}).then((response) => {
      res
        .status(200)
        .json({
          success: true,
          message: "deneme işlemi",
          total:response.length,
          data: response,
        })
        .catch((err) => {
          res.status(401).json({
            success: true,
            message: "başarısız",
            data: err,
          });
        });
    });

    // let barcode = Number(req.body.barcode)
    // let productModel = await getProductModelGeneral()
    // await productModel.findOne({ $or: [{ upc: barcode }, { ean: barcode }] })
    //   .then(response => {
    //     if (response) {
    //       console.log("burasıyy")
    //       res.status(200).json({
    //         success: true,
    //         message: "içerden sorgulandı",
    //         data: response
    //       })
    //     } else {
    //       console.log("burasıxx")

    //       axios.get(`https://api.vapi.co/products`, {
    //         headers: { Authorization: `Bearer NBpQS2bZ6aizi13S8KM37wKRFLpuUWvih`},
    //         // params:{name:"urofen"}
    //       })
    //         .then(function (response) {
    //           console.log(response.data);
    //           // response.data.items[0].productName=response.data.items[0].title

    //             productModel.insertMany(response.data.data)
    //             // productModel.insertMany(response.data.data)

    //           res.status(200).json({
    //             success: true,
    //             message: "dışardan sorgulandı",
    //             data: response.data
    //           })

    //         })
    //         .catch(function (error) {
    //           console.log("errrrrro")
    //            console.log(error.response.data);
    //         })
    //     }
    //   })
    //   .catch(err => {

    //   })
  } catch (error) {
    res.json({
      success: false,
      message: "ürün bulunurken bir sorun oluştu",
      error: error,
    });
  }
};

export { topluIslemler };
