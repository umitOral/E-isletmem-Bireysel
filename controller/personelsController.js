import User from '../models/userModel.js';
import Company from '../models/companyModel.js';

const createPersonel = async (req, res) => {
    try {
        const data = req.body
        data.role = "doctor"
        data.company=res.locals.user._id
        
        const user = await User.create(data)
        

        await Company.updateOne({ _id: res.locals.user._id },
            {
                $push: {
                    "doctors": user

                }
            })
        


        res.redirect("back")

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}

export { createPersonel }