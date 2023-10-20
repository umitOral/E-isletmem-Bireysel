import Session from '../models/sessionModel.js';
import Company from '../models/companyModel.js';
import {CustomError} from '../helpers/error/CustomError.js';

const updateCompany = async (req, res) => {
    try {
        console.log(req.body)


        const company = await Company.findByIdAndUpdate(req.params.id,
            req.body)

        res.redirect("back")

    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: "create session error"
        })
    }
}
const errorTest = (req, res,next) => {
    return next(new SyntaxError("yyyy hatası",400))
    
}

const deleteCompany = async (req, res) => {
    try {
       


        const company = await Company.findByIdAndDelete(req.params.id)

        
        res.redirect("back")

    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: "create session error"
        })
    }
}



export { updateCompany,deleteCompany,errorTest }