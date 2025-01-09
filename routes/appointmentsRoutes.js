import express from 'express';
import {getAppointment,updateAppointment,createAppointment,updateStateAppointment, resizeAppointment, changeAppointmentStatus} from '../controller/appointmentControllers.js';
import { checkSmsActive } from '../middlewares/smsMiddleware.js';
import { checkPriviliges } from '../middlewares/authMiddleware.js';
import { sendReminderSms } from '../controller/smsControllers.js';

const router =express.Router()


router.route("/createAppointment").post(createAppointment)
router.route("/:id/changeAppointmentStatus").post(changeAppointmentStatus)
router.route("/:id/getAppointment").get(getAppointment)
router.route("/:id/updateStateAppointment").get(updateStateAppointment)
router.route("/:id/updateAppointment").post(updateAppointment)
router.route("/:id/resizeAppointment").post(resizeAppointment)
router.route("/:id/sendReminderSms").post(checkPriviliges("sms_single_send"),checkSmsActive(),sendReminderSms)






export default router