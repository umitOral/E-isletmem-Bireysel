
import express from 'express';
import {getAllUsers,getSingleDaySessions,getSingleDaySingleDoctorSessions} from '../controller/apicontrollers.js';
import {getSexStatics} from '../controller/staticsController.js';

const router=express.Router()


router.route("/getAllUsers").get(getAllUsers)

router.route("/getSingleDaySessions/:date").get(getSingleDaySessions)
router.route("/getSingleDaySingleDoctorSessions/:date").get(getSingleDaySingleDoctorSessions)

//static apı's
router.route("/getSexStatics").get(getSexStatics)



export default router
