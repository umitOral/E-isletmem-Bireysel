
import express from 'express';
import {getAllSessions,getAllUsers,getSingleDayAllDoctorSessions} from '../controller/apicontrollers.js';


const router=express.Router()


router.route("/getAllUsers").get(getAllUsers)
router.route("/:userID/getAllSessions").get(getAllSessions)


router.route("/getSingleDayAllDoctorSessions/:date").get(getSingleDayAllDoctorSessions)





//static apı's




export default router
