import express from 'express';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import {
    createTask,
    getTasks,
    updateTask,
    updateTaskStatus
} from './tasks.controller.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Task CRUD and status endpoints
router.route('/')
    .post(authorize('coordinator', 'admin'), createTask)
    .get(getTasks);

router.route('/:taskId')
    .put(authorize('coordinator', 'admin'), updateTask);

router.route('/:taskId/status')
    .put(updateTaskStatus);

export default router;
