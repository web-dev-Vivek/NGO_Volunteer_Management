import express from 'express';
import { uploadCertificate } from '../../config/storage.js';
import { uploadCertificateController } from './certificates.controller.js';

const router = express.Router();

// POST /api/certificates/upload
router.post('/upload', uploadCertificate, uploadCertificateController);

export default router;
