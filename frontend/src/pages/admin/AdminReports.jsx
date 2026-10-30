import { useState, useEffect } from "react";
import { expenseAPI } from "../../api/expenses";
import { authAPI }    from "../../api/auth";
import { budgetAPI }  from "../../api/budgets";
import AppLayout from "../../components/layout/AppLayout";
import Loading   from "../../components/common/Loading";
import { Icon }  from "../../components/common/Icons";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area,
} from "recharts";

const COLORS = ["#4f8ef7","#35c98a","#f59e0b","#ff4545","#8b5cf6","#06b6d4","#ec4899","#f97316"];
const STATUS_COLORS = { DRAFT:"#6b7280", SUBMITTED:"#4f8ef7", UNDER_REVIEW:"#f59e0b", APPROVED:"#35c98a", REJECTED:"#ff4545", CANCELLED:"#6b7280" };

/* ---- CSV helpers ---- */
function toCSV(headers, rows) {
  const esc = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers.map(esc), ...rows.map(r => r.map(esc))].map(r => r.join(",")).join("\n");
}

function downloadCSV(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ---- Tooltip style ---- */
const tooltipStyle = {
  background: "var(--bg-elevated)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  color: "var(--text-primary)",
  fontSize: 12,
};
const axisStyle = { fill: "var(--text-muted)", fontSize: 11 };

function fmt(v) { return "\u20B9" + Number(v).toLocaleString("en-IN"); }
function fmtK(v) { return "\u20B9" + (Number(v)/1000).toFixed(0) + "K"; }

/* ---- Section header ---- */
function SectionHeader({ title, onExport, exportLabel = "Export CSV" }) {
  return (
    <div className="card-header" style={{ marginBottom: 16 }}>
      <div className="card-title">{title}</div>
      {onExport && (
        <button className="btn btn-ghost btn-sm" onClick={onExport} style={{ display:"flex", gap:6, alignItems:"center" }}>
          <Icon name="download" size={14} />
          {exportLabel}
        </button>
      )}
    </div>
  );
}

export default function AdminReports() {
  const [expenses, setExp]  = useState([]);
  const [users,    setUsers] = useState([]);
  const [budgets,  setBud]  = useState([]);
  const [loading,  setLoad] = useState(true);
  const [tab,      setTab]  = useState("overview");

  useEffect(() => {
    Promise.all([
      expenseAPI.getAll(0, 1000).then(r => setExp(r.data?.data?.content || [])),
      authAPI.getAllUsers().then(r => setUsers(r.data?.data || [])),
      budgetAPI.getAll().then(r => setBud(r.data?.data || [])),
    ]).finally(() => setLoad(false));
  }, []);

  /* ---------- Computed datasets ---------- */
  const byDept = expenses.reduce((acc, e) => {
    const ex = acc.find(x => x.name === e.department);
    if (ex) { ex.amount += Number(e.amount || 0); ex.count++; }
    else acc.push({ name: e.department || "Other", amount: Number(e.amount || 0), count: 1 });
    return acc;
  }, []).sort((a, b) => b.amount - a.amount);

  const byCat = expenses.reduce((acc, e) => {
    const ex = acc.find(x => x.name === e.categoryName);
    if (ex) { ex.amount += Number(e.amount || 0); ex.count++; }
    else acc.push({ name: e.categoryName || "Other", amount: Number(e.amount || 0), count: 1 });
    return acc;
  }, []).sort((a, b) => b.amount - a.amount);

  const byRole = ["EMPLOYEE","MANAGER","FINANCE_ADMIN","SYSTEM_ADMIN"].map(r => ({
    name: r.replace(/_/g, " "), value: users.filter(u => u.role === r).length,
  })).filter(x => x.value > 0);

  const byStatus = ["DRAFT","SUBMITTED","UNDER_REVIEW","APPROVED","REJECTED","CANCELLED"].map(s => ({
    name: s,
    count: expenses.filter(e => e.status === s).length,
    amount: expenses.filter(e => e.status === s).reduce((a, e) => a + Number(e.amount || 0), 0),
  })).filter(x => x.count > 0);

  /* Monthly trend (last 6 months from data) */
  const monthlyMap = expenses.reduce((acc, e) => {
    const mo = (e.expenseDate || "").slice(0, 7);
    if (!mo) return acc;
    if (!acc[mo]) acc[mo] = { month: mo, total: 0, approved: 0, count: 0 };
    acc[mo].total += Number(e.amount || 0);
    if (e.status === "APPROVED") acc[mo].approved += Number(e.amount || 0);
    acc[mo].count++;
    return acc;
  }, {});
  const monthly = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month)).slice(-8);

  /* Budget utilization radar */
  const budgetRadar = budgets.slice(0, 6).map(b => ({
    dept: b.department,
    utilization: Math.min(Number(b.utilizationPercentage || 0), 100),
    fullMark: 100,
  }));

  const totalSpent    = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const approvedTotal = expenses.filter(e => e.status === "APPROVED").reduce((s, e) => s + Number(e.amount || 0), 0);
  const pendingCount  = expenses.filter(e => e.status === "SUBMITTED").length;

  /* ---------- CSV exports ---------- */
  const exportExpenses = () => downloadCSV("expenses_report.csv", toCSV(
    ["Exp #","Employee","Department","Category","Amount (INR)","Date","Status","Merchant"],
    expenses.map(e => [e.expenseNumber, e.employeeName, e.department, e.categoryName,
      Number(e.amount || 0).toFixed(2), e.expenseDate, e.status, e.merchantName || ""])
  ));

  const exportUsers = () => downloadCSV("users_report.csv", toCSV(
    ["Emp ID","First Name","Last Name","Email","Department","Role","Status"],
    users.map(u => [u.employeeId, u.firstName, u.lastName, u.email, u.department, u.role, u.active ? "Active" : "Inactive"])
  ));

  const exportBudgets = () => downloadCSV("budgets_report.csv", toCSV(
    ["Department","Category","FY","Month","Allocated","Spent","Remaining","Utilization %","Status"],
    budgets.map(b => [b.department, b.categoryName, b.financialYear, b.month,
      Number(b.allocatedAmount).toFixed(2), Number(b.spentAmount).toFixed(2),
      Number(b.remainingAmount).toFixed(2), Number(b.utilizationPercentage).toFixed(2), b.status])
  ));

  const exportDept = () => downloadCSV("dept_spending.csv", toCSV(
    ["Department","Total Spend (INR)","Expense Count"],
    byDept.map(d => [d.name, d.amount.toFixed(2), d.count])
  ));

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "expenses", label: "Expense Analysis" },
    { id: "budgets",  label: "Budget Analysis" },
    { id: "users",    label: "User Summary" },
  ];

  return (
    <AppLayout title="System Reports">
      {loading ? <Loading /> : (
        <>
          {/* KPI Strip */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-icon purple"><Icon name="users" size={20} /></div>
              <div><div className="stat-value">{users.length}</div><div className="stat-label">Total Users</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue"><Icon name="receipt" size={20} /></div>
              <div><div className="stat-value">{expenses.length}</div><div className="stat-label">Total Expenses</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><Icon name="rupee" size={20} /></div>
              <div>
                <div className="stat-value">&#8377;{(totalSpent / 1000).toFixed(0)}K</div>
                <div className="stat-label">Total Spend</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange"><Icon name="chart" size={20} /></div>
              <div><div className="stat-value">{budgets.length}</div><div className="stat-label">Active Budgets</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red"><Icon name="clock" size={20} /></div>
              <div><div className="stat-value">{pendingCount}</div><div className="stat-label">Pending Approval</div></div>
            </div>
          </div>

          {/* Tab nav */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
            {TABS.map(t => (
              <button key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "8px 16px", border: "none", cursor: "pointer", fontWeight: 600,
                  fontSize: 13, background: "none",
                  color: tab === t.id ? "var(--text-primary)" : "var(--text-muted)",
                  borderBottom: tab === t.id ? "2px solid var(--text-primary)" : "2px solid transparent",
                  transition: "all 0.15s", marginBottom: -1,
                }}
              >{t.label}</button>
            ))}
          </div>

          {/* ===== TAB: OVERVIEW ===== */}
          {tab === "overview" && (
            <>
              <div className="chart-grid" style={{ marginBottom: 20 }}>
                {/* Bar: Dept spending */}
                <div className="card chart-card">
                  <SectionHeader title="Spend by Department" onExport={exportDept} />
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={byDept}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" tick={axisStyle} />
                      <YAxis tick={axisStyle} tickFormatter={fmtK} />
                      <Tooltip formatter={v => [fmt(v), "Spend"]} contentStyle={tooltipStyle} />
                      <Bar dataKey="amount" radius={[4,4,0,0]}>
                        {byDept.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie: Users by Role */}
                <div className="card chart-card">
                  <SectionHeader title="Users by Role" onExport={exportUsers} />
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={byRole} cx="50%" cy="50%" outerRadius={90} innerRadius={45}
                        dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                        {byRole.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 11, color: "var(--text-muted)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Area: Monthly trend */}
              {monthly.length > 0 && (
                <div className="card" style={{ marginBottom: 20 }}>
                  <SectionHeader title="Monthly Spending Trend" />
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={monthly}>
                      <defs>
                        <linearGradient id="gtotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f8ef7" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#4f8ef7" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gapproved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#35c98a" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#35c98a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={axisStyle} />
                      <YAxis tick={axisStyle} tickFormatter={fmtK} />
                      <Tooltip formatter={v => [fmt(v)]} contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 11, color: "var(--text-muted)" }} />
                      <Area type="monotone" dataKey="total"    stroke="#4f8ef7" fill="url(#gtotal)"    name="Total Submitted" strokeWidth={2} />
                      <Area type="monotone" dataKey="approved" stroke="#35c98a" fill="url(#gapproved)" name="Approved"        strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}

          {/* ===== TAB: EXPENSE ANALYSIS ===== */}
          {tab === "expenses" && (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                <button className="btn btn-ghost btn-sm" onClick={exportExpenses} style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <Icon name="download" size={14} /> Export All Expenses CSV
                </button>
              </div>

              <div className="chart-grid" style={{ marginBottom: 20 }}>
                {/* Horizontal bar: By category */}
                <div className="card chart-card">
                  <SectionHeader title="Spend by Category" />
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={byCat.slice(0,8)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" tick={axisStyle} tickFormatter={fmtK} />
                      <YAxis type="category" dataKey="name" tick={axisStyle} width={100} />
                      <Tooltip formatter={v => [fmt(v), "Spend"]} contentStyle={tooltipStyle} />
                      <Bar dataKey="amount" radius={[0,4,4,0]}>
                        {byCat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie: Status distribution */}
                <div className="card chart-card">
                  <SectionHeader title="Status Distribution" />
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={byStatus} cx="50%" cy="50%" outerRadius={100} innerRadius={50}
                        dataKey="count" nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                        {byStatus.map((s, i) => <Cell key={i} fill={STATUS_COLORS[s.name] || COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v, n, p) => [v + " expenses, \u20B9" + Number(p.payload.amount).toLocaleString("en-IN")]} contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status summary table */}
              <div className="card">
                <SectionHeader title="Expense Status Summary" />
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Status</th><th>Count</th><th>Total Amount</th><th>% of Count</th><th>% of Value</th></tr></thead>
                    <tbody>
                      {byStatus.map(s => (
                        <tr key={s.name}>
                          <td><span className={`badge badge-${s.name.toLowerCase()}`}>{s.name}</span></td>
                          <td style={{ fontWeight: 700 }}>{s.count}</td>
                          <td>&#8377;{s.amount.toLocaleString("en-IN")}</td>
                          <td style={{ color: "var(--text-muted)" }}>{expenses.length > 0 ? ((s.count / expenses.length) * 100).toFixed(1) : 0}%</td>
                          <td style={{ color: "var(--text-muted)" }}>{totalSpent > 0 ? ((s.amount / totalSpent) * 100).toFixed(1) : 0}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ===== TAB: BUDGET ANALYSIS ===== */}
          {tab === "budgets" && (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                <button className="btn btn-ghost btn-sm" onClick={exportBudgets} style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <Icon name="download" size={14} /> Export Budgets CSV
                </button>
              </div>

              <div className="chart-grid" style={{ marginBottom: 20 }}>
                {/* Radar: Budget utilization */}
                {budgetRadar.length > 2 && (
                  <div className="card chart-card">
                    <SectionHeader title="Budget Utilization by Department" />
                    <ResponsiveContainer width="100%" height={280}>
                      <RadarChart data={budgetRadar}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="dept" tick={axisStyle} />
                        <PolarRadiusAxis angle={30} domain={[0,100]} tick={axisStyle} />
                        <Radar name="Utilization %" dataKey="utilization" stroke="#4f8ef7" fill="#4f8ef7" fillOpacity={0.2} />
                        <Tooltip contentStyle={tooltipStyle} formatter={v => [`${v}%`, "Utilization"]} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Bar: Allocated vs Spent */}
                <div className="card chart-card">
                  <SectionHeader title="Allocated vs Spent" />
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={budgets.slice(0,8)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="department" tick={axisStyle} />
                      <YAxis tick={axisStyle} tickFormatter={fmtK} />
                      <Tooltip formatter={v => [fmt(v)]} contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 11, color: "var(--text-muted)" }} />
                      <Bar dataKey="allocatedAmount" name="Allocated" fill="#4f8ef7" radius={[4,4,0,0]} />
                      <Bar dataKey="spentAmount"     name="Spent"     fill="#ff4545" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Budget table */}
              <div className="card">
                <SectionHeader title="Budget Details" />
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Department</th><th>Category</th><th>Allocated</th><th>Spent</th><th>Remaining</th><th>Utilization</th><th>Status</th></tr></thead>
                    <tbody>
                      {budgets.map((b, i) => (
                        <tr key={b.id || i}>
                          <td style={{ fontWeight: 600 }}>{b.department}</td>
                          <td>{b.categoryName}</td>
                          <td>&#8377;{Number(b.allocatedAmount).toLocaleString("en-IN")}</td>
                          <td style={{ fontWeight: 600 }}>&#8377;{Number(b.spentAmount).toLocaleString("en-IN")}</td>
                          <td style={{ color: Number(b.remainingAmount) < 0 ? "var(--accent-red)" : "var(--accent-green)", fontWeight: 600 }}>
                            &#8377;{Number(b.remainingAmount).toLocaleString("en-IN")}
                          </td>
                          <td>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div className="progress-bar" style={{ width: 70 }}>
                                <div className={`progress-fill ${b.status?.toLowerCase()}`}
                                  style={{ width:`${Math.min(Number(b.utilizationPercentage),100)}%` }} />
                              </div>
                              <span style={{ fontSize:12 }}>{Number(b.utilizationPercentage).toFixed(1)}%</span>
                            </div>
                          </td>
                          <td><span className={`badge badge-${b.status?.toLowerCase()}`}>{b.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ===== TAB: USER SUMMARY ===== */}
          {tab === "users" && (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                <button className="btn btn-ghost btn-sm" onClick={exportUsers} style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <Icon name="download" size={14} /> Export Users CSV
                </button>
              </div>

              <div className="chart-grid" style={{ marginBottom: 20 }}>
                <div className="card chart-card">
                  <SectionHeader title="Users by Role" />
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={byRole}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" tick={axisStyle} />
                      <YAxis tick={axisStyle} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="value" name="Count" radius={[4,4,0,0]}>
                        {byRole.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card chart-card">
                  <SectionHeader title="Department Distribution" />
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={Object.entries(users.reduce((a,u)=>{a[u.department||"Other"]=(a[u.department||"Other"]||0)+1;return a;},{}))
                          .map(([name,value])=>({name,value}))}
                        cx="50%" cy="50%" outerRadius={95} dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                        {users.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User table */}
              <div className="card">
                <SectionHeader title="All Users" />
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Emp ID</th><th>Name</th><th>Email</th><th>Department</th><th>Role</th><th>Status</th></tr></thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td style={{ color:"var(--text-muted)", fontFamily:"monospace", fontSize:12 }}>{u.employeeId}</td>
                          <td style={{ fontWeight:600 }}>{u.firstName} {u.lastName}</td>
                          <td style={{ color:"var(--text-secondary)" }}>{u.email}</td>
                          <td>{u.department}</td>
                          <td><span className={`role-tag ${u.role}`}>{u.role?.replace(/_/g," ")}</span></td>
                          <td><span className={`badge ${u.active?"badge-approved":"badge-rejected"}`}>{u.active?"Active":"Inactive"}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </AppLayout>
  );
}