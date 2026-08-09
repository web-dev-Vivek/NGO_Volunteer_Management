import { useCallback, useEffect, useState } from "react";
import { FiBell, FiCheckCircle, FiRefreshCw } from "react-icons/fi";

import NotificationBell from "../../components/notification/NotificationBell";
import NotificationItem from "../../components/notification/NotificationItem";
import NotificationLoading from "../../components/notification/NotificationLoading";
import { getNotifications, getUnreadCount, markAllAsRead, markAsRead } from "../../api/notificationApi";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [notificationsResponse, unreadResponse] = await Promise.all([getNotifications(), getUnreadCount()]);
      setNotifications(notificationsResponse.data.data ?? []);
      setUnreadCount(unreadResponse.data.count ?? 0);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn't load your notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const handleNotificationClick = async (notification) => {
    if (notification.isRead) return;
    setNotifications((items) => items.map((item) => item._id === notification._id ? { ...item, isRead: true } : item));
    setUnreadCount((count) => Math.max(0, count - 1));
    try {
      await markAsRead(notification._id);
    } catch {
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    if (!unreadCount) return;
    setUpdating(true);
    setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);
    try {
      await markAllAsRead();
    } catch {
      fetchNotifications();
    } finally {
      setUpdating(false);
    }
  };

  return <main className="notifications-page">
    <section className="notifications-hero">
      <div>
        <span className="notifications-hero__eyebrow"><FiBell aria-hidden="true" /> Activity center</span>
        <h1>Stay in the loop.</h1>
        <p>Keep track of tasks, certificates, campaigns, and everything that needs your attention.</p>
      </div>
      <div className="notifications-hero__actions">
        <NotificationBell notifications={notifications.slice(0, 6)} unreadCount={unreadCount} loading={loading} onNotificationClick={handleNotificationClick} onMarkAllRead={handleMarkAllRead} />
        <button type="button" className="button button--ghost" onClick={fetchNotifications} disabled={loading}><FiRefreshCw className={loading ? "is-spinning" : ""} aria-hidden="true" /> Refresh</button>
      </div>
    </section>

    <section className="notification-summary" aria-label="Notification summary">
      <div><span className="notification-summary__value">{unreadCount}</span><span>Unread notifications</span></div>
      <div><span className="notification-summary__value">{notifications.length}</span><span>Recent updates</span></div>
      <button type="button" className="button button--primary" disabled={!unreadCount || updating} onClick={handleMarkAllRead}><FiCheckCircle aria-hidden="true" /> {updating ? "Updating…" : "Mark all as read"}</button>
    </section>

    <section className="notifications-feed" aria-live="polite">
      <div className="notifications-feed__title"><div><h2>All notifications</h2><p>Your most recent updates, in one place.</p></div></div>
      {error ? <div className="notification-error"><strong>Something went wrong</strong><span>{error}</span><button type="button" className="button button--ghost" onClick={fetchNotifications}>Try again</button></div> : loading ? <NotificationLoading /> : notifications.length ? <div className="notifications-list">{notifications.map((notification) => <NotificationItem key={notification._id} notification={notification} onClick={handleNotificationClick} />)}</div> : <div className="notification-empty notification-empty--page"><FiCheckCircle aria-hidden="true" /><strong>No notifications yet</strong><span>When something needs your attention, you'll see it here.</span></div>}
    </section>
  </main>;
};

export default Notifications;
