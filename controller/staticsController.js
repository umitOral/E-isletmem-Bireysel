import User from '../models/userModel.js';
import Payment from '../models/paymentsModel.js';



const getSexStaticsWithFilter = async (req, res) => {
    try {

        let startDate = new Date(req.query.startDate)
        let endDate = new Date(req.query.endDate)
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(0, 0, 0, 0)
        let day = endDate.getDate()
        endDate.setDate(day + 1)

        // console.log("startDate::" + startDate)
        // console.log("enddate::" + endDate)
        
        const manCount = await User.count({
            sex: "erkek",
            company: res.locals.company._id,
            registerDate: {
                $gte: startDate,
                $lte: endDate
            }
        })


        const womanCount = await User.count({
            sex: "kadın",
            company: res.locals.company._id,
            registerDate: {
                $gte: startDate,
                $lte: endDate
            }
        })
        
        res.json({
            link:"statics",
            message: "sex_statics",
            sexStatics: [womanCount, manCount]
        })
        

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}
const getNewUserStaticswithFilter = async (req, res) => {
    try {

       
        
        res.json({
            succes:"true"
        })
        

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}
const getPaymentStaticsWithFilter = async (req, res) => {
    try {

        let startDate = new Date(req.query.startDate)
        let endDate = new Date(req.query.endDate)
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(0, 0, 0, 0)
        let day = endDate.getDate()
        endDate.setDate(day + 1)

        const cashCount = await Payment.count({
            cashOrCard: "Nakit",
            company: res.locals.company._id,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        })
        const creditCardCount = await Payment.count({
            cashOrCard: "Kredi Kartı",
            company: res.locals.company._id,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        })

        res.status(200).json({
            succes: true,
            paymentstatics: [cashCount, creditCardCount]
        })


    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}

export {
    getPaymentStaticsWithFilter, getSexStaticsWithFilter,getNewUserStaticswithFilter
}