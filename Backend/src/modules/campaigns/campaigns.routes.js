import express from 'express';
import { uploadCampaignBanner } from '../../config/storage.js';
import { uploadBannerController } from './campaigns.controller.js';

const router = express.Router();

// POST /api/campaigns/banner
router.post('/banner', uploadCampaignBanner, uploadBannerController);

export default router;
