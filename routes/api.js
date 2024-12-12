
import express from 'express';
import {getAllUsers,getSingleDayAllDoctorSessions,getAllAppointmentofSingleDoctor,getDaysFullorNot,oldOperationAddProved, newOperationAddProved} from '../controller/apicontrollers.js';


const router=express.Router()


router.route("/getAllUsers").get(getAllUsers)



router.route("/getSingleDayAllDoctorSessions/:date").get(getSingleDayAllDoctorSessions)
router.route("/getAllAppointmentofSingleDoctor/:date").get(getAllAppointmentofSingleDoctor)
router.route("/getDaysFullorNot/:date").get(getDaysFullorNot)
router.route("/oldOperationAddProved/:appointmentId/:operationId").get(oldOperationAddProved)
router.route("/newOperationAddProved/:appointmentId/:userId").post(newOperationAddProved)





//static apı's




export default router
