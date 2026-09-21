import { useState, useEffect } from "react";
import { budgetAPI }  from "../../api/budgets";
import { expenseAPI } from "../../api/expenses";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#4f8ef7","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899"];

export default function FinanceDashboard() {
  const [budgets, setBudgets]  = useState([]);
  const [alerts, setAlerts]    = useState([]);
  const [recon, setRecon]      = useState([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      budgetAPI.getSummary().then(r => setBudgets(r.data?.data || [])),
      budgetAPI.getAlerts().then(r => setAlerts(r.data?.data || [])),
      budgetAPI.getReconciliation().then(r => setRecon(r.data?.data || [])),
    ]).finally(() => setLoading(false));
  }, []);

  const totalAllocated = budgets.reduce((s,b)=>s+Number(b.allocatedAmount||0),0);
  const totalSpent     = budgets.reduce((s,b)=>s+Number(b.spentAmount||0),0);
  const totalRemaining = totalAllocated - totalSpent;

  // Dept breakdown for pie chart
  const deptData = budgets.reduce((acc, b) => {
    const ex = acc.find(x => x.name === b.department);
    if (ex) ex.value += Number(b.spentAmount || 0);
    else acc.push({ name: b.department, value: Number(b.spentAmount || 0) });
    return acc;
  }, []);

  return (
    <AppLayout title="Finance Dashboard">
      {loading ? <Loading /> : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">??</div>
              <div><div className="stat-value">?{(totalAllocated/1000).toFixed(0)}K</div><div className="stat-label">Total Allocated</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">??</div>
              <div><div className="stat-value">?{(totalSpent/1000).toFixed(0)}K</div><div className="stat-label">Total Spent</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">??</div>
              <div><div className="stat-value">?{(totalRemaining/1000).toFixed(0)}K</div><div className="stat-label">Remaining</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red">??</div>
              <div><div className="stat-value">{alerts.length}</div><div className="stat-label">Budget Alerts</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">??</div>
              <div>
                <div className="stat-value">{totalAllocated>0?((totalSpent/totalAllocated)*100).toFixed(1):0}%</div>
                <div className="stat-label">Overall Utilization</div>
              </div>
            </div>
          </div>

          {/* Budget Alerts */}
          {alerts.length > 0 && (
            <div className="card" style={{marginBottom:24}}>
              <div className="card-title" style={{marginBottom:16}}>?? Budget Alerts</div>
              {alerts.map(a => (
                <div key={a.id} className={`alert alert-${a.status==="EXCEEDED"?"error":a.status==="CRITICAL"?"error":"warning"}`} style={{marginBottom:8}}>
                  <div>
                    <strong>{a.department} / {a.categoryName}</strong>
                    <span style={{marginLeft:12}}>
                      <StatusBadge status={a.status} />
                    </span>
                  </div>
                  <div style={{fontSize:12,marginTop:4}}>
                    ?{Number(a.spentAmount).toLocaleString("en-IN")} spent of ?{Number(a.allocatedAmount).toLocaleString("en-IN")} ({Number(a.utilizationPercentage).toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Charts */}
          <div className="chart-grid">
            {budgets.length > 0 && (
              <div className="card chart-card">
                <div className="card-title" style={{marginBottom:16}}>Budget Utilization by Category</div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={budgets.slice(0,6)}>
                    <XAxis dataKey="categoryName" tick={{fill:"#94a3b8",fontSize:10}} />
                    <YAxis tick={{fill:"#94a3b8",fontSize:10}} unit="%" />
                    <Tooltip formatter={v=>`${v}%`} contentStyle={{background:"#161928",border:"1px solid rgba(255,255,255,0.08)"}} />
                    <Bar dataKey="utilizationPercentage" radius={[4,4,0,0]}>
                      {budgets.map((b, i) => (
                        <Cell key={i} fill={b.utilizationPercentage>=100?"#ef4444":b.utilizationPercentage>=80?"#f59e0b":"#22c55e"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {deptData.length > 0 && (
              <div className="card chart-card">
                <div className="card-title" style={{marginBottom:16}}>Spending by Department</div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={deptData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                      {deptData.map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={v=>`?${Number(v).toLocaleString("en-IN")}`} contentStyle={{background:"#161928",border:"1px solid rgba(255,255,255,0.08)"}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Reconciliation Table */}
          <div className="card">
            <div className="card-title" style={{marginBottom:16}}>?? Budget Reconciliation — Current Month</div>
            {recon.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">??</div><div className="empty-text">No reconciliation data</div></div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Department</th><th>Category</th><th>Allocated</th><th>Spent</th><th>Remaining</th><th>Utilization</th><th>Status</th></tr></thead>
                  <tbody>
                    {recon.map((r, i) => (
                      <tr key={i}>
                        <td style={{fontWeight:600}}>{r.department}</td>
                        <td>{r.categoryName}</td>
                        <td>?{Number(r.allocatedBudget).toLocaleString("en-IN")}</td>
                        <td style={{fontWeight:600}}>?{Number(r.actualSpending).toLocaleString("en-IN")}</td>
                        <td style={{color:r.remainingBudget<0?"var(--accent-red)":"var(--accent-green)"}}>
                          ?{Number(r.remainingBudget).toLocaleString("en-IN")}
                        </td>
                        <td>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div className="progress-bar" style={{width:80}}>
                              <div className={`progress-fill ${r.budgetStatus?.toLowerCase()}`}
                                style={{width:`${Math.min(r.utilizationPercentage,100)}%`}} />
                            </div>
                            <span style={{fontSize:12}}>{Number(r.utilizationPercentage).toFixed(1)}%</span>
                          </div>
                        </td>
                        <td><StatusBadge status={r.budgetStatus} /></td>
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
