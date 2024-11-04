import express from 'express';
import {getSuperAdminPage,getSuperAdminTicketsPage} from '../controller/pageController.js';
import {getCompanyDocs,updateDocStatus,getCompanySmsActive,updateSmsStatus} from '../controller/superAdminController.js';

import {answerTicket} from '../controller/ticketController.js';

const router=express.Router()


router.route("/").get(getSuperAdminPage)
router.route("/getCompanyDocs/:companyId").get(getCompanyDocs)
router.route("/getCompanySmsActive/:companyId").get(getCompanySmsActive)
router.route("/updateSmsStatus/:companyId/:docId").post(updateSmsStatus)
router.route("/updateDocStatus/:companyId/:docId").post(updateDocStatus)
router.route("/tickets").get(getSuperAdminTicketsPage)
router.route("/tickets/answerTicket/:id").get(answerTicket)








export default router