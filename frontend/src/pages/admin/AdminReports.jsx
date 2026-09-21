import { useState, useEffect } from "react";
import { expenseAPI } from "../../api/expenses";
import { authAPI }    from "../../api/auth";
import { budgetAPI }  from "../../api/budgets";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#4f8ef7","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#f97316"];

export default function AdminReports() {
  const [expenses, setExp]  = useState([]);
  const [users, setUsers]   = useState([]);
  const [budgets, setBud]   = useState([]);
  const [loading, setLoad]  = useState(true);

  useEffect(()=>{
    Promise.all([
      expenseAPI.getAll(0,1000).then(r=>setExp(r.data?.data?.content||[])),
      authAPI.getAllUsers().then(r=>setUsers(r.data?.data||[])),
      budgetAPI.getAll().then(r=>setBud(r.data?.data||[])),
    ]).finally(()=>setLoad(false));
  },[]);

  const byDept = expenses.reduce((acc,e)=>{
    const ex=acc.find(x=>x.name===e.department);
    if(ex) ex.amount+=Number(e.amount||0); else acc.push({name:e.department||"Other",amount:Number(e.amount||0)});
    return acc;
  },[]).sort((a,b)=>b.amount-a.amount);

  const byRole = ["EMPLOYEE","MANAGER","FINANCE_ADMIN","SYSTEM_ADMIN"].map(r=>({
    name:r.replace("_"," "), value:users.filter(u=>u.role===r).length
  }));

  const totalSpent = expenses.reduce((s,e)=>s+Number(e.amount||0),0);

  return (
    <AppLayout title="System Reports">
      {loading ? <Loading /> : (
        <>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon purple">👥</div>
              <div><div className="stat-value">{users.length}</div><div className="stat-label">Total Users</div></div></div>
            <div className="stat-card"><div className="stat-icon blue">🧾</div>
              <div><div className="stat-value">{expenses.length}</div><div className="stat-label">Total Expenses</div></div></div>
            <div className="stat-card"><div className="stat-icon green">💰</div>
              <div><div className="stat-value">₹{(totalSpent/1000).toFixed(0)}K</div><div className="stat-label">Total Spend</div></div></div>
            <div className="stat-card"><div className="stat-icon orange">📊</div>
              <div><div className="stat-value">{budgets.length}</div><div className="stat-label">Active Budgets</div></div></div>
          </div>

          <div className="chart-grid">
            <div className="card chart-card">
              <div className="card-title" style={{marginBottom:16}}>Spend by Department</div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={byDept}>
                  <XAxis dataKey="name" tick={{fill:"#94a3b8",fontSize:11}}/>
                  <YAxis tick={{fill:"#94a3b8",fontSize:11}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
                  <Tooltip formatter={v=>`₹${Number(v).toLocaleString("en-IN")}`} contentStyle={{background:"#161928",border:"1px solid rgba(255,255,255,0.08)"}}/>
                  <Bar dataKey="amount" radius={[4,4,0,0]}>
                    {byDept.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card chart-card">
              <div className="card-title" style={{marginBottom:16}}>Users by Role</div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={byRole.filter(x=>x.value>0)} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                    label={({name,value})=>`${name}: ${value}`} labelLine={false}>
                    {byRole.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:"#161928",border:"1px solid rgba(255,255,255,0.08)"}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}