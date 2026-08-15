import axiosInstance from "./axiosInstance";

// Notification API
export const getNotifications = (page = 1, limit = 10) => {
    return axiosInstance.get("/notifications", {
        params: {
            page,
            limit
        }
    });
};

export const getUnreadCount = () => {
    return axiosInstance.get("/notifications/unread-count");
};

export const markAsRead = (notificationId) => {
    return axiosInstance.put(
        `/notifications/${notificationId}/read`
    );
};

export const markAllAsRead = () => {
    return axiosInstance.put(
        "/notifications/read-all"
    );
};

export const deleteNotification = (notificationId) => {
    return axiosInstance.delete(
        `/notifications/${notificationId}`
    );
};
