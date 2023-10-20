import express from 'express';
import {getSuperAdminPage} from '../controller/pageController.js';
import {deleteCompany} from '../controller/companyControllers.js';

const router=express.Router()


router.route("/").get(getSuperAdminPage)
router.route("/companies/delete/:id").get(deleteCompany)







export default router