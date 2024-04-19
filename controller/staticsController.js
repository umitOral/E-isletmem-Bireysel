import User from '../models/userModel.js';
import Payment from '../models/paymentsModel.js';
import {CustomError} from '../helpers/error/CustomError.js';



const getSexStaticsWithFilter = async (req, res,next) => {
    try {
        console.log(req.query)
        let startDate = new Date(req.query.startDate)
        let endDate = new Date(req.query.endDate)
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(0, 0, 0, 0)
        let day = endDate.getDate()
        endDate.setDate(day + 1)

        // console.log("startDate::" + startDate)
        // console.log("enddate::" + endDate)
        console.log(res.locals)
        const manCount = await User.count({
            sex: "male",
            company: res.locals.company._id,
            registerDate: {
                $gte: startDate,
                $lte: endDate
            }
        })


        const womanCount = await User.count({
            sex: "female",
            company: res.locals.company._id,
            registerDate: {
                $gte: startDate,
                $lte: endDate
            }
        })
        
        res.json({
            success:true,
            message: "cinsiyet istatistikleri başarıyla çekildi",
            sexStatics: [womanCount, manCount]
        })
        

    } catch (error) {
        return next(new CustomError("bilinmeyen hata", 500, error));
    }
}
const getNewUserStaticswithFilter = async (req, res,next) => {
    try {
        const users = await User.count({
            company: res.locals.company._id,
            registerDate: {
                $gte: startDate,
                $lte: endDate
            }
        })
        res.json({
            succes:true,
            data:users,
            message:"istatistikler başarıyla çekildi."
        })
        

    } catch (error) {
        return next(new CustomError("bilinmeyen hata", 500, error));
    }
}
const getPaymentStaticsWithFilter = async (req, res,next) => {
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
            message:"kasa istatistikleri çekildi",
            paymentstatics: [cashCount, creditCardCount]
        })


    } catch (error) {
        return next(new CustomError("bilinmeyen hata", 500, error));
    }
}

export {
    getPaymentStaticsWithFilter, getSexStaticsWithFilter,getNewUserStaticswithFilter
}