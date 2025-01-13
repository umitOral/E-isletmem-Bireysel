import express from 'express';
import {resetPasswordPage,getIndexPage,getPricesPage,kvkkPage,getLoginPage,getRegisterPage,privacyPoliciesPage,returnPoliciesPage,getContactPage,getAboutUsPage,getTermOfUsePage,getServicesPage,getForgotPasswordPage} from '../controller/pageController.js';
import {loginUser,resetPasswordMail} from '../controller/userController.js';
import {handlePaymentCallback,createCompany,handlePaymentResult} from '../controller/companyControllers.js';
import {smsStatus} from '../controller/smsControllers.js';
import {contactEmail} from '../controller/mailControllers.js';
import {newPassword} from '../controller/apicontrollers.js';
import * as authMiddleware from '../middlewares/authMiddleware.js'
import { verifyRecaptcha,checkPassword,verifyCompanyUniqueness} from "../helpers/recaptchaVerify.js";



const router =express.Router()

router.route("/").get(getIndexPage)
router.route("/contactus").get(getContactPage)
router.route("/about-us").get(getAboutUsPage)
router.route("/term-of-use").get(getTermOfUsePage)
router.route("/our-services").get(getServicesPage)
router.route("/return-policies").get(returnPoliciesPage)
router.route("/privacy-policies").get(privacyPoliciesPage)
router.route("/kvkk").get(kvkkPage)
router.route("/prices").get(getPricesPage)

router.route("/login").get(getLoginPage)
router.route("/register").get(getRegisterPage)
router.route("/register").post(verifyCompanyUniqueness,checkPassword,verifyRecaptcha,createCompany)
router.route("/login").post( authMiddleware.verifyactiveOrNot(),loginUser)

router.route("/forgotPassword").get(getForgotPasswordPage)
router.route("/newPassword/:token").get(resetPasswordPage)
router.route("/forgotPassword").post(resetPasswordMail)
router.route("/newPassword/:token").post(newPassword)

router.route("/handlePaymentCallback").post(handlePaymentCallback)
router.get("/payment-result", handlePaymentResult);
router.get('/result', (req, res) => {
    res.render('front/payment-result');
  });
router.route("/smsStatus").post(smsStatus)

router.route("/contactEmail").post(verifyRecaptcha,contactEmail)






export default router