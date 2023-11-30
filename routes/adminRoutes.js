import express from 'express';
import {companyPaymentPage,companyPaymentsListPage,getSettingsPage,getAdminPage,getUsersPage,getSessionsPage,getPersonelsStaticsPage,getAppointmentsStaticsPage,getPaymentStaticsPage,getUsersStaticsPage,getSinglePage,getservicesPage,getPersonelsPage,getPaymentsPage} from '../controller/pageController.js';
import {logOut,addUser,deletePhoto,uploadPictures,editInformations,findUser,findPersonels,deactivateUser,activateUser} from '../controller/userController.js';
import {createPersonel} from '../controller/personelsController.js';

import {addService,editService,findServices,activateService,deactivateService} from '../controller/serviceControllers.js';
import {addPayment,deletePayment,getSearchedPayments,addExpense,editPayment} from '../controller/paymentsControllers.js';
import {getSexStaticsWithFilter,getPaymentStaticsWithFilter,getNewUserStaticswithFilter} from '../controller/staticsController.js';
import {updateCompanyPassword,updateCompanyInformations,addCompanyPayment} from '../controller/companyControllers.js';
import sesssionRoutes from './sessionRoutes.js';

const router=express.Router()



router.route("/").get(getAdminPage)
router.route("/users").get(getUsersPage)


router.route("/users/search").get(findUser)
router.route("/users/:id").get(getSinglePage)
router.route("/users/:id/deactivateUser").get(deactivateUser)
router.route("/users/:id/activateUser").get(activateUser)
router.route("/users/:id/uploadpictures").post(uploadPictures)
router.route("/users/:id/:public_id/deletePhoto").get(deletePhoto)
router.route("/users/:id/editInformations").post(editInformations)


router.route("/payments").get(getPaymentsPage)
router.route("/payments/getSearchedPayments").get(getSearchedPayments)
router.route("/payments/:id/deletePayment").get(deletePayment)
router.route("/payments/:id/editPayment").post(editPayment)
router.route("/payments/addPayment").post(addPayment)
router.route("/payments/addExpense").post(addExpense)


router.route("/companyPaymentPage").get(companyPaymentPage)
router.route("/companyPaymentsList").get(companyPaymentsListPage)
router.route("/addCompanyPayment").post(addCompanyPayment)


router.route("/personels").get(getPersonelsPage)
router.route("/personels/search").get(findPersonels)
router.route("/personels/createPersonel").post(createPersonel)

router.route("/sessions").get(getSessionsPage)

router.route("/statics/payment-statics/").get(getPaymentStaticsPage)
router.route("/statics/users-statics/").get(getUsersStaticsPage)
router.route("/statics/personels-statics/").get(getPersonelsStaticsPage)
router.route("/statics/appointments-statics/").get(getAppointmentsStaticsPage)
router.route("/statics/getSexStaticsWithFilter").get(getSexStaticsWithFilter)
router.route("/statics/getNewUserStaticswithFilter").get(getNewUserStaticswithFilter)
router.route("/statics/getPaymentStaticsWithFilter").get(getPaymentStaticsWithFilter)

router.route("/logout").get(logOut)
router.route("/addUser").post(addUser)

router.route("/services/").get(getservicesPage)
router.route("/services/search").get(findServices)

router.route("/services/:id/editService").post(editService)
router.route("/services/:id/deactivateService").get(deactivateService)
router.route("/services/:id/activateService").get(activateService)
router.route("/services/addService").post(addService)

router.route("/settings/").get(getSettingsPage)
router.route("/settings/:id/updateCompanyPassword").post(updateCompanyPassword)
router.route("/settings/:id/updateCompanyInformations").post(updateCompanyInformations)

router.use("/sessions",sesssionRoutes)

export default router