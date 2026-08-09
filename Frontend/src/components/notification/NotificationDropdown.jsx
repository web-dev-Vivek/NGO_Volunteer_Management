import { FiCheck } from "react-icons/fi";
import NotificationItem from "./NotificationItem";
import NotificationLoading from "./NotificationLoading";

const NotificationDropdown = ({ notifications, unreadCount, loading, onNotificationClick, onMarkAllRead }) => (
  <section className="notification-dropdown" aria-label="Recent notifications">
    <header className="notification-dropdown__header">
      <div><strong>Notifications</strong><span>{unreadCount ? `${unreadCount} unread` : "You're all caught up"}</span></div>
      <button type="button" disabled={!unreadCount} onClick={onMarkAllRead}><FiCheck aria-hidden="true" /> Mark all read</button>
    </header>
    <div className="notification-dropdown__body">
      {loading ? <NotificationLoading /> : notifications.length ? notifications.map((notification) => <NotificationItem key={notification._id} notification={notification} onClick={onNotificationClick} />) : <div className="notification-empty"><FiCheck aria-hidden="true" /><strong>All caught up</strong><span>New activity will appear here.</span></div>}
    </div>
  </section>
);

export default NotificationDropdown;
