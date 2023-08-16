import User from "../models/userModel.js"
import Service from "../models/serviceModel.js"
import Sessions from "../models/sessionModel.js"

const getIndexPage = (req, res) => {
    try {
        res.status(200).render("front/index", {
            link: "indexAdmin"
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "pagecontroller"
        })
    }
}

const getLoginPage = (req, res) => {
    try {
        res.status(200).render("login", {
            link: "login"
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "pagecontroller"
        })
    }
}
const getAboutUsPage = (req, res) => {
    try {
        res.status(200).render("front/about-us", {
            link: "about-us"
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "pagecontroller"
        })
    }
}
const getServicesPage = (req, res) => {
    try {
        res.status(200).render("front/our-services", {
            link: "about-us"
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "pagecontroller"
        })
    }
}
const getservicesPage = async (req, res) => {
    try {
        const services = await Service.find()
        res.status(200).render("operations", {
            services,
            link: "services"
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "pagecontroller"
        })
    }
}
const getRegisterPage = (req, res) => {
    try {
        res.status(200).render("register", {
            link: "register"
        })
        res.redirect("indexAdmin")
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "pagecontroller"
        })
    }
}
const getContactPage = (req, res) => {
    try {
        res.status(200).render("front/contact-us", {
            link: "register"
        })
        res.redirect("indexAdmin")
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "pagecontroller"
        })
    }
}
const getAdminPage = (req, res) => {
    try {
        res.status(200).render("indexAdmin", {
            link: "index"
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error
        })
    }
}
const getUsersPage = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "doctor" } }).populate(["images"])

        res.status(200).render("users", {
            users,
            link: "users"
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error
        })
    }
}
const getPersonelsPage = async (req, res) => {
    try {
        const users = await User.find({ role: "doctor" })

        res.status(200).render("personels", {
            users,
            link: "personels"
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error
        })
    }
}

const getSessionsPage = async (req, res) => {
    try {
        
        const doctors = await User.find({ role: "doctor",company:res.locals.user._id}).sort({registerDate:1})
        
        const users = await User.find({ role: "customer" })
        const sessions = await Sessions.find({}).sort({ time: 1 }).populate(["user","doctor"])
        const services = await Service.find({ activeorNot: { $ne: false } })

        res.status(200).render("sessions3", {
            link: "sessions",
            doctors,
            users,
            sessions,
            services

        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error
        })
    }
}
const getStaticsPage = (req, res) => {
    try {
        res.status(200).render("statics", {
            link: "statics"
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error
        })
    }
}
const getSettingsPage = (req, res) => {
    try {
        res.status(200).render("settings", {
            link: "settings"
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error
        })
    }
}
const getSinglePage = async (req, res) => {
    try {
        const singleUser = await User.findById(req.params.id).sort({ uploadTime: 1 })
        res.status(200).render("user-details", {
            singleUser,
            link: "user_details"
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error
        })
    }
}

export { getIndexPage, getLoginPage, getRegisterPage, getContactPage,getAdminPage,getServicesPage, getUsersPage,getAboutUsPage, getSessionsPage, getStaticsPage, getSettingsPage, getSinglePage, getservicesPage, getPersonelsPage }