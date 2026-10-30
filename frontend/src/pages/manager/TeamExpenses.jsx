import { useState, useEffect } from "react";
import { Icon } from "../../components/common/Icons";
import { expenseAPI } from "../../api/expenses";
import AppLayout from "../../components/layout/AppLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Loading from "../../components/common/Loading";

export default function TeamExpenses() {
  const [data, setData]     = useState({ content: [], totalPages: 0 });
  const [page, setPage]     = useState(0);
  const [loading, setLoad]  = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast]   = useState(null);

  const load = (p) => {
    setLoad(true);
    expenseAPI.getAll(p, 15)
      .then(r => setData(r.data?.data || { content: [], totalPages: 0 }))
      .finally(() => setLoad(false));
  };

  useEffect(() => { load(page); }, [page]);

  const flash = (type, text) => { setToast({ type, text }); setTimeout(() => setToast(null), 3000); };

  const approve = async (id) => {
    try { await expenseAPI.approve(id); load(page); flash("success", "Expense approved!"); }
    catch { flash("error", "Failed to approve."); }
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) return;
    try {
      await expenseAPI.reject(rejectModal.id, rejectReason);
      load(page); flash("success", "Expense rejected."); setRejectModal(null);
    } catch { flash("error", "Failed to reject."); }
  };

  return (
    <AppLayout title="Team Expenses">
      {toast && (
        <div className={`alert alert-${toast.type === "success" ? "success" : "error"}`}
          style={{ position: "fixed", top: 80, right: 24, zIndex: 999, minWidth: 260 }}>
          <Icon name={toast.type === "success" ? "success" : "error"} size={15} /> {toast.text}
        </div>
      )}

      {rejectModal && (
        <div className="modal-overlay" onClick={() => setRejectModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-title" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Icon name="x" size={18} style={{ color: "var(--accent-red)" }} /> Reject Expense
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 14 }}>
              <strong>{rejectModal.expenseNumber}</strong> — {rejectModal.description}
            </p>
            <div className="form-group">
              <label className="form-label">Rejection Reason *</label>
              <textarea className="form-textarea" rows={3}
                placeholder="Provide a clear reason..."
                value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setRejectModal(null)}>Cancel</button>
              <button className="btn btn-danger" disabled={!rejectReason.trim()} onClick={confirmReject}>
                <Icon name="x" size={14} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="layers" size={16}/> Team Expense Claims
            </div>
            <div className="card-subtitle">All expenses from your team</div>
          </div>
        </div>
        {loading ? <Loading /> : data.content.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="receipt" size={48} style={{ opacity: 0.35 }} /></div>
            <div className="empty-text">No expenses yet</div>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Exp #</th><th>Employee</th><th>Dept</th><th>Description</th>
                    <th>Amount</th><th>Date</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map(e => (
                    <tr key={e.id}>
                      <td style={{ color: "var(--accent-blue)", fontWeight: 600 }}>{e.expenseNumber}</td>
                      <td>{e.employeeName}</td>
                      <td style={{ color: "var(--text-muted)" }}>{e.department}</td>
                      <td style={{ maxWidth: 160 }}>{e.description}</td>
                      <td style={{ fontWeight: 700 }}>₹{Number(e.amount).toLocaleString("en-IN")}</td>
                      <td>{e.expenseDate}</td>
                      <td><StatusBadge status={e.status}/></td>
                      <td>
                        {e.status === "SUBMITTED" && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-success btn-sm" onClick={() => approve(e.id)}
                              style={{ display: "flex", gap: 4, alignItems: "center" }}>
                              <Icon name="check" size={13}/> Approve
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => { setRejectModal(e); setRejectReason(""); }}
                              style={{ display: "flex", gap: 4, alignItems: "center" }}>
                              <Icon name="x" size={13}/> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.totalPages > 1 && (
              <div className="pagination">
                {[...Array(data.totalPages)].map((_, i) => (
                  <button key={i} className={`page-btn${page === i ? " active" : ""}`} onClick={() => setPage(i)}>{i+1}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
