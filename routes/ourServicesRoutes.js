import express from "express";
import { getGelirGiderYonetimiPage, getHastaYonetimiPage, getOurServicesPage, getPersonelYonetimiPage, getRandevuYonetimiPage, getRaporYonetimiPage, getSmsYonetimiPage, getUrunHizmetYonetimiPage } from "../controller/pageController.js";



const router = express.Router();
router.route("/").get(getOurServicesPage)
router.route("/randevu-yonetimi").get(getRandevuYonetimiPage)
router.route("/sms-yonetimi").get(getSmsYonetimiPage)
router.route("/hasta-yonetimi").get(getHastaYonetimiPage)
router.route("/personel-yonetimi").get(getPersonelYonetimiPage)
router.route("/gelir-gider-yonetimi").get(getGelirGiderYonetimiPage)
router.route("/urun-hizmet-yonetimi").get(getUrunHizmetYonetimiPage)
router.route("/rapor-yonetimi").get(getRaporYonetimiPage)


export default router;
