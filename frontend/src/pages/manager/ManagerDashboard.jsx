import { useState, useEffect } from "react";
import { expenseAPI } from "../../api/expenses";
import { budgetAPI }  from "../../api/budgets";
import AppLayout from "../../components/layout/AppLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#4f8ef7","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4"];

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [pending, setPending]   = useState([]);
  const [budgets, setBudgets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    Promise.all([
      expenseAPI.getPending(0).then(r => setPending(r.data?.data?.content || [])),
      budgetAPI.getSummary().then(r => setBudgets(r.data?.data || [])),
    ]).finally(() => setLoading(false));
  }, []);

  const approve = async (id) => {
    await expenseAPI.approve(id);
    setPending(p => p.filter(e => e.id !== id));
    setActionMsg("? Expense approved!");
    setTimeout(() => setActionMsg(""), 3000);
  };

  const reject = async (id) => {
    const reason = prompt("Rejection reason:");
    if (!reason) return;
    await expenseAPI.reject(id, reason);
    setPending(p => p.filter(e => e.id !== id));
    setActionMsg("? Expense rejected.");
    setTimeout(() => setActionMsg(""), 3000);
  };

  // Chart data
  const catData = budgets.reduce((acc, b) => {
    const existing = acc.find(x => x.name === b.categoryName);
    if (existing) existing.spent += Number(b.spentAmount || 0);
    else acc.push({ name: b.categoryName, spent: Number(b.spentAmount || 0) });
    return acc;
  }, []);

  return (
    <AppLayout title="Manager Dashboard">
      {actionMsg && <div className="alert alert-success" style={{position:"fixed",top:80,right:24,zIndex:999}}>{actionMsg}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orange">?</div>
          <div><div className="stat-value">{pending.length}</div><div className="stat-label">Awaiting Approval</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">??</div>
          <div><div className="stat-value">{budgets.length}</div><div className="stat-label">Active Budgets</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">??</div>
          <div>
            <div className="stat-value">{budgets.filter(b => ["WARNING","CRITICAL","EXCEEDED"].includes(b.status)).length}</div>
            <div className="stat-label">Budget Alerts</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">??</div>
          <div>
            <div className="stat-value">?{budgets.reduce((s,b)=>s+Number(b.spentAmount||0),0).toLocaleString("en-IN")}</div>
            <div className="stat-label">Total Spent (Month)</div>
          </div>
        </div>
      </div>

      {/* Budget Utilization */}
      {budgets.length > 0 && (
        <div className="card" style={{marginBottom:24}}>
          <div className="card-title" style={{marginBottom:20}}>?? Budget Utilization</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={budgets.slice(0,6)}>
              <XAxis dataKey="categoryName" tick={{fill:"#94a3b8",fontSize:11}} />
              <YAxis tick={{fill:"#94a3b8",fontSize:11}} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{background:"#161928",border:"1px solid rgba(255,255,255,0.08)"}} />
              <Bar dataKey="utilizationPercentage" radius={[4,4,0,0]}>
                {budgets.map((b, i) => (
                  <Cell key={i} fill={b.utilizationPercentage>=100?"#ef4444":b.utilizationPercentage>=80?"#f59e0b":"#22c55e"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pending Approvals */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">? Pending Approvals</div>
            <div className="card-subtitle">Expenses waiting for your decision</div>
          </div>
        </div>
        {loading ? <Loading /> : pending.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">?</div>
            <div className="empty-text">All caught up!</div>
            <div className="empty-sub">No expenses pending approval</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Exp #</th><th>Employee</th><th>Description</th><th>Category</th><th>Amount</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {pending.map(e => (
                  <tr key={e.id}>
                    <td style={{color:"var(--accent-blue)",fontWeight:600}}>{e.expenseNumber}</td>
                    <td>{e.employeeName}</td>
                    <td style={{maxWidth:180}}>{e.description}</td>
                    <td>{e.categoryName}</td>
                    <td style={{fontWeight:700}}>?{Number(e.amount).toLocaleString("en-IN")}</td>
                    <td>{e.expenseDate}</td>
                    <td>
                      <div style={{display:"flex",gap:8}}>
                        <button className="btn btn-success btn-sm" onClick={() => approve(e.id)}>? Approve</button>
                        <button className="btn btn-danger btn-sm"  onClick={() => reject(e.id)}>? Reject</button>
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
