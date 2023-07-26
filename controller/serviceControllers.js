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


export {addService }