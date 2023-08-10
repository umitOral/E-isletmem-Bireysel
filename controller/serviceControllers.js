import Service from '../models/serviceModel.js';


const addService = async (req, res) => {
    try {


        const services = await Service.create(req.body)


        res.redirect("back")

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}
const getSingleServicePage = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)

        res.status(200).render("operation-details", {
            service
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}
const editService = async (req, res) => {
    try {
        let activeorNot = Boolean
        if (req.body.activeorNot === "0") {
            activeorNot = true
        } else {
            activeorNot = false
        }
        await Service.findByIdAndUpdate(req.params.id, {
            serviceName: req.body.serviceName,
            servicePrice: req.body.servicePrice,
            activeorNot: activeorNot
        })

        res.redirect("../")

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}


export { addService, getSingleServicePage, editService }