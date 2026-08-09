import { useEffect, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";

import NotificationBadge from "./NotificationBadge";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = ({ notifications, unreadCount, loading, onNotificationClick, onMarkAllRead }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => event.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className="notification-bell" ref={wrapperRef}>
      <button
        type="button"
        className="notification-bell__button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <FiBell aria-hidden="true" />
        <NotificationBadge count={unreadCount} />
      </button>
      {open && <NotificationDropdown notifications={notifications} unreadCount={unreadCount} loading={loading} onNotificationClick={(notification) => { onNotificationClick(notification); setOpen(false); }} onMarkAllRead={onMarkAllRead} />}
    </div>
  );
};

export default NotificationBell;
