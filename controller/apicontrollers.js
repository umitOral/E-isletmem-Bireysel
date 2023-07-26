import User from '../models/userModel.js';

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: res.locals.user._id } })

        res.status(200).json({
            users: users,
            link: "users",
            message: "success"
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "api hatası"
        })
    }
}

export {getAllUsers}