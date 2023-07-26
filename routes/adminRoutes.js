import express from 'express';
import {getAdminPage,getUsersPage,getSessionsPage,getStaticsPage,getSettingsPage,getSinglePage,getservicesPage} from '../controller/pageController.js';
import {logOut,createUser,uploadPictures,editInformations,findUser,deleteUser} from '../controller/userController.js';

import {addService} from '../controller/serviceControllers.js';
import sesssionRoutes from './sessionRoutes.js';

const router=express.Router()



router.route("/").get(getAdminPage)
router.route("/users").get(getUsersPage)
router.route("/users/search").get(findUser)
router.route("/users/:id").get(getSinglePage)
router.route("/users/:id/deleteUser").get(deleteUser)
router.route("/users/:id/uploadpictures").post(uploadPictures)
router.route("/users/:id/editInformations").post(editInformations)

router.route("/sessions").get(getSessionsPage)
router.route("/statics").get(getStaticsPage)
router.route("/settings").get(getSettingsPage)
router.route("/logout").get(logOut)
router.route("/addUser").post(createUser)

router.route("/services").get(getservicesPage)
router.route("/services/addService").post(addService)

router.use("/sessions",sesssionRoutes)

export default router