import Notification from "../../models/Notification.js";

// Get all notifications of logged-in user
export const getNotifications = async (req, res, next) => {
    try {

        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
        const filter = {
            recipient: req.user._id
        };
        const [notifications, total] = await Promise.all([
            Notification.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            Notification.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            count: notifications.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: notifications
        });

    } catch (error) {
        next(error);
    }
};



// Get unread notification count
export const getUnreadCount = async (req, res, next) => {
    try {

        const count = await Notification.countDocuments({
            recipient: req.user._id,
            isRead: false
        });

        res.status(200).json({
            success: true,
            count
        });

    } catch (error) {
        next(error);
    }
};



// Mark notification as read
export const markAsRead = async (req, res, next) => {
    try {

        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        if (
            notification.recipient.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this notification"
            });
        }

        notification.isRead = true;
        notification.readAt = new Date();

        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification
        });

    } catch (error) {
        next(error);
    }
};



// Mark all notifications as read
export const markAllAsRead = async (req, res, next) => {
    try {

        const result = await Notification.updateMany(
            {
                recipient: req.user._id,
                isRead: false
            },
            {
                isRead: true,
                readAt: new Date()
            }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        next(error);
    }
};

export const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
        if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });
        return res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (error) {
        next(error);
    }
};
