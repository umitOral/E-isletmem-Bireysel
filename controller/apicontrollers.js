import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';
import { populate } from 'dotenv';

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


        const doctors = res.locals.user.doctors

        const sessionsAllDoctor = []
        

        for (const i of doctors) {
            const sessionsofdoctor = await Session.find({ date: req.params.date, doctor: i}).populate(["user", "doctor"]).sort({ time: 1 })
            
            sessionsAllDoctor.push({doctorName:i.name,sessionsofdoctor:sessionsofdoctor})
            
        }
        



        res.status(200).json({
            sessionsAllDoctor: sessionsAllDoctor
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "api hatası"
        })
    }
}

export { getAllUsers, getSingleDaySessions, getSingleDaySingleDoctorSessions }