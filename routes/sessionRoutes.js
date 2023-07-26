import express from 'express';
import {createSession} from '../controller/sessionControllers.js';

const router =express.Router()


router.route("/createsession").post(createSession)




export default router