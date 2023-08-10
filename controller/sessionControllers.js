import Session from '../models/sessionModel.js';

const createSession = async (req, res) => {
    try {
        console.log(req.body)
        
        // await Session.create(req.body)
        res.redirect("back")
        
    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: "pagecontroller"
        })
    }
}

export { createSession }