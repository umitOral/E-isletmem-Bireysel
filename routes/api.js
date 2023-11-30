
import express from 'express';
import {getAllUsers,getSingleDaySessions,getSingleDaySingleDoctorSessions,newPassword} from '../controller/apicontrollers.js';


const router=express.Router()


router.route("/getAllUsers").get(getAllUsers)

router.route("/getSingleDaySessions/:date").get(getSingleDaySessions)
router.route("/getSingleDaySingleDoctorSessions/:date").get(getSingleDaySingleDoctorSessions)
router.route("/newPassword/:token").post(newPassword)




//static apı's




export default router
