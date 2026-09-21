import { useState, useEffect } from "react";
import { notificationAPI } from "../../api/notifications";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";

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

  const typeIcon = (type) => {
    const icons = { EXPENSE_SUBMITTED:"??", EXPENSE_APPROVED:"?", EXPENSE_REJECTED:"?", BUDGET_WARNING:"??", BUDGET_CRITICAL:"??", BUDGET_EXCEEDED:"??" };
    return icons[type] || "??";
  };

  return (
    <AppLayout title="Notifications">
      <div style={{maxWidth:760}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h2 style={{fontWeight:800,fontSize:22}}>Notifications</h2>
          <button className="btn btn-ghost btn-sm" onClick={markRead}>? Mark all read</button>
        </div>
        {loading ? <Loading /> : notifs.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">??</div>
            <div className="empty-text">No notifications</div></div>
        ) : notifs.map(n => (
          <div key={n.id} className="card" style={{marginBottom:12,borderLeft:`3px solid ${n.read?"var(--border)":"var(--accent-blue)"}`}}>
            <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
              <span style={{fontSize:24}}>{typeIcon(n.type)}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,marginBottom:4}}>{n.title}</div>
                <div style={{color:"var(--text-secondary)",fontSize:13}}>{n.message}</div>
                <div style={{color:"var(--text-muted)",fontSize:11,marginTop:6}}>
                  {new Date(n.createdAt).toLocaleString("en-IN")}
                </div>
              </div>
              {!n.read && <span className="badge badge-submitted" style={{flexShrink:0}}>New</span>}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
