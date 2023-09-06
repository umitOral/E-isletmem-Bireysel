import User from '../models/userModel.js';
import Payment from '../models/paymentsModel.js';

const getSexStatics = async (req, res) => {
    try {
        const manCount = await User.count({}).where({ sex: "erkek" })
        const womanCount = await User.count({}).where({ sex: "kadın" })
        const cashCount = await Payment.count({}).where({ cashOrCard: "Nakit" })
        const creditCardCount = await Payment.count({}).where({ cashOrCard: "Kredi Kartı" })

        res.status(200).json({
            sexstatics: [womanCount, manCount],
            paymentstatics: [cashCount, creditCardCount]

        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error
        })
    }
}
const getStaticswithFilter = async (req, res) => {
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
            company: res.locals.user._id,
            registerDate: {
                $gte: startDate,
                $lte: endDate
            }
        })


        const womanCount = await User.count({
            sex: "kadın",
            company: res.locals.user._id,
            registerDate: {
                $gte: startDate,
                $lte: endDate
            }
        })


        const cashCount = await Payment.count({
            cashOrCard: "Nakit",
            company: res.locals.user._id,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        })
        const creditCardCount = await Payment.count({
            cashOrCard: "Kredi Kartı",
            company: res.locals.user._id,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        })
        



        res.status(200).json({
            succes: true,
            sexStatics: [womanCount, manCount],
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
    getSexStatics, getStaticswithFilter
}