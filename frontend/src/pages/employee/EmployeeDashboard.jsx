import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { expenseAPI } from "../../api/expenses";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "../../components/layout/AppLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Loading from "../../components/common/Loading";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    expenseAPI.getMy(0, 5)
      .then(r => setExpenses(r.data?.data?.content || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total     = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const approved  = expenses.filter(e => e.status === "APPROVED").length;
  const pending   = expenses.filter(e => e.status === "SUBMITTED").length;
  const rejected  = expenses.filter(e => e.status === "REJECTED").length;

  return (
    <AppLayout title="Employee Dashboard">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div>
          <h2 style={{fontSize:24,fontWeight:800}}>Hello, {user?.firstName}! ??</h2>
          <p style={{color:"var(--text-muted)",marginTop:4}}>Dept: {user?.department} · ID: {user?.employeeId}</p>
        </div>
        <Link to="/employee/new-expense" className="btn btn-primary">? New Expense</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">??</div>
          <div><div className="stat-value">{expenses.length}</div><div className="stat-label">Total Expenses</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">?</div>
          <div><div className="stat-value">{approved}</div><div className="stat-label">Approved</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">?</div>
          <div><div className="stat-value">{pending}</div><div className="stat-label">Pending Approval</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">?</div>
          <div><div className="stat-value">{rejected}</div><div className="stat-label">Rejected</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">??</div>
          <div><div className="stat-value">?{total.toLocaleString("en-IN")}</div><div className="stat-label">Total Amount</div></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Expenses</div>
            <div className="card-subtitle">Your last 5 expense claims</div>
          </div>
          <Link to="/employee/expenses" className="btn btn-ghost btn-sm">View All ?</Link>
        </div>
        {loading ? <Loading /> : expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">??</div>
            <div className="empty-text">No expenses yet</div>
            <div className="empty-sub">Click "New Expense" to submit your first claim</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Expense #</th><th>Description</th><th>Category</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.id}>
                    <td style={{color:"var(--accent-blue)",fontWeight:600}}>{e.expenseNumber}</td>
                    <td>{e.description}</td>
                    <td>{e.categoryName}</td>
                    <td style={{fontWeight:600}}>?{Number(e.amount).toLocaleString("en-IN")}</td>
                    <td>{e.expenseDate}</td>
                    <td><StatusBadge status={e.status} /></td>
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
