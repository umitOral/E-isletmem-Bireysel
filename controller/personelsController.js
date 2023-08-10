import User from '../models/userModel.js';

const createPersonel = async (req, res) => {
    try {
        const data = req.body
        data.role = "doctor"
        
        const user = await User.create(data)


        res.redirect("back")

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}

export { createPersonel }