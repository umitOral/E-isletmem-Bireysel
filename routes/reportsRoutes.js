import express from 'express';
import { getAppointmentReportsPage,getUserReportsPage,paymentReportsPage} from "../controller/pageController.js";
import { getUserReports,getAppointmentReports,getPaymentReports} from "../controller/reportController.js";


const router =express.Router()


router.route("/appointmentReportsPage").get(getAppointmentReportsPage)
router.route("/paymentReportsPage").get(paymentReportsPage)

router.route("/userReportsPage").get(getUserReportsPage)
router.route("/userReportsPage").post(getUserReports)
router.route("/appointmentsReportsPage").post(getAppointmentReports)
router.route("/paymentsReportsPage").post(getPaymentReports)





export default router