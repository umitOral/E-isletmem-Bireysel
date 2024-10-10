import Payment from "../models/paymentsModel.js";
const topluIslemler = async (req, res, next) => {
  try {
    console.log("admin operations");
    await Payment.updateMany(
      { cashOrCard: "Nakit" },
      {
        $set:{cashOrCard:"nakit"}
      }
      
    ).then((response) => {
      res.status(200).json({
        success: true,
        message: "toplu işlem başarılı",
        total: response.length,
        data: response,
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
    res.status(400).json({
      success: false,
      message: "ürün bulunurken bir sorun oluştu",
      error: error,
    });
  }
};

export { topluIslemler };
