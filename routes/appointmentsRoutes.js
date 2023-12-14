import express from 'express';
import {getAppointment,updateAppointment,createAppointment,deleteAppointment,updateStateAppointment} from '../controller/appointmentControllers.js';

const router =express.Router()


router.route("/createAppointment").post(createAppointment)
router.route("/:id/deleteAppointment").get(deleteAppointment)
router.route("/:id/getAppointment").get(getAppointment)
router.route("/:id/updateStateAppointment").get(updateStateAppointment)
router.route("/:id/updateAppointment").post(updateAppointment)





export default router