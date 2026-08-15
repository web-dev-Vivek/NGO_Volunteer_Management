import { FiAward, FiBell, FiCheckCircle, FiClipboard, FiVolume2 } from "react-icons/fi";

const icons = { certificate: FiAward, task: FiClipboard, campaign: FiVolume2, approval: FiCheckCircle, system: FiBell };
const relativeTime = (date) => {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const NotificationItem = ({ notification, onClick }) => {
  const Icon = icons[notification.type] || FiBell;
  return <button type="button" className={`notification-item ${notification.isRead ? "" : "notification-item--unread"}`} onClick={() => onClick(notification)}>
    <span className="notification-item__icon"><Icon aria-hidden="true" /></span>
    <span className="notification-item__content"><strong>{notification.title}</strong><span>{notification.message}</span><time dateTime={notification.createdAt}>{relativeTime(notification.createdAt)}</time></span>
    {!notification.isRead && <span className="notification-item__dot"><span className="sr-only">Unread</span></span>}
  </button>;
};

export default NotificationItem;
