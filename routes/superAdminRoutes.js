import express from 'express';
import {getSuperAdminPage,getSuperAdminTicketsPage} from '../controller/pageController.js';
import {deleteCompany} from '../controller/companyControllers.js';
import {answerTicket} from '../controller/ticketController.js';

const router=express.Router()


router.route("/").get(getSuperAdminPage)
router.route("/tickets").get(getSuperAdminTicketsPage)
router.route("/tickets/answerTicket/:id").get(answerTicket)
router.route("/companies/delete/:id").get(deleteCompany)







export default router