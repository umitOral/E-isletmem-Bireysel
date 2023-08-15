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

const getSingleDaySessions = async (req, res) => {
    try {

        const sessions = await Session.find({ date: req.params.date }).populate(["user", "doctor"]).sort({ time: 1 })
        console.log(req.params.date)
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
const getSingleDaySingleDoctorSessions = async (req, res) => {
    try {

        
        const doctors=res.locals.user.doctors
        
        let sessions={}
        
        
        for (const doctor of doctors) {
            const sessionsofdoctor = await Session.find({ date: req.params.date,doctor:doctor }).populate(["user", "doctor"]).sort({ time: 1 })
            const doctorname=doctor.name
            console.log(doctorname)
            // sessions.push({doctorname:sessionsofdoctor});
            Object.assign(sessions,sessionsofdoctor)
        }

        

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

export { getAllUsers, getSingleDaySessions, getSingleDaySingleDoctorSessions }