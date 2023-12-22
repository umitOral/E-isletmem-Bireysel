
import express from 'express';
import {getAllUsers,getSingleDayAllDoctorSessions,newPassword} from '../controller/apicontrollers.js';


const router=express.Router()


router.route("/getAllUsers").get(getAllUsers)


router.route("/getSingleDayAllDoctorSessions/:date").get(getSingleDayAllDoctorSessions)
router.route("/newPassword/:token").post(newPassword)




//static apı's




export default router
