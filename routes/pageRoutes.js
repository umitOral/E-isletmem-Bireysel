import express from 'express';
import {getIndexPage,getLoginPage,getRegisterPage,getContactPage,getAboutUsPage,getServicesPage} from '../controller/pageController.js';
import {createCompany, createUser,loginUser} from '../controller/userController.js';
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




export default router