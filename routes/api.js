
import express from 'express';
import {getAllUsers} from '../controller/apicontrollers.js';

const router=express.Router()


router.route("/getAllUsers").get(getAllUsers)


export default router
