import express from "express";
import {
  companyPaymentPage,
  companyPaymentsListPage,
  getSettingsPage,
  getAdminPage,
  getSantralPage,
  getUsersPage,
  getAppointmentsPage,
  getUserDetailsPage,
  getSingleEmployeePage,
  getEmployeeSelfPage,
  getservicesPage,
  getProductsPage,
  getAllProductsPage,
  getSmsPage,
  getEmployeesPage,
  getPaymentsPage,
  getDatasPage,
} from "../controller/pageController.js";
import {
  logOut,
  createUser,
  deletePhoto,
  addOperation,
  addDiscountToOperation,
  addOperationInsideAppointment,
  getUsersOldOperations,
  addDataToOperation,
  deleteOperation,
  getSessionsofOperation,
  uploadPictures,
  getAllPhotos,
  getUsersAllPayments,
  getUsersContinueOperations,
  getUsersPlannedOperations,
  getUsersHasPaymentOperations,
  getUsersAllOperations,
  editInformations,
  findUser,
  sendSingleSmsController,
  findSingleUser,
  findEmployees,
  deactivateEmployee,
  activateEmployee,
  getUsersAllAppointments,
  getUsersAllSms,
  updateUserNotifications,
  getUserNotifications,
} from "../controller/userController.js";
import {
  createEmployees,
  editInformationsEmployees,
  getEmployesAppointments,
  getEmployeePermissions,
  getEmployeesPayments,
  updateEmployeesPermissions,
  getEmployeeNotifications,
  updateEmployeeNotifications,
} from "../controller/employeesController.js";

import {
  addService,
  editService,
  findServices,
  activateService,
  deactivateService,
} from "../controller/serviceControllers.js";
import {
  addProduct,searchProduct,addPassiveProduct,editProduct,addStock,fixStock,searchProductInner,searchProductName,updateComission
} from "../controller/productControllers.js";
import {
  addSmsTemplate,
  activateSmsTemplate,
  deactivateSmsTemplate,
  editSmsTemplate,
  getSmsDetails,sendReminderSms
} from "../controller/smsControllers.js";

import {
  topluIslemler,addbulkproducttoGeneral
} from "../controller/admincontrollers.js";

import {
  addData,
  addOptiontoData,
  deleteOptionofData,
  editOptionofData,
  getData,
  deleteOption,
} from "../controller/dataController.js";
import {
  addPayment,
  deletePayment,
  getSinglePayment,
  getSearchedPayments,
  addExpense,
  editPayment,
} from "../controller/paymentsControllers.js";

import {
  updateCompanyPassword,
  updateCompanyInformations,
  updateSmsConfig,
  updateCompanyDocs,
  addCompanyPayment,
  updateCompanyNotification,
  addEmployeeToSubscription,
} from "../controller/companyControllers.js";
import {
  updateSessionStatus,
  updateSessionStatusForNew,
  updateOperationStatus,
  deleteOperationsData,
  deleteSessionData,
  editDataofOperation,
  editDataOfSession,
  addSessionToOperation,
  addDescriptiontoSession,
  addDescriptiontoOperation,
  addDataToSessionInsideAppointment,
} from "../controller/operationController.js";

import { verifyRoles, checkPriviliges, checkEmployee, checkBillingInformations, checkEmployeeLimit } from "../middlewares/authMiddleware.js";


import appointmentsRoutes from "./appointmentsRoutes.js";
import reportsRoutes from "./reportsRoutes.js";
import staticsRoutes from "./staticsRoutes.js";
import { checkSmsActive, checksmsBalance } from "../middlewares/smsMiddleware.js";

const router = express.Router();

router.route("/").get(getAdminPage);
router.route("/santral/:companyId/:phone").get(getSantralPage);
router.route("/adminControllers/addbulkproducttoGeneral").get(addbulkproducttoGeneral);
router.route("/adminControllers/topluIslemler").get(topluIslemler);

router.route("/users").get(checkPriviliges("user_view"), getUsersPage);
router.route("/users/sendSingleSms").post(checkPriviliges("sms_single_send"),checkSmsActive(),checksmsBalance(1), sendSingleSmsController);


router.route("/users/findUser").post(checkPriviliges("user_view"), findUser);
router
  .route("/users/search/findSingleUser")
  .get(checkPriviliges("user_view"), findSingleUser);
router.route("/users/:id").get(checkPriviliges("user_view"), getUserDetailsPage);
router
  .route("/users/:id/uploadpictures")
  .post(checkPriviliges("user_update"), uploadPictures);
  router
  .route("/users/:id/updateUserNotifications")
  .post(updateUserNotifications);
router.route("/users/:id/getUsersAllAppointments").get(getUsersAllAppointments);
router.route("/users/:id/getUsersAllSms").get(getUsersAllSms);

// employee routes
router
  .route("/users/:id/deactivateEmployee")
  .get(checkPriviliges("employee_update"), deactivateEmployee);
router
  .route("/users/:id/activateEmployee")
  .get(checkPriviliges("employee_update"),checkEmployeeLimit(),activateEmployee);

router.route("/users/:id/addOperation").post(addOperation);
router
  .route("/users/:id/addDiscountToOperation/:operationID")
  .post(addDiscountToOperation);
router
  .route("/users/:userId/addOperationInsideAppointment")
  .post(addOperationInsideAppointment);
router.route("/users/:id/deleteOperation/:operationId").get(deleteOperation);
router.route("/users/:id/getSessionsofOperation/:operationId").get(getSessionsofOperation);

router.route("/users/:id/getAllPhotos/:operationId").get(getAllPhotos);
router.route("/users/:id/getUsersAllPayments").get(getUsersAllPayments);

router.route("/users/:id/getUsersAllOperations").get(getUsersAllOperations);
router.route("/users/:id/getUsersOldOperations").get(getUsersOldOperations);
router
  .route("/users/:id/getUsersContinueOperations")
  .get(getUsersContinueOperations);
router
  .route("/users/:id/getUsersPlannedOperations")
  .post(getUsersPlannedOperations);
router
  .route("/users/:id/getUsersHasPaymentOperations")
  .get(getUsersHasPaymentOperations);
router.route("/users/:id/deletePhoto/:operationid/:photoid").get(deletePhoto);
router.route("/users/:id/editInformations").post(editInformations);
router
  .route("/users/:id/getUserNotifications")
  .get(getUserNotifications);
router.route("/users/createUser").post(createUser);

router
  .route("/operations/:operationID/updateSessionStatus/:sessionID")
  .post(updateSessionStatus);
router
  .route("/operations/updateSessionStatusForNew/:userId")
  .post(updateSessionStatusForNew);
router
  .route("/operations/:operationID/updateOperationStatus")
  .post(updateOperationStatus);
router
  .route("/operations/:operationID/addSessionToOperation")
  .post(addSessionToOperation);
router
  .route("/operations/:operationID/addDescriptiontoOperation")
  .post(addDescriptiontoOperation);
router
  .route("/operations/:operationID/addDescriptiontoSession/:sessionID")
  .post(addDescriptiontoSession);
router
  .route("/operations/:operationID/addDataToOperation")
  .post(addDataToOperation);
router
  .route(
    "/operations/:operationID/addDataToSessionInsideAppointment/:sessionID"
  )
  .post(addDataToSessionInsideAppointment);
router
  .route("/operations/:operationID/deleteDataOperation/:operationDataID")
  .get(deleteOperationsData);
router
  .route("/operations/:operationID/deleteSessionData/:sessionID/:sessionDataID")
  .get(deleteSessionData);
router
  .route("/operations/:operationID/editDataofOperation/:operatioDataID")
  .post(editDataofOperation);
router
  .route("/operations/:operationID/editDataofSession/:sessionID/:sessionDataID")
  .post(editDataOfSession);

router.route("/payments").get(getPaymentsPage);
router.route("/payments/getSearchedPayments").get(getSearchedPayments);
router.route("/payments/:id").get(getSinglePayment);
router.route("/payments/:id/deletePayment").get(deletePayment);
router.route("/payments/:id/editPayment").post(editPayment);
router.route("/payments/addPayment").post(addPayment);
router.route("/payments/addExpense").post(addExpense);

router.route("/companyPaymentPage").get(companyPaymentPage);

router.route("/companyPaymentsList").get(companyPaymentsListPage);

router.route("/addCompanyPayment").post(checkBillingInformations,addCompanyPayment);
router.route("/addEmployeeToSubscription").post(addEmployeeToSubscription);

router.route("/updateCompanyNotification").post(updateCompanyNotification);

router.route("/employeeSelf/:id").get(checkEmployee,getEmployeeSelfPage);

router.route("/employees").get(checkPriviliges("employee_view"),getEmployeesPage);
router
  .route("/employees/:id").get(checkPriviliges("employee_view"),getSingleEmployeePage);
router
  .route("/employees/:id/getEmployeePermissions")
  .get(getEmployeePermissions);
  router
  .route("/employees/:id/getEmployeeNotifications")
  .get(getEmployeeNotifications);
  router
  .route("/employees/:id/updateEmployeeNotifications")
  .post(updateEmployeeNotifications);
router
  .route("/employees/:id/getEmployeesPayments")
  .get(getEmployeesPayments);
router
  .route("/employees/:id/updateEmployeesPermissions")
  .post(updateEmployeesPermissions);
router
  .route("/employees/:employeesID/getEmployesAppointments")
  .get(getEmployesAppointments);

router.route("/employees/search").get(findEmployees);
router.route("/employees/createEmployee").post(checkEmployeeLimit(),createEmployees);

// router.route("/employees/addPermissions").post(addPermissions)
router.route("/employees/:id/editInformations").post(editInformationsEmployees);

router.route("/appointments").get(getAppointmentsPage);


router.route("/logout").get(logOut);

router.route("/services/").get(checkPriviliges("service_view"), getservicesPage);
router.route("/services/search").get(checkPriviliges("service_view"), findServices);

router.route("/products/").get(checkPriviliges("product_view"), getProductsPage);
router.route("/products/:productId/editProduct").post(checkPriviliges("product_edit"), editProduct);
router.route("/products/:productId/addStock").post(checkPriviliges("product_edit"), addStock);
router.route("/products/:productId/fixStock").post(checkPriviliges("product_edit"), fixStock);
router.route("/products/:productId/updateComission").post(checkPriviliges("product_edit"), updateComission);
router.route("/allProducts/").get(checkPriviliges("product_view"), getAllProductsPage);
router.route("/products/addProduct").post(checkPriviliges("product_add"), addProduct);
router.route("/products/searchProduct").post(checkPriviliges("product_add"), searchProduct);
router.route("/products/searchProductName").post(checkPriviliges("product_add"), searchProductName);
router.route("/products/searchProductInner").post(searchProductInner);
router.route("/products/addPassiveProduct").post(checkPriviliges("product_add"), addPassiveProduct);


router.route("/sms").get(checkPriviliges("sms_view"), getSmsPage);
router.route("/sms/addSmsTemplate").post(checkPriviliges("sms_add"), addSmsTemplate);
router.route("/sms/sendReminderSms").post(checkPriviliges("sms_single_send"),checkSmsActive(),checksmsBalance(1), sendReminderSms);
router.route("/sms/:id/activateSmsTemplate").get(checkPriviliges("sms_update"), activateSmsTemplate);
router.route("/sms/:id/deactivateSmsTemplate").get(checkPriviliges("sms_update"), deactivateSmsTemplate);
router.route("/sms/:id/editSmsTemplate").post(checkPriviliges("sms_update"), editSmsTemplate);

router.route("/sms/:packageId/getSmsDetails").post(getSmsDetails);



router.route("/services/:id/editService").post(checkPriviliges("service_update"), editService);
router.route("/services/:id/deactivateService").get(checkPriviliges("service_update"), deactivateService);
router.route("/services/:id/activateService").get(checkPriviliges("service_update"), activateService);
router.route("/services/addService").post(checkPriviliges("service_add"), addService);

router.route("/datas/").get(checkPriviliges("data_view"), getDatasPage);
router.route("/datas/:dataID").get(checkPriviliges("data_view"), getData);
router.route("/datas/addOptiontoData/:id").post(checkPriviliges("option_add"), addOptiontoData);
router.route("/datas/deleteOptionofData/:id/:optionName").get(checkPriviliges("option_add"), deleteOptionofData);
router.route("/datas/editOption/:dataId/:optionName").post(checkPriviliges("data_update"), editOptionofData);
router.route("/datas/deleteOption/:dataID/:operationID").get(checkPriviliges("data_delete"), deleteOption);
router.route("/datas/addData").post(checkPriviliges("data_add"), addData);

router
  .route("/settings/")
  .get(checkPriviliges("settings_view"), getSettingsPage);
router
  .route("/settings/:id/updateCompanyPassword")
  .post(checkPriviliges("settings_update"), updateCompanyPassword);
router
  .route("/settings/:id/updateCompanyInformations")
  .post(checkPriviliges("settings_update"), updateCompanyInformations);
router
  .route("/settings/:id/updateSmsConfig")
  .post(checkPriviliges("settings_update"), updateSmsConfig);
router
  .route("/settings/:id/:docKey/updateCompanyDocs")
  .post(checkPriviliges("settings_update"), updateCompanyDocs);

router.use(
  "/appointments",
  checkPriviliges("appointment_view"),
  appointmentsRoutes
);
router.use(
  "/reports",
  checkPriviliges("reports_view"),
  reportsRoutes
);

router.use("/statics", checkPriviliges("statics_view"), staticsRoutes)


export default router;
