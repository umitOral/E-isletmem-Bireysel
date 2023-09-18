import Session from '../models/sessionModel.js';
import Company from '../models/companyModel.js';

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



export { updateCompany }