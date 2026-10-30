import { Icon } from "../../components/common/Icons";
import { useState, useEffect } from "react";
import { expenseAPI } from "../../api/expenses";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";

export default function PendingApprovals() {
  const [pending, setPending]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [toast, setToast]             = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    expenseAPI.getPending(0)
      .then(r => setPending(r.data?.data?.content || []))
      .finally(() => setLoading(false));
  }, []);

  const flash = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const approve = async (id) => {
    try {
      await expenseAPI.approve(id);
      setPending(p => p.filter(e => e.id !== id));
      flash("success", "Expense approved successfully!");
    } catch {
      flash("error", "Failed to approve expense.");
    }
  };

  const openReject = (expense) => { setRejectModal(expense); setRejectReason(""); };

  const confirmReject = async () => {
    if (!rejectReason.trim()) return;
    try {
      await expenseAPI.reject(rejectModal.id, rejectReason);
      setPending(p => p.filter(e => e.id !== rejectModal.id));
      flash("success", "Expense rejected.");
      setRejectModal(null);
    } catch {
      flash("error", "Failed to reject expense.");
    }
  };

  return (
    <AppLayout title="Pending Approvals">
      {/* Toast */}
      {toast && (
        <div className={`alert alert-${toast.type === "success" ? "success" : "error"}`}
          style={{ position: "fixed", top: 80, right: 24, zIndex: 999, minWidth: 280 }}>
          <Icon name={toast.type === "success" ? "success" : "error"} size={16} />
          {toast.text}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="modal-overlay" onClick={() => setRejectModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-title" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Icon name="x" size={18} style={{ color: "var(--accent-red)" }} />
              Reject Expense
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 14 }}>
              <strong>{rejectModal.expenseNumber}</strong> — {rejectModal.description}
            </p>
            <div className="form-group">
              <label className="form-label">Rejection Reason *</label>
              <textarea className="form-textarea" rows={3}
                placeholder="Provide a clear reason for rejection..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)} />
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
              <Icon name="clock" size={16} /> Pending Expense Approvals
            </div>
            <div className="card-subtitle">{pending.length} expense(s) awaiting your decision</div>
          </div>
        </div>
        {loading ? <Loading /> : pending.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="success" size={48} style={{ opacity: 0.35 }} /></div>
            <div className="empty-text">All caught up!</div>
            <div className="empty-sub">No expenses pending approval</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Exp #</th><th>Employee</th><th>Description</th>
                  <th>Category</th><th>Amount</th><th>Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map(e => (
                  <tr key={e.id}>
                    <td style={{ color: "var(--accent-blue)", fontWeight: 600 }}>{e.expenseNumber}</td>
                    <td>{e.employeeName}</td>
                    <td style={{ maxWidth: 180 }}>{e.description}</td>
                    <td>{e.categoryName}</td>
                    <td style={{ fontWeight: 700 }}>₹{Number(e.amount).toLocaleString("en-IN")}</td>
                    <td>{e.expenseDate}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-success btn-sm" onClick={() => approve(e.id)}
                          style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <Icon name="check" size={13} /> Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => openReject(e)}
                          style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <Icon name="x" size={13} /> Reject
                        </button>
                      </div>
                    </td>
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
