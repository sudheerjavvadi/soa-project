import { useState, useEffect } from "react";
import { notificationAPI } from "../../api/notifications";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ title }) {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    notificationAPI.getUnreadCount()
      .then(r => setUnread(r.data?.data || 0))
      .catch(() => {});
    const interval = setInterval(() => {
      notificationAPI.getUnreadCount()
        .then(r => setUnread(r.data?.data || 0))
        .catch(() => {});
    }, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-actions">
        <div className="notif-bell">
          <span style={{fontSize:22}}>??</span>
          {unread > 0 && <span className="notif-count">{unread > 9 ? "9+" : unread}</span>}
        </div>
        <div className={`role-tag ${user?.role}`}>{user?.role?.replace("_"," ")}</div>
      </div>
    </div>
  );
}
