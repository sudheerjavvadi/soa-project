import { useState, useEffect } from "react";
import { expenseAPI } from "../../api/expenses";
import { budgetAPI }  from "../../api/budgets";
import { useAuth }    from "../../context/AuthContext";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#4f8ef7","#22c55e","#f59e0b","#ef4444","#8b5cf6"];

export default function ManagerReports() {
  const { user } = useAuth();
  const [expenses, setExp]  = useState([]);
  const [budgets, setBud]   = useState([]);
  const [loading, setLoad]  = useState(true);

  useEffect(()=>{
    Promise.all([
      expenseAPI.getPending(0).then(r=>setExp(r.data?.data?.content||[])),
      budgetAPI.getSummary().then(r=>setBud(r.data?.data||[])),
    ]).finally(()=>setLoad(false));
  },[]);

  const byStatus = [{name:"Pending",value:expenses.filter(e=>e.status==="SUBMITTED").length},
    {name:"Approved",value:expenses.filter(e=>e.status==="APPROVED").length},
    {name:"Rejected",value:expenses.filter(e=>e.status==="REJECTED").length}];

  return (
    <AppLayout title="Team Reports">
      {loading ? <Loading /> : (
        <>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon orange">⏳</div>
              <div><div className="stat-value">{expenses.length}</div><div className="stat-label">Pending Approvals</div></div></div>
            <div className="stat-card"><div className="stat-icon blue">💰</div>
              <div><div className="stat-value">{budgets.length}</div><div className="stat-label">Active Budgets</div></div></div>
            <div className="stat-card"><div className="stat-icon red">🚨</div>
              <div><div className="stat-value">{budgets.filter(b=>["WARNING","CRITICAL","EXCEEDED"].includes(b.status)).length}</div><div className="stat-label">Budget Alerts</div></div></div>
          </div>

          <div className="chart-grid">
            <div className="card chart-card">
              <div className="card-title" style={{marginBottom:16}}>Budget Utilization</div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={budgets.slice(0,6)}>
                  <XAxis dataKey="categoryName" tick={{fill:"#94a3b8",fontSize:11}}/>
                  <YAxis unit="%" tick={{fill:"#94a3b8",fontSize:11}}/>
                  <Tooltip formatter={v=>`${v}%`} contentStyle={{background:"#161928",border:"1px solid rgba(255,255,255,0.08)"}}/>
                  <Bar dataKey="utilizationPercentage" radius={[4,4,0,0]}>
                    {budgets.map((b,i)=><Cell key={i} fill={b.utilizationPercentage>=100?"#ef4444":b.utilizationPercentage>=80?"#f59e0b":"#22c55e"}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card chart-card">
              <div className="card-title" style={{marginBottom:16}}>Budget Status Distribution</div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={byStatus.filter(x=>x.value>0)} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                    label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                    {byStatus.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:"#161928",border:"1px solid rgba(255,255,255,0.08)"}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{marginBottom:16}}>Budget Overview</div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Category</th><th>Dept</th><th>Allocated</th><th>Spent</th><th>Utilization</th><th>Status</th></tr></thead>
                <tbody>
                  {budgets.map(b=>(
                    <tr key={b.id}>
                      <td style={{fontWeight:700}}>{b.categoryName}</td>
                      <td>{b.department}</td>
                      <td>₹{Number(b.allocatedAmount).toLocaleString("en-IN")}</td>
                      <td>₹{Number(b.spentAmount).toLocaleString("en-IN")}</td>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div className="progress-bar" style={{width:70}}>
                            <div className={`progress-fill ${b.status?.toLowerCase()}`} style={{width:`${Math.min(Number(b.utilizationPercentage),100)}%`}}/>
                          </div>
                          <span style={{fontSize:12}}>{Number(b.utilizationPercentage).toFixed(1)}%</span>
                        </div>
                      </td>
                      <td><StatusBadge status={b.status}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}