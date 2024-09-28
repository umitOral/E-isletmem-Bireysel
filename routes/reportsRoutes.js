import express from 'express';
import { getAppointmentReportsPage } from "../controller/pageController.js";


const router =express.Router()


router.route("/appointmentReportsPage").get(getAppointmentReportsPage)




export default router