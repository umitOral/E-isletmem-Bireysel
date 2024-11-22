import { CustomError } from "../helpers/error/CustomError.js";
import Operation from "../models/OperationsModel.js";
import Employee from "../models/EmployeesModel.js";
import Payment from "../models/paymentsModel.js";
import Product from "../models/productModel.js";

const addPayment = async (req, res, next) => {
  try {
    console.log(req.body);
    req.body.company = res.locals.company._id;
   
    
      
    if (req.body.fromUser === "") {
      req.body.fromUser = undefined;
    }

    if (req.body.comissionEmployee && req.body.products.length !== 0) {
      console.log("burası")
      const employee = await Employee.findById(req.body.comissionEmployee);
      req.body.products.forEach(element => {
        console.log( "haho")
        console.log(employee||"deneme")
        element.employeeComission=employee.employeeComission
      });
    }

console.log("burası2")
 

    await Payment.create(req.body).then((response) => {
      console.log(response);
      req.body.operations.forEach(async (element) => {
        let foundedOperation = await Operation.findOne({
          _id: element.operationId,
        });

        if (foundedOperation.payments.length !== 0) {
          let totalPayments = foundedOperation.payments.map(
            (item) => item.paymentValue
          );
          let totalPaymentValue =
            totalPayments.reduce((a, b) => a + b) + element.paymentValue;
          console.log(totalPaymentValue);
          if (
            (foundedOperation.operationPrice - foundedOperation.discount) *
              ((100 - foundedOperation.percentDiscount) / 100) ===
            totalPaymentValue
          ) {
            foundedOperation.payments.push({
              paymentId: response._id,
              paymentValue: element.paymentValue,
            });
            foundedOperation.paymentStatus = "ödendi";
          } else {
            foundedOperation.payments.push({
              paymentId: response._id,
              paymentValue: element.paymentValue,
            });
          }
        } else {
          let totalPaymentValue = element.paymentValue;
          if (
            (foundedOperation.operationPrice - foundedOperation.discount) *
              ((100 - foundedOperation.percentDiscount) / 100) ===
            totalPaymentValue
          ) {
            foundedOperation.payments.push({
              paymentId: response._id,
              paymentValue: element.paymentValue,
            });
            foundedOperation.paymentStatus = "ödendi";
          } else {
            foundedOperation.payments.push({
              paymentId: response._id,
              paymentValue: element.paymentValue,
            });
          }
        }
        foundedOperation.paidValue =
          foundedOperation.paidValue + element.paymentValue;
        await foundedOperation.save();
      });
    });


    if (req.body.products.length !== 0) {
      req.body.products.forEach(async (element) => {
        let foundedProduct = await Product.findOne({
          _id: element.productId,
        });

        foundedProduct.totalStock =
          foundedProduct.totalStock - element.quantity;
        await foundedProduct.save();
      });
    }

    res.status(200).json({
      success: true,
      message: "Ödeme kaydedildi",
    });
  } catch (error) {
    console.log(error)
    return new CustomError(error);
  }
};

const addExpense = async (req, res, next) => {
  try {
    req.body.company = res.locals.company._id;
    req.body.totalPrice = req.body.totalPrice * -1;
    console.log(req.body);
    const payment = await Payment.create(req.body);

    res.redirect("back");
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const getSinglePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("fromUser", ["name", "surname"])
      .populate("operations")
      .populate("products.productId");
    const operations = payment.operations.map((element) => element.operationId);

    let operationsDetails = await Operation.find({ _id: operations });
    // while(payment.operations.length!==0){
    //   payment.operations.pop()
    // }

    res.json({
      data: payment,
      operationsDetails: operationsDetails,
      success: true,
      message: "ödeme çekildi",
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

const deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    console.log(payment);
    payment.operations.forEach(async (element) => {
      const operation = await Operation.findById({ _id: element.operationId });
      let index = operation.payments.findIndex(
        (item) => item.paymentId === payment._id
      );
      operation.payments.splice(index, 1);
      operation.paidValue = operation.paidValue - element.paymentValue;
      operation.paymentStatus = "ödenmedi";
      operation.save();
    });

    res.json({
      success: true,
      message: "ödeme silindi",
    });
  } catch (error) {}
};

const editPayment = async (req, res, next) => {
  try {
    console.log(req.body);
    let requestPayments = req.body.operations.map((item) => item.operationId);
    let requestProducts = req.body.products;

    let payment = await Payment.findById(req.body.paymentId);
    payment.description = req.body.description;
    payment.cashOrCard = req.body.cashOrCard;
    let paymentOperations = payment.operations;
    let paymentProducts = payment.products;
    let requestedPayment;

    for (const [i, value] of paymentProducts.entries()) {
      let indexcontrol = requestProducts.findIndex(
        (item) => (item.productId === value.productId.toString())
      );
      
      console.log(i);
      console.log(indexcontrol);
      console.log(value.productId.toString());
      
      

      let foundedProduct = await Product.findById(value.productId);
      
      if (indexcontrol === -1) {
        paymentProducts.splice(i, 1);
        foundedProduct.totalStock = foundedProduct.totalStock + value.quantity;
      } else {
        
        paymentProducts[i] = requestProducts[indexcontrol];
        foundedProduct.totalStock =
          foundedProduct.totalStock +
          value.quantity -
          requestProducts[indexcontrol].quantity;
      }
      await foundedProduct.save();
    }

    for (const [i, operation] of paymentOperations.entries()) {
      let indexcontrol = requestPayments.findIndex(
        (item) => item === operation.operationId.toString()
      );

      let foundedOperation = await Operation.findById(operation.operationId);

      let indexcontrol2 = foundedOperation.payments.findIndex(
        (item) => item === req.body.paymentId
      );

      if (indexcontrol === -1) {
        foundedOperation.payments.splice(indexcontrol2, 1);
        foundedOperation.paidValue =
          foundedOperation.paidValue - operation.paymentValue;
        await foundedOperation.save();

        payment.operations.splice(i, 1);
      } else {
        // operasyon düzenlenmesi
        await Operation.updateOne(
          { _id: operation.operationId },
          {
            $set: {
              "payments.$[elm].paymentValue":
                req.body.operations[indexcontrol].paymentValue,
            },
          },
          {
            arrayFilters: [{ "elm.paymentId": req.body.paymentId }],
            upsert: true,
          }
        );

        // operasyon düzenlendikten sonra operasyon total ödemesi hesaplaması
        let modifiedOperation = await Operation.findById(operation.operationId);
        if (modifiedOperation.payments.length === 0) {
          modifiedOperation.paidValue;
          await modifiedOperation.save();
        } else {
          modifiedOperation.paidValue = modifiedOperation.payments
            .map((item) => item.paymentValue)
            .reduce((a, b) => a + b);
          await modifiedOperation.save();
        }
        // ödemenin düzenlenmesi
        payment.operations[i] = req.body.operations[indexcontrol];
      }
    }
    // calculate total
   
    let totalPriceProducts = 0;
    let totalPriceOperations = 0;
    if (req.body.operations.length !== 0) {
      totalPriceOperations = Number(
        req.body.operations
          .map((item) => item.paymentValue)
          .reduce((a, b) => a + b)
      );
    }
    if (req.body.products.length !== 0) {
      totalPriceProducts = Number(
        req.body.products
          .map((item) => item.paymentValue)
          .reduce((a, b) => a + b)
      );
    }
    console.log(totalPriceOperations)
    console.log(totalPriceProducts)
    payment.totalPrice = totalPriceProducts + totalPriceOperations;

    await payment.save();
    requestedPayment = await Payment.findById(req.body.paymentId)
      .populate("operations.operationId")
      .populate("products.productId");

    console.log("haho2");
    res.json({
      success: true,
      message: "ödeme düzenlendi.",
      data: requestedPayment,
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};
const getSearchedPayments = async (req, res, next) => {
  try {
    
    let endDate = new Date(req.query.endDate);
    let startDate = new Date(req.query.startDate);
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(24, 0, 0);
    endDate.setHours(24, 0, 0);
    // console.log(startDate)
    //  startDate = toDateInputValue(new Date(startDate));

    // let endDate = toDateInputValue(new Date(req.query.endDate));

    console.log(startDate);
    console.log(endDate);
    const payments = await Payment.find({
      company: res.locals.company._id,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("fromUser", ["name", "surname"]);

    let totalIncome = 0;
    let totalExpenses = 0;
    let totalCash = 0;
    let totalCreditCard = 0;
    let totalCashForExpenses = 0;
    let netCash = 0;

    payments.forEach((payment) => {
      if (payment.totalPrice > 0) {
        totalIncome += payment.totalPrice;
        if (payment.cashOrCard === "nakit") {
          totalCash += payment.totalPrice;
        } else {
          totalCreditCard += payment.totalPrice;
        }
      } else {
         
      if (payment.cashOrCard === "nakit") {
        totalCashForExpenses += payment.totalPrice;
      } else {
        totalExpenses += payment.totalPrice;
      }
      }
    });

    netCash = totalCash - totalCashForExpenses * -1;

    res.status(200).json({
      succes: true,
      message: "başarılı",
      payments: payments,
      totalIncome,
      totalExpenses,
      totalCash,
      totalCreditCard,
      netCash,
    });
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

export {
  addPayment,
  deletePayment,
  getSearchedPayments,
  addExpense,
  editPayment,
  getSinglePayment,
};
