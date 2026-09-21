import { useState, useEffect } from "react";
import { expenseAPI } from "../../api/expenses";
import { budgetAPI }  from "../../api/budgets";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";

const COLORS = ["#4f8ef7","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#f97316"];

export default function FinanceReports() {
  const [expenses, setExp]  = useState([]);
  const [budgets, setBud]   = useState([]);
  const [loading, setLoad]  = useState(true);

  useEffect(()=>{
    Promise.all([
      expenseAPI.getAll(0,1000).then(r=>setExp(r.data?.data?.content||[])),
      budgetAPI.getAll().then(r=>setBud(r.data?.data||[])),
    ]).finally(()=>setLoad(false));
  },[]);

  // Category breakdown
  const byCat = expenses.reduce((acc,e)=>{
    const ex=acc.find(x=>x.name===e.categoryName);
    if(ex) ex.amount+=Number(e.amount||0); else acc.push({name:e.categoryName||"Other",amount:Number(e.amount||0)});
    return acc;
  },[]).sort((a,b)=>b.amount-a.amount);

  // Dept breakdown
  const byDept = expenses.reduce((acc,e)=>{
    const ex=acc.find(x=>x.name===e.department);
    if(ex) ex.amount+=Number(e.amount||0); else acc.push({name:e.department||"Other",amount:Number(e.amount||0)});
    return acc;
  },[]).sort((a,b)=>b.amount-a.amount);

  // Status breakdown
  const byStatus = ["DRAFT","SUBMITTED","APPROVED","REJECTED"].map(s=>({
    name:s, count:expenses.filter(e=>e.status===s).length,
    amount:expenses.filter(e=>e.status===s).reduce((s,e)=>s+Number(e.amount||0),0)
  }));

  const STATUS_COLORS = {DRAFT:"#64748b",SUBMITTED:"#4f8ef7",APPROVED:"#22c55e",REJECTED:"#ef4444"};

  return (
    <AppLayout title="Financial Reports">
      {loading ? <Loading /> : (
        <>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon blue">🧾</div>
              <div><div className="stat-value">{expenses.length}</div><div className="stat-label">Total Expenses</div></div></div>
            <div className="stat-card"><div className="stat-icon green">✅</div>
              <div><div className="stat-value">₹{expenses.filter(e=>e.status==="APPROVED").reduce((s,e)=>s+Number(e.amount||0),0).toLocaleString("en-IN")}</div><div className="stat-label">Approved Amount</div></div></div>
            <div className="stat-card"><div className="stat-icon orange">⏳</div>
              <div><div className="stat-value">{expenses.filter(e=>e.status==="SUBMITTED").length}</div><div className="stat-label">Pending</div></div></div>
            <div className="stat-card"><div className="stat-icon purple">💰</div>
              <div><div className="stat-value">{budgets.length}</div><div className="stat-label">Active Budgets</div></div></div>
          </div>

          <div className="chart-grid">
            <div className="card chart-card">
              <div className="card-title" style={{marginBottom:16}}>Spending by Category</div>
              {byCat.length===0?<div className="empty-state"><div className="empty-text">No data</div></div>:(
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={byCat.slice(0,8)} layout="vertical">
                    <XAxis type="number" tick={{fill:"#94a3b8",fontSize:11}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
                    <YAxis type="category" dataKey="name" tick={{fill:"#94a3b8",fontSize:11}} width={90}/>
                    <Tooltip formatter={v=>`₹${Number(v).toLocaleString("en-IN")}`} contentStyle={{background:"#161928",border:"1px solid rgba(255,255,255,0.08)"}}/>
                    <Bar dataKey="amount" radius={[0,4,4,0]}>
                      {byCat.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="card chart-card">
              <div className="card-title" style={{marginBottom:16}}>Spending by Department</div>
              {byDept.length===0?<div className="empty-state"><div className="empty-text">No data</div></div>:(
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={byDept} cx="50%" cy="50%" outerRadius={100} dataKey="amount"
                      label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                      {byDept.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                    </Pie>
                    <Tooltip formatter={v=>`₹${Number(v).toLocaleString("en-IN")}`} contentStyle={{background:"#161928",border:"1px solid rgba(255,255,255,0.08)"}}/>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{marginBottom:16}}>Expense Status Summary</div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Status</th><th>Count</th><th>Total Amount</th><th>% of Total</th></tr></thead>
                <tbody>
                  {byStatus.map(s=>(
                    <tr key={s.name}>
                      <td><span className={`badge badge-${s.name.toLowerCase()}`}>{s.name}</span></td>
                      <td style={{fontWeight:700}}>{s.count}</td>
                      <td>₹{s.amount.toLocaleString("en-IN")}</td>
                      <td style={{color:"var(--text-muted)"}}>{expenses.length>0?((s.count/expenses.length)*100).toFixed(1):0}%</td>
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