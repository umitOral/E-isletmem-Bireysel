
import express from 'express';
import {getAllUsers,getAllSessions,getSingleDaySessions} from '../controller/apicontrollers.js';

const router=express.Router()


router.route("/getAllUsers").get(getAllUsers)
router.route("/getAllSessions").get(getAllSessions)
router.route("/getSingleDaySessions/:date").get(getSingleDaySessions)


export default router
