// Authentication routes
import express from 'express';
import { register, login,getMe } from './auth.controller.js';
import { protect } from '../../middleware/auth.js';
import {upload} from '../../config/multer.js';
import {uploadAvatar} from './auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

//protected route to get the current user's information
//route for update profile
router.put('/profile', protect, updateProfile)
router.post(
    "/profile/avatar",
    protect,
    upload.single("avatar"),
    uploadAvatar
);
router.get('/me', protect, getMe);



export default router;
