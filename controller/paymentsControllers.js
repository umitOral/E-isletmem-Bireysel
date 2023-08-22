
import e from 'method-override';
import Payment from '../models/paymentsModel.js';


const addPayment = async (req, res) => {
    try {

        req.body.company = res.locals.user._id
        req.body.date = new Date()

        const payment = await Payment.create(req.body)

        console.log(payment)
        res.redirect("back")


    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}
const addExpense = async (req, res) => {
    try {

        req.body.company = res.locals.user._id
        req.body.date = new Date()
        req.body.value=(req.body.value)*(-1)

        const payment = await Payment.create(req.body)

        console.log(req.body.value)
        res.redirect("back")


    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "addExpense error"
        })
    }
}


const deletePayment = async (req, res) => {
    try {


        const payment = await Payment.findByIdAndDelete(req.params.id)


        res.redirect("back")


    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}
const getSearchedPayments = async (req, res) => {
    try {

        let startDate=new Date(req.query.startDate)
        let endDate=new Date(req.query.endDate)
        startDate.setHours(0,0,0,0)
        endDate.setHours(0,0,0,0)
        let day=endDate.getDate()
        endDate.setDate(day+1)

        // console.log("startDate::" + startDate)
        // console.log("enddate::" + endDate)
        

        const payments = await Payment.find({
            company: res.locals.user._id, createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        })

        let totalIncome = 0
        let totalExpenses = 0
        let totalCash = 0
        let totalCreditCard = 0
        let netCash = 0

        payments.forEach(payment => {
            if (payment.value > 0) {
                totalIncome += payment.value
                if (payment.cashOrCard === "Nakit") {
                    totalCash += payment.value
                } else {
                    totalCreditCard += payment.value
                }
            } else {
                totalExpenses += payment.value
            }

        });

        netCash=totalCash-(-totalExpenses)
        console.log(netCash)
        
       

        res.status(200).json({
            succes: true,
            message: "başarılı",
            payments    : payments,
            totalIncome,
            totalExpenses,
            totalCash,
            totalCreditCard,
            netCash
            


        })


    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}



export { addPayment, deletePayment, getSearchedPayments,addExpense }