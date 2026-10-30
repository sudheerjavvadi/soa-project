import { Icon } from "../../components/common/Icons";
import { useState, useEffect } from "react";
import { notificationAPI } from "../../api/notifications";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";

function NotifIcon({ type }) {
  const map = {
    EXPENSE_SUBMITTED: <Icon name="send"    size={20} style={{ color: "var(--accent-blue)" }} />,
    EXPENSE_APPROVED:  <Icon name="check"   size={20} style={{ color: "var(--accent-green)" }} />,
    EXPENSE_REJECTED:  <Icon name="x"       size={20} style={{ color: "var(--accent-red)" }} />,
    BUDGET_WARNING:    <Icon name="alert"   size={20} style={{ color: "var(--accent-orange)" }} />,
    BUDGET_CRITICAL:   <Icon name="alert"   size={20} style={{ color: "var(--accent-red)" }} />,
    BUDGET_EXCEEDED:   <Icon name="alert"   size={20} style={{ color: "var(--accent-red)" }} />,
  };
  return map[type] || <Icon name="bell" size={20} style={{ color: "var(--accent-blue)" }} />;
}

export default function Notifications() {
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    notificationAPI.getMy(0)
      .then(r => setNotifs(r.data?.data?.content || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = () => {
    notificationAPI.markAllRead().then(load);
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <AppLayout title="Notifications">
      <div style={{ maxWidth: 760 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 22, display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="bell" size={22} /> Notifications
            </h2>
            {unreadCount > 0 && (
              <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={markRead}
            style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="check" size={13} /> Mark all read
          </button>
        </div>

        {loading ? <Loading /> : notifs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="bell" size={48} style={{ opacity: 0.35 }} /></div>
            <div className="empty-text">No notifications</div>
            <div className="empty-sub">You're all caught up!</div>
          </div>
        ) : notifs.map(n => (
          <div key={n.id} className="card" style={{
            marginBottom: 12,
            borderLeft: `3px solid ${n.read ? "var(--border)" : "var(--accent-blue)"}`,
            background: n.read ? "var(--bg-elevated)" : "var(--bg-surface)",
          }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "var(--bg-elevated)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <NotifIcon type={n.type} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: 3 }}>{n.title}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>{n.message}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 6 }}>
                  {new Date(n.createdAt).toLocaleString("en-IN")}
                </div>
              </div>
              {!n.read && (
                <span className="badge badge-submitted" style={{ flexShrink: 0 }}>New</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
