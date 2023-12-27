
import express from 'express';
import {getAllSessions,getAllUsers,getSingleDayAllDoctorSessions,getDaysFullorNot} from '../controller/apicontrollers.js';


const router=express.Router()


router.route("/getAllUsers").get(getAllUsers)
router.route("/:userID/getAllSessions").get(getAllSessions)


router.route("/getSingleDayAllDoctorSessions/:date").get(getSingleDayAllDoctorSessions)
router.route("/getDaysFullorNot/:date").get(getDaysFullorNot)





//static apı's




export default router
