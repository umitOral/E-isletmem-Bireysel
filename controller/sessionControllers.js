import Session from '../models/sessionModel.js';

const createSession = async (req, res) => {
    try {
        console.log(req.body)
        
        req.body.state="bekleniyor"
        
        const session=await Session.create(req.body)
        console.log(req.body)
        res.redirect("back")
        
    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: "create session error"
        })
    }
}
const deleteSession = async (req, res) => {
    try {

        const session=await Session.findByIdAndDelete(req.params.id)
        res.json({
            succes:true,
            message:"session deleted"
        })
        
    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: "delete session error"
        })
    }
}
const updateStateSession = async (req, res) => {
    try {

        const session=await Session.findByIdAndUpdate(req.params.id,{
            state:req.query.state
        })
        
        res.json({
            succes:true,
            message:"state değişti"
        })
        
    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: "create session error"
        })
    }
}
const updateSession = async (req, res) => {
    try {
        console.log(req.body)
        const session=await Session.findByIdAndUpdate(req.params.id,req.body)
        
        res.json({
            succes:true,
            message:"randevu bilgileri değişti"
        })
        
    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: "update session error"
        })
    }
}


export { createSession,deleteSession,updateStateSession,updateSession}