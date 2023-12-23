
import express from 'express';
import {getAllUsers,getSingleDayAllDoctorSessions} from '../controller/apicontrollers.js';


const router=express.Router()


router.route("/getAllUsers").get(getAllUsers)


router.route("/getSingleDayAllDoctorSessions/:date").get(getSingleDayAllDoctorSessions)





//static apı's




export default router
