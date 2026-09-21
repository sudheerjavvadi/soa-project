import { useState, useEffect } from "react";
import { expenseAPI } from "../../api/expenses";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";

export default function PendingApprovals() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    expenseAPI.getPending(0).then(r => setPending(r.data?.data?.content || []))
      .finally(() => setLoading(false));
  }, []);

  const approve = async (id) => {
    await expenseAPI.approve(id);
    setPending(p => p.filter(e => e.id !== id));
    setMsg("? Approved"); setTimeout(() => setMsg(""), 3000);
  };
  const reject = async (id) => {
    const r = prompt("Rejection reason:");
    if (!r) return;
    await expenseAPI.reject(id, r);
    setPending(p => p.filter(e => e.id !== id));
    setMsg("? Rejected"); setTimeout(() => setMsg(""), 3000);
  };

  return (
    <AppLayout title="Pending Approvals">
      {msg && <div className="alert alert-success" style={{position:"fixed",top:80,right:24,zIndex:999}}>{msg}</div>}
      <div className="card">
        <div className="card-header">
          <div><div className="card-title">? Pending Expense Approvals</div>
            <div className="card-subtitle">{pending.length} expense(s) awaiting your decision</div></div>
        </div>
        {loading ? <Loading /> : pending.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">?</div><div className="empty-text">All caught up!</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Exp #</th><th>Employee</th><th>Description</th><th>Category</th><th>Amount</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {pending.map(e => (
                  <tr key={e.id}>
                    <td style={{color:"var(--accent-blue)",fontWeight:600}}>{e.expenseNumber}</td>
                    <td>{e.employeeName}</td><td>{e.description}</td><td>{e.categoryName}</td>
                    <td style={{fontWeight:700}}>?{Number(e.amount).toLocaleString("en-IN")}</td>
                    <td>{e.expenseDate}</td>
                    <td><div style={{display:"flex",gap:8}}>
                      <button className="btn btn-success btn-sm" onClick={()=>approve(e.id)}>? Approve</button>
                      <button className="btn btn-danger btn-sm"  onClick={()=>reject(e.id)}>? Reject</button>
                    </div></td>
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
