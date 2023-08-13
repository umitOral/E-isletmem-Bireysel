import Session from '../models/sessionModel.js';

const createSession = async (req, res) => {
    try {
        console.log(req.body)
        
        
        const session=await Session.create(req.body)
        console.log(session)
        res.redirect("back")
        
    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: "create session error"
        })
    }
}

export { createSession }