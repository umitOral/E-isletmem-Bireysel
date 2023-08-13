import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';

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
const getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find().populate(["user","doctor"]).sort({time:1})

        res.status(200).json({
            sessions: sessions,
            
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "api hatası"
        })
    }
}
const getSingleDaySessions = async (req, res) => {
    try {
        
        const sessions = await Session.find({date:req.params.date}).populate(["user","doctor"]).sort({time:1})

        res.status(200).json({
            sessions: sessions
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "api hatası"
        })
    }
}

export {getAllUsers,getAllSessions,getSingleDaySessions}