import express from 'express';
import {companyPaymentPage,companyPaymentsListPage,getSettingsPage,getAdminPage,getUsersPage,getAppointmentsPage,getEmployeessStaticsPage,getAppointmentsStaticsPage,getPaymentStaticsPage,getUsersStaticsPage,getSinglePage,getSingleEmployeePage,getservicesPage,getEmployeesPage,getPaymentsPage} from '../controller/pageController.js';
import {logOut,createUser,deletePhoto,addOrder,uploadPictures,getAllPhotos,getUsersOpenOrders,getUsersAllOrders,editInformations,findUser,findEmployees,deactivateEmployee,activateEmployee} from '../controller/userController.js';
import {createEmployees,editInformationsEmployees} from '../controller/employeesController.js';

import {addService,editService,findServices,activateService,deactivateService} from '../controller/serviceControllers.js';
import {addPayment,deletePayment,getSearchedPayments,addExpense,editPayment} from '../controller/paymentsControllers.js';
import {getSexStaticsWithFilter,getPaymentStaticsWithFilter,getNewUserStaticswithFilter} from '../controller/staticsController.js';
import {updateCompanyPassword,updateCompanyInformations,addCompanyPayment} from '../controller/companyControllers.js';
import {verifyRoles} from '../middlewares/authMiddleware.js';
import ROLES_LIST from '../config/roles_list.js'
import appointmentsRoutes from './appointmentsRoutes.js';

const router=express.Router()


router.route("/").get(getAdminPage)
router.route("/users").get(getUsersPage)


router.route("/users/search").get(findUser)
router.route("/users/:id").get(getSinglePage)
router.route("/users/:id/deactivateEmployee").get(deactivateEmployee)
router.route("/users/:id/activateEmployee").get(activateEmployee)
router.route("/users/:id/uploadpictures").post(uploadPictures)
router.route("/users/:id/addorder").post(addOrder)
router.route("/users/:id/getAllPhotos").get(getAllPhotos)
router.route("/users/:id/getUsersAllOrders").get(getUsersAllOrders)
router.route("/users/:id/getUsersOpenOrders").get(getUsersOpenOrders)
router.route("/users/:id/deletePhoto/:public_id").get(deletePhoto)
router.route("/users/:id/editInformations").post(editInformations)
router.route("/users/createUser").post(createUser)


router.route("/payments").get(getPaymentsPage)
router.route("/payments/getSearchedPayments").get(getSearchedPayments)
router.route("/payments/:id/deletePayment").get(deletePayment)
router.route("/payments/:id/editPayment").post(editPayment)
router.route("/payments/addPayment").post(addPayment)
router.route("/payments/addExpense").post(addExpense)


router.route("/companyPaymentPage").get(companyPaymentPage)
router.route("/companyPaymentsList").get(companyPaymentsListPage)

router.route("/addCompanyPayment").post(addCompanyPayment)


router.route("/employees").get(getEmployeesPage)
router.route("/employees/:id").get(verifyRoles(ROLES_LIST.ADMIN),getSingleEmployeePage)

router.route("/employees/search").get(findEmployees)
router.route("/employees/createEmployee").post(createEmployees)
router.route("/employees/:id/editInformations").post(editInformationsEmployees)

router.route("/appointments").get(getAppointmentsPage)

router.route("/statics/payment-statics/").get(getPaymentStaticsPage)
router.route("/statics/users-statics/").get(getUsersStaticsPage)
router.route("/statics/employees-statics/").get(getEmployeessStaticsPage)
router.route("/statics/appointments-statics/").get(getAppointmentsStaticsPage)
router.route("/statics/getSexStaticsWithFilter").get(getSexStaticsWithFilter)
router.route("/statics/getNewUserStaticswithFilter").get(getNewUserStaticswithFilter)
router.route("/statics/getPaymentStaticsWithFilter").get(getPaymentStaticsWithFilter)

router.route("/logout").get(logOut)


router.route("/services/").get(getservicesPage)
router.route("/services/search").get(findServices)

router.route("/services/:id/editService").post(editService)
router.route("/services/:id/deactivateService").get(deactivateService)
router.route("/services/:id/activateService").get(activateService)
router.route("/services/addService").post(addService)

router.route("/settings/").get(getSettingsPage)
router.route("/settings/:id/updateCompanyPassword").post(updateCompanyPassword)
router.route("/settings/:id/updateCompanyInformations").post(updateCompanyInformations)

router.use("/appointments",appointmentsRoutes)

export default router