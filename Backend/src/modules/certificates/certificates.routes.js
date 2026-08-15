import express from "express";
import { protect } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import { uploadCertificate } from "../../config/storage.js";
import { downloadCertificate, generateCertificate, getAllCertificates, getCertificateStats, getMyCertificates, revokeCertificate, uploadCertificateController, verifyCertificate } from "./certificates.controller.js";

const router = express.Router();
router.post("/upload", uploadCertificate, uploadCertificateController);
router.get("/verify/:hash", verifyCertificate);
router.get("/my-certificates", protect, getMyCertificates);
router.get("/stats", protect, authorize("admin"), getCertificateStats);
router.get("/download/:id", protect, downloadCertificate);
router.post("/", protect, authorize("admin"), generateCertificate);
router.get("/", protect, authorize("admin"), getAllCertificates);
router.put("/:id/revoke", protect, authorize("admin"), revokeCertificate);
export default router;
