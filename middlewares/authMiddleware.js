
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Company from '../models/companyModel.js';

const checkUser = async (req, res, next) => {

    const token = req.cookies.jsonwebtoken

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.locals.user = null
                next()
            } else {
                const company = await Company.findById(decodedToken.userID)
                res.locals.user = company
                next()
                
            }
        })
    } else {
        res.locals.user = null
        next()
        console.log("başarısız token")
    }

}

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.jsonwebtoken

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, err => {
                if (err) {
                    res.redirect("login")
                } else {
                    next()
                }
            })
        } else {
            res.redirect("login")
        }
    } catch (error) {
        res.status(401).json({
            succes: false,
            message: "yetkisizlikten gelen hata"
        })
    }
}

export { authenticateToken, checkUser }