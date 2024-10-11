import { CustomError } from "../helpers/error/CustomError.js";
import Operation from "../models/OperationsModel.js";
import Payment from "../models/paymentsModel.js";


const addPayment = async (req, res,next) => {
  try {
    req.body.company = res.locals.company._id;
    await Payment.create(req.body)
      .then((response) => {
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
      })
      .catch((err) => {
        return new CustomError(err);
      });

    res.status(200).json({
      success: true,
      message: "Ödeme kaydedildi",
    });
  } catch (error) {
   
  }
};

const addExpense = async (req, res,next) => {
  try {
    req.body.company = res.locals.company._id;
    req.body.totalPrice = req.body.totalPrice * -1;
    console.log(req.body);
    const payment = await Payment.create(req.body);

    res.redirect("back");
  } catch (error) {
    return next(
      new CustomError("bilinmeyen hata", 500, error)
    );
  }
};

const getSinglePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("fromUser", ["name", "surname"])
      .populate("operations");
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
  } catch (error) {
};
}

const editPayment = async (req, res, next) => {
  try {
    console.log(req.body)
    let requestPayments = req.body.operations.map((item) => item.operationId);
    let payment = await Payment.findById(req.body.paymentId);
    let paymentOperations = payment.operations;
    let requestedPayment;


    for (const operation of paymentOperations) {
      let indexcontrol = requestPayments.findIndex(
        (item) => item === operation.operationId.toString()
      );

      let foundedOperation = await Operation.findById(operation.operationId);

      let indexcontrol2 = foundedOperation.payments.findIndex(
        (item) => item === req.body.paymentId
      );

      console.log(indexcontrol);
      if (indexcontrol === -1) {
        paymentOperations.splice(indexcontrol2, 1);
        let totalPrice = paymentOperations
          .map((item) => item.paymentValue)
          .reduce((a, b) => a + b);

        foundedOperation.payments.splice(indexcontrol2, 1);
        foundedOperation.paidValue =
          foundedOperation.paidValue - operation.paymentValue;
        await foundedOperation.save();

        await Payment.findByIdAndUpdate(req.body.paymentId, {
          $pull: { operations: { operationId: operation.operationId } },
        });

        console.log(totalPrice);
        await Payment.findByIdAndUpdate(req.body.paymentId, {
          $set: { totalPrice: totalPrice,description:req.body.description,cashOrCard:req.body.cashOrCard},
        }).then(response=>requestedPayment=response);
      } else {
        // let _id = new mongoose.Types.ObjectId(req.body.paymentId);

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

        await Payment.findByIdAndUpdate(
          req.body.paymentId,
          {
            $set: {
              "operations.$[operation].paymentValue":
                req.body.operations[indexcontrol].paymentValue,
                description:req.body.description,cashOrCard:req.body.cashOrCard
            },
          },
          {
            arrayFilters: [{ "operation._id": operation._id }],
            new: true,
          }
        );

        let modifiedPayment = await Payment.findById(req.body.paymentId);
        modifiedPayment.totalPrice = modifiedPayment.operations
          .map((item) => item.paymentValue)
          .reduce((a, b) => a + b);
        await modifiedPayment.save();
        requestedPayment=modifiedPayment
      }
    }


    res.json({
      success: true,
      message: "ödeme düzenlendi.",
      data:requestedPayment
    });
  } catch (error) {return next(
    new CustomError("bilinmeyen hata", 500, error)
  );
  }
};
const getSearchedPayments = async (req, res, next) => {
  try {
    console.log(req.query)
    function toDateInputValue(dateObject) {
      const local = new Date(dateObject);
      local.setMinutes(
        dateObject.getMinutes() + dateObject.getTimezoneOffset()
      );
      return local;
    }
    let endDate=new Date(req.query.endDate)
    let startDate=new Date(req.query.startDate)
    startDate.setDate(startDate.getDate()-1)
    startDate.setHours(24,0,0)
    endDate.setHours(24,0,0)
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
        totalExpenses += payment.totalPrice;
      }
    });

    netCash = totalCash - totalExpenses * -1;

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
    return next(
      new CustomError("bilinmeyen hata", 500, error)
    );
  }
};

export {
  addPayment,
  deletePayment,
  getSearchedPayments,
  addExpense,
  editPayment,
  getSinglePayment,
}
