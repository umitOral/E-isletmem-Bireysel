import express from 'express';
import {getIndexPage,getLoginPage,getRegisterPage} from '../controller/pageController.js';
import {createSeller, createUser,loginUser} from '../controller/userController.js';

const router =express.Router()

router.route("/").get(getIndexPage)
router.route("/login").get(getLoginPage)
router.route("/register").get(getRegisterPage)
router.route("/register").post(createSeller)
router.route("/login").post(loginUser)




export default router