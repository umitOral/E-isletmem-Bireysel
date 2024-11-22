
import Payment from '../models/paymentsModel.js';

const getCheckOutReport = async (company) => {
     
  let endDate = new Date();
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  startDate.setHours(24, 0, 0);
  endDate.setHours(24, 0, 0);
  

  const payments = await Payment.find({
    company:company._id,
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  }).populate("fromUser", ["name", "surname"]);

  let totalIncome = 0;
  let totalExpenses = 0;
  let totalCashForExpenses = 0;
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
      
      if (payment.cashOrCard === "nakit") {
        totalCashForExpenses += payment.totalPrice;
      } else {
        totalExpenses += payment.totalPrice;
      }
    }
  });

  netCash = totalCash - totalCashForExpenses * -1;

  return {
    succes: true,
    message: "başarılı",
    payments: payments,
    totalIncome,
    totalExpenses,
    totalCash,
    totalCreditCard,
    netCash,
    date:startDate
  };

   
  };

  export {getCheckOutReport}