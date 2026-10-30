import { useState, useEffect } from "react";
import { authAPI } from "../../api/auth";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";

function ShieldIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function ActionBadge({ action }) {
  const map = {
    LOGIN:             "badge-submitted",
    LOGOUT:            "badge-draft",
    EXPENSE_CREATED:   "badge-approved",
    EXPENSE_SUBMITTED: "badge-submitted",
    EXPENSE_APPROVED:  "badge-approved",
    EXPENSE_REJECTED:  "badge-rejected",
    BUDGET_UPDATED:    "badge-warning",
    USER_CREATED:      "badge-approved",
    USER_UPDATED:      "badge-under_review",
    PASSWORD_CHANGED:  "badge-under_review",
  };
  const cls = map[action] || "badge-draft";
  return <span className={`badge ${cls}`}>{action || "UNKNOWN"}</span>;
}

export default function AuditLogs() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [page,    setPage]    = useState(0);
  const [total,   setTotal]   = useState(0);
  const PAGE_SIZE = 20;

  const loadLogs = (p = 0) => {
    setLoading(true);
    setError(null);
    authAPI.getAuditLogs(p, PAGE_SIZE)
      .then(r => {
        // Backend returns a Page object: { content: [...], totalElements, ... }
        const data = r.data?.data;
        if (Array.isArray(data)) {
          setLogs(data);
          setTotal(data.length);
        } else if (data?.content) {
          setLogs(data.content);
          setTotal(data.totalElements || data.content.length);
        } else {
          setLogs([]);
          setTotal(0);
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || "Failed to load audit logs. Make sure the auth service is running.");
        setLogs([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadLogs(page); }, [page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const formatDate = (ts) => {
    if (!ts) return "";
    try { return new Date(ts).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }); }
    catch { return ts; }
  };

  return (
    <AppLayout title="Audit Logs">
      <div className="card fade-in">
        <div className="card-header">
          <div>
            <div className="card-title">System Audit Logs</div>
            <div className="card-subtitle">All login events and system actions  {total} records</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => loadLogs(page)}>
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <Loading />
        ) : logs.length === 0 && !error ? (
          <div className="empty-state">
            <div className="empty-icon"><ShieldIcon /></div>
            <div className="empty-text">No audit logs yet</div>
            <div className="empty-sub">Login events and system actions will appear here</div>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Description</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l, i) => (
                    <tr key={l.id || i}>
                      <td style={{ color: "var(--text-muted)", fontSize: 12 }}>
                        {page * PAGE_SIZE + i + 1}
                      </td>
                      <td style={{ color: "var(--text-muted)", fontSize: 12, whiteSpace: "nowrap" }}>
                        {formatDate(l.timestamp || l.createdAt)}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {l.userEmail || l.username || l.email || ""}
                        {l.userId && (
                          <span style={{ color: "var(--text-muted)", fontWeight: 400, marginLeft: 6, fontSize: 12 }}>
                            #{l.userId}
                          </span>
                        )}
                      </td>
                      <td><ActionBadge action={l.action || l.event} /></td>
                      <td style={{ color: "var(--text-secondary)", maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {l.description || ""}
                      </td>
                      <td style={{ color: "var(--text-muted)", fontFamily: "monospace", fontSize: 12 }}>
                        {l.ipAddress || ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  &laquo;
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + Math.max(0, page - 3)).filter(p => p < totalPages).map(p => (
                  <button
                    key={p}
                    className={`page-btn ${p === page ? "active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p + 1}
                  </button>
                ))}
                <button
                  className="page-btn"
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                >
                  &raquo;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}