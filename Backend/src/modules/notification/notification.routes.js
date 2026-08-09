import express from "express";
import { protect } from "../../middleware/auth.js";
import { deleteNotification, getNotifications, getUnreadCount, markAllAsRead, markAsRead } from "./notification.controller.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.get(
    "/unread-count",
    protect,
    getUnreadCount
);


router.put(
    "/:id/read",
    protect,
    markAsRead
);


router.put(
    "/read-all",
    protect,
    markAllAsRead
);
router.delete("/:id", protect, deleteNotification);
export default router;
