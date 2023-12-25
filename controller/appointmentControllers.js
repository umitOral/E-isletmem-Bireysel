import Session from '../models/sessionModel.js';

const createAppointment = async (req, res) => {
    try {
        console.log(req.body)
        console.log("burası")
        
        req.body.startHour = new Date(`${req.body.date},${req.body.startHour}`);
        req.body.endHour = new Date(`${req.body.date},${req.body.endHour}`);
        
        req.body.date = new Date(req.body.date);

        console.log(req.body.endHour)

        const session=await Session.create(req.body)
        
        res.status(200).json({
            success:true,
            message:"randevu başarıyla eklenmiştir"
        })
        
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "create session error"
        })
    }
}

const deleteAppointment = async (req, res) => {
    try {

        const session=await Session.findByIdAndDelete(req.params.id)
        res.json({
            succes:true,
            message:"Seans Başarıyla Silindi"
        })
        
    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: "delete session error"
        })
    }
}
const updateStateAppointment = async (req, res) => {
    try {

        const session=await Session.findByIdAndUpdate(req.params.id,{
            state:req.query.state
        })
        
        res.json({
            succes:true,
            message:"Seans durumu değişti",
            data:req.query.state
        })
        
    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: "Sunucuda bir hata yaşandı lütfen tekrar deneyiniz"
        })
    }
}
const updateAppointment= async (req, res) => {
    try {
        console.log("uptt")
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
const getAppointment= async (req, res) => {
    try {
        
        const session=await Session.findById(req.params.id).populate("user")
        
        res.json({
            succes:true,
            data:session
        })
        
    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: "update session error"
        })
    }
}


export { getAppointment,createAppointment,deleteAppointment,updateStateAppointment,updateAppointment}