import express from 'express';
import {getAdminPage,getUsersPage,getSessionsPage,getStaticsPage,getSettingsPage,getSinglePage,getservicesPage,getPersonelsPage,getPaymentsPage} from '../controller/pageController.js';
import {logOut,createUser,uploadPictures,editInformations,findUser,deactiveUser} from '../controller/userController.js';
import {createPersonel} from '../controller/personelsController.js';

import {addService,getSingleServicePage,editService} from '../controller/serviceControllers.js';
import {addPayment,deletePayment,getSearchedPayments,addExpense} from '../controller/paymentsControllers.js';
import {getStaticswithFilter} from '../controller/staticsController.js';
import sesssionRoutes from './sessionRoutes.js';

const router=express.Router()



router.route("/").get(getAdminPage)
router.route("/users").get(getUsersPage)
router.route("/users/search").get(findUser)
router.route("/users/:id").get(getSinglePage)
router.route("/users/:id/deactiveUser").get(deactiveUser)
router.route("/users/:id/uploadpictures").post(uploadPictures)
router.route("/users/:id/editInformations").post(editInformations)


router.route("/payments").get(getPaymentsPage)
router.route("/payments/getSearchedPayments").get(getSearchedPayments)
router.route("/payments/:id/deletePayment").get(deletePayment)
router.route("/payments/addPayment").post(addPayment)
router.route("/payments/addExpense").post(addExpense)

router.route("/personels/").get(getPersonelsPage)
router.route("/personels/createPersonel").post(createPersonel)

router.route("/sessions").get(getSessionsPage)
router.route("/statics").get(getStaticsPage)
router.route("/statics/getStaticswithFilter").get(getStaticswithFilter)
router.route("/settings").get(getSettingsPage)
router.route("/logout").get(logOut)
router.route("/addUser").post(createUser)

router.route("/services/").get(getservicesPage)
router.route("/services/:id").get(getSingleServicePage)
router.route("/services/:id/editService").post(editService)
router.route("/services/addService").post(addService)

router.use("/sessions",sesssionRoutes)

export default router