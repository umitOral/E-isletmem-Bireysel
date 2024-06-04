import express from "express";
import {
  getSexStaticsWithFilter,
  getNewUserStaticswithFilter,
  getPaymentStaticsWithFilter,
} from "../controller/staticsController.js";

import {
  getEmployeessStaticsPage,
  getAppointmentsStaticsPage,
  getPaymentStaticsPage,
  getUsersStaticsPage,
} from "../controller/pageController.js";

const router = express.Router();

router.route("/payment-statics/").get(getPaymentStaticsPage);
router.route("/users-statics/").get(getUsersStaticsPage);
router.route("/employees-statics/").get(getEmployeessStaticsPage);
router.route("/appointments-statics/").get(getAppointmentsStaticsPage);
router.route("/getSexStaticsWithFilter").get(getSexStaticsWithFilter);
router
  .route("/getNewUserStaticswithFilter")
  .get(getNewUserStaticswithFilter);
router
  .route("/getPaymentStaticsWithFilter")
  .get(getPaymentStaticsWithFilter);

export default router;
