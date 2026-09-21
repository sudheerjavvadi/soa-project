import { useState, useEffect } from "react";
import { authAPI } from "../../api/auth";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";

export default function AuditLogs() {
  const [logs, setLogs]   = useState([]);
  const [loading, setLoad]= useState(true);

  useEffect(()=>{
    authAPI.getAuditLogs().then(r=>setLogs(r.data?.data||[])).finally(()=>setLoad(false));
  },[]);

  return (
    <AppLayout title="Audit Logs">
      <div className="card">
        <div className="card-header">
          <div><div className="card-title">📋 System Audit Logs</div>
            <div className="card-subtitle">All login and system events</div></div>
        </div>
        {loading ? <Loading /> : logs.length===0 ? (
          <div className="empty-state"><div className="empty-icon">📋</div>
            <div className="empty-text">No audit logs yet</div>
            <div className="empty-sub">Login events will appear here</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>IP Address</th><th>Status</th></tr></thead>
              <tbody>
                {logs.map((l,i)=>(
                  <tr key={i}>
                    <td style={{color:"var(--text-muted)",fontSize:12}}>{new Date(l.timestamp||l.createdAt).toLocaleString("en-IN")}</td>
                    <td style={{fontWeight:600}}>{l.username||l.email||"—"}</td>
                    <td>{l.action||l.event||"—"}</td>
                    <td style={{color:"var(--text-muted)"}}>{l.ipAddress||"—"}</td>
                    <td><span className={`badge ${l.success||l.status==="SUCCESS"?"badge-approved":"badge-rejected"}`}>
                      {l.success||l.status==="SUCCESS"?"Success":"Failed"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}