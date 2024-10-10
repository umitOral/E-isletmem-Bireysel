import express from 'express';
import { getAppointmentReportsPage,getUserReportsPage } from "../controller/pageController.js";
import { getUserReports,getAppointmentReports} from "../controller/reportController.js";


const router =express.Router()


router.route("/appointmentReportsPage").get(getAppointmentReportsPage)
router.route("/userReportsPage").get(getUserReportsPage)
router.route("/userReportsPage").post(getUserReports)
router.route("/appointmentsReportsPage").post(getAppointmentReports)





export default router