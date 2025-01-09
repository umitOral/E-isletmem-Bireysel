import express from 'express';
import { getAppointmentReportsPage,getUserReportsPage,paymentReportsPage,productReportsPage,getSmsReportsPage} from "../controller/pageController.js";
import { getUserReports,getAppointmentReports,getPaymentReports,getProductReports,getSmsReports,sendBulkSmsController} from "../controller/reportController.js";
import { checkSmsActive, checksmsBalance } from '../middlewares/smsMiddleware.js';
import { checkPriviliges } from '../middlewares/authMiddleware.js';



const router =express.Router()


router.route("/appointmentReportsPage").get(getAppointmentReportsPage)
router.route("/paymentReportsPage").get(paymentReportsPage)
router.route("/productReportsPage").get(productReportsPage)
router.route("/userReportsPage").get(getUserReportsPage)
router.route("/getSmsReportsPage").get(getSmsReportsPage)


router.route("/userReportsPage").post(getUserReports)
router.route("/sendBulkSms").post(checkPriviliges("sms_single_send"),checkSmsActive(),checksmsBalance(),sendBulkSmsController)
router.route("/getSmsReports").post(getSmsReports)
router.route("/appointmentsReportsPage").post(getAppointmentReports)
router.route("/paymentsReportsPage").post(getPaymentReports)
router.route("/getProductReports").post(getProductReports)





export default router