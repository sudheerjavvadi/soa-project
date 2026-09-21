import { useState, useEffect } from "react";
import { authAPI }    from "../../api/auth";
import { expenseAPI } from "../../api/expenses";
import { categoryAPI } from "../../api/categories";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";

export default function AdminDashboard() {
  const [users, setUsers]       = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      authAPI.getAllUsers().then(r => setUsers(r.data?.data || [])),
      expenseAPI.getAll(0, 5).then(r => setExpenses(r.data?.data?.content || [])),
    ]).finally(() => setLoading(false));
  }, []);

  const roleCount = (role) => users.filter(u => u.role === role).length;

  return (
    <AppLayout title="System Admin Dashboard">
      {loading ? <Loading /> : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">??</div>
              <div><div className="stat-value">{users.length}</div><div className="stat-label">Total Users</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">??</div>
              <div><div className="stat-value">{users.filter(u=>u.active).length}</div><div className="stat-label">Active Users</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue">??</div>
              <div><div className="stat-value">{roleCount("EMPLOYEE")}</div><div className="stat-label">Employees</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">??</div>
              <div><div className="stat-value">{roleCount("MANAGER")}</div><div className="stat-label">Managers</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red">??</div>
              <div><div className="stat-value">{roleCount("FINANCE_ADMIN")}</div><div className="stat-label">Finance Admins</div></div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card" style={{marginBottom:24}}>
            <div className="card-header">
              <div><div className="card-title">?? All Users</div>
                <div className="card-subtitle">Registered system users</div></div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Emp ID</th><th>Status</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{fontWeight:600}}>{u.firstName} {u.lastName}</td>
                      <td style={{color:"var(--text-secondary)"}}>{u.email}</td>
                      <td><span className={`role-tag ${u.role}`}>{u.role?.replace("_"," ")}</span></td>
                      <td>{u.department || "—"}</td>
                      <td style={{color:"var(--text-muted)"}}>{u.employeeId || "—"}</td>
                      <td>
                        <span className={`badge ${u.active?"badge-approved":"badge-rejected"}`}>
                          {u.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="card">
            <div className="card-title" style={{marginBottom:16}}>?? Recent Expenses (System-wide)</div>
            {expenses.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">??</div><div className="empty-text">No expenses yet</div></div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Exp #</th><th>Employee</th><th>Department</th><th>Category</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {expenses.map(e => (
                      <tr key={e.id}>
                        <td style={{color:"var(--accent-blue)",fontWeight:600}}>{e.expenseNumber}</td>
                        <td>{e.employeeName}</td>
                        <td>{e.department}</td>
                        <td>{e.categoryName}</td>
                        <td style={{fontWeight:700}}>?{Number(e.amount).toLocaleString("en-IN")}</td>
                        <td><StatusBadge status={e.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AppLayout>
  );
}
