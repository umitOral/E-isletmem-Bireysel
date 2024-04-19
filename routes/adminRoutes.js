import express from 'express';
import {companyPaymentPage,companyPaymentsListPage,getSettingsPage,getAdminPage,getUsersPage,deneme,getAppointmentsPage,getEmployeessStaticsPage,getAppointmentsStaticsPage,getPaymentStaticsPage,getUsersStaticsPage,getUserPage,getSingleEmployeePage,getservicesPage,getEmployeesPage,getPaymentsPage,getDatasPage} from '../controller/pageController.js';
import {logOut,createUser,deletePhoto,addOperation,addDiscountToOperation,addOperationInsideAppointment,getUsersOldOperations,addDataToOperation,deleteOperation,uploadPictures,getAllPhotos,getUsersAllPayments,getUsersContinueOperations,getUsersPlannedOperations,getUsersHasPaymentOperations,getUsersAllOperations,editInformations,findUsers,findSingleUser,findEmployees,deactivateEmployee,activateEmployee,getUsersAllSessions} from '../controller/userController.js';
import {createEmployees,editInformationsEmployees} from '../controller/employeesController.js';

import {addService,editService,findServices,activateService,deactivateService} from '../controller/serviceControllers.js';
import {addData,addOptiontoData,editOptionofData,getData,deleteOption} from '../controller/dataController.js';
import {addPayment,deletePayment,getSinglePayment,getSearchedPayments,addExpense,editPayment} from '../controller/paymentsControllers.js';
import {getSexStaticsWithFilter,getPaymentStaticsWithFilter,getNewUserStaticswithFilter} from '../controller/staticsController.js';
import {updateCompanyPassword,updateCompanyInformations,addCompanyPayment} from '../controller/companyControllers.js';
import {updateSessionStatus,updateOperationStatus,deleteOperationsData,deleteSessionData,editDataofOperation,editDataOfSession,addSessionToOperation,addDescriptiontoSession,addDescriptiontoOperation,addDataToSessionInsideAppointment} from '../controller/operationController.js'

import {verifyRoles} from '../middlewares/authMiddleware.js';
import {ROLES_LIST} from '../config/status_list.js'
import appointmentsRoutes from './appointmentsRoutes.js';

const router=express.Router()


router.route("/").get(getAdminPage)
router.route("/deneme").get(deneme)
router.route("/users").get(getUsersPage)


router.route("/users/search").get(findUsers)
router.route("/users/search/findSingleUser").get(findSingleUser)
router.route("/users/:id").get(getUserPage)
router.route("/users/:id/getUsersAllSessions").get(getUsersAllSessions)

router.route("/users/:id/deactivateEmployee").get(deactivateEmployee)
router.route("/users/:id/activateEmployee").get(activateEmployee)
router.route("/users/:id/uploadpictures").post(uploadPictures)
router.route("/users/:id/addOperation").post(addOperation)
router.route("/users/:id/addDiscountToOperation/:operationID").post(addDiscountToOperation)
router.route("/users/:id/addOperationInsideAppointment").post(addOperationInsideAppointment)
router.route("/users/:id/deleteOperation/:operationId").get(deleteOperation)

router.route("/users/:id/getAllPhotos/:operationId").get(getAllPhotos)
router.route("/users/:id/getUsersAllPayments").get(getUsersAllPayments)


router.route("/users/:id/getUsersAllOperations").get(getUsersAllOperations)
router.route("/users/:id/getUsersOldOperations").get(getUsersOldOperations)
router.route("/users/:id/getUsersContinueOperations").get(getUsersContinueOperations)
router.route("/users/:id/getUsersPlannedOperations").post(getUsersPlannedOperations)
router.route("/users/:id/getUsersHasPaymentOperations").get(getUsersHasPaymentOperations)
router.route("/users/:id/deletePhoto/:operationid/:photoid").get(deletePhoto)
router.route("/users/:id/editInformations").post(editInformations)
router.route("/users/createUser").post(createUser)

router.route("/operations/:operationID/updateSessionStatus/:sessionID").post(updateSessionStatus)
router.route("/operations/:operationID/updateOperationStatus").post(updateOperationStatus)
router.route("/operations/:operationID/addSessionToOperation").post(addSessionToOperation)
router.route("/operations/:operationID/addDescriptiontoOperation").post(addDescriptiontoOperation)
router.route("/operations/:operationID/addDescriptiontoSession/:sessionID").post(addDescriptiontoSession)
router.route("/operations/:operationID/addDataToOperation").post(addDataToOperation)
router.route("/operations/:operationID/addDataToSessionInsideAppointment/:sessionID").post(addDataToSessionInsideAppointment)
router.route("/operations/:operationID/deleteDataOperation/:operationDataID").get(deleteOperationsData)
router.route("/operations/:operationID/deleteSessionData/:sessionID/:sessionDataID").get(deleteSessionData)
router.route("/operations/:operationID/editDataofOperation/:operatioDataID").post(editDataofOperation)
router.route("/operations/:operationID/editDataofSession/:sessionID/:sessionDataID").post(editDataOfSession)


router.route("/payments").get(getPaymentsPage)
router.route("/payments/getSearchedPayments").get(getSearchedPayments)
router.route("/payments/:id").get(getSinglePayment)
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

router.route("/datas/").get(getDatasPage)
router.route("/datas/:dataID").get(getData)

router.route("/datas/addOptiontoData/:id").post(addOptiontoData)
router.route("/datas/editOption/:dataId/:optionName").post(editOptionofData)
router.route("/datas/deleteOption/:dataID/:operationID").get(deleteOption)

router.route("/datas/addData").post(addData)

router.route("/settings/").get(getSettingsPage)
router.route("/settings/:id/updateCompanyPassword").post(updateCompanyPassword)
router.route("/settings/:id/updateCompanyInformations").post(updateCompanyInformations)

router.use("/appointments",appointmentsRoutes)

export default router