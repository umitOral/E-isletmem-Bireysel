import express from 'express';
import {resetPasswordPage,getIndexPage,getLoginPage,getRegisterPage,getContactPage,getAboutUsPage,getServicesPage,getForgotPasswordPage} from '../controller/pageController.js';
import {createCompany,loginUser,resetPasswordMail} from '../controller/userController.js';
import {sendMail} from '../controller/mailControllers.js';


const router =express.Router()

router.route("/").get(getIndexPage)
router.route("/contactus").get(getContactPage)
router.route("/about-us").get(getAboutUsPage)
router.route("/our-services").get(getServicesPage)
router.route("/login").get(getLoginPage)
router.route("/register").get(getRegisterPage)
router.route("/register").post(createCompany,sendMail)
router.route("/login").post(loginUser)

router.route("/forgotPassword").get(getForgotPasswordPage)
router.route("/forgotPassword").post(resetPasswordMail)

router.route("/newPassword/:token").get(resetPasswordPage)






export default router