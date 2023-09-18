import express from 'express';
import {updateSession,createSession,deleteSession,updateStateSession} from '../controller/sessionControllers.js';

const router =express.Router()


router.route("/createsession").post(createSession)
router.route("/:id/deletesession").get(deleteSession)
router.route("/:id/updateStateSession").get(updateStateSession)
router.route("/:id/updateSession").post(updateSession)





export default router