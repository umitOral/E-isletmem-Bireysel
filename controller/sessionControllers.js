import Session from '../models/sessionModel.js';

const createSession = async (req, res) => {
    try {
        await Session.create(req.body)
        res.redirect("back")
        console.log(req.body)
    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: "pagecontroller"
        })
    }
}

export { createSession }