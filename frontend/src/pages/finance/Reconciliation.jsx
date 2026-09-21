import { useState, useEffect } from "react";
import { budgetAPI } from "../../api/budgets";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";

const MONTHS = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Reconciliation() {
  const [data, setData]   = useState([]);
  const [loading, setLoad]= useState(true);

  useEffect(()=>{
    budgetAPI.getReconciliation().then(r=>setData(r.data?.data||[])).finally(()=>setLoad(false));
  },[]);

  const totalAlloc = data.reduce((s,r)=>s+Number(r.allocatedBudget||0),0);
  const totalSpent = data.reduce((s,r)=>s+Number(r.actualSpending||0),0);
  const totalLeft  = totalAlloc - totalSpent;

  return (
    <AppLayout title="Budget Reconciliation">
      <div className="stats-grid" style={{marginBottom:24}}>
        <div className="stat-card"><div className="stat-icon blue">💰</div>
          <div><div className="stat-value">₹{(totalAlloc/1000).toFixed(0)}K</div><div className="stat-label">Total Allocated</div></div></div>
        <div className="stat-card"><div className="stat-icon orange">📤</div>
          <div><div className="stat-value">₹{(totalSpent/1000).toFixed(0)}K</div><div className="stat-label">Actual Spent</div></div></div>
        <div className="stat-card"><div className="stat-icon green">💵</div>
          <div><div className="stat-value" style={{color:totalLeft<0?"var(--accent-red)":undefined}}>₹{(totalLeft/1000).toFixed(0)}K</div><div className="stat-label">Remaining</div></div></div>
        <div className="stat-card"><div className="stat-icon purple">📊</div>
          <div><div className="stat-value">{totalAlloc>0?((totalSpent/totalAlloc)*100).toFixed(1):0}%</div><div className="stat-label">Utilization</div></div></div>
      </div>

      <div className="card">
        <div className="card-header">
          <div><div className="card-title">⚖️ Budget vs Actual — Reconciliation Report</div>
            <div className="card-subtitle">Current month — sorted by utilization (highest first)</div></div>
        </div>
        {loading ? <Loading /> : data.length===0 ? (
          <div className="empty-state"><div className="empty-icon">⚖️</div>
            <div className="empty-text">No data yet</div>
            <div className="empty-sub">Create budgets and approve expenses to see reconciliation</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Department</th><th>Category</th><th>Period</th><th>Allocated</th><th>Actual Spent</th><th>Remaining</th><th>Utilization</th><th>Recon. Status</th><th>Budget Status</th></tr></thead>
              <tbody>
                {data.map((r,i) => (
                  <tr key={i}>
                    <td style={{fontWeight:700}}>{r.department}</td>
                    <td>{r.categoryName}</td>
                    <td style={{color:"var(--text-muted)"}}>{MONTHS[r.month]} {r.financialYear}</td>
                    <td>₹{Number(r.allocatedBudget).toLocaleString("en-IN")}</td>
                    <td style={{fontWeight:700}}>₹{Number(r.actualSpending).toLocaleString("en-IN")}</td>
                    <td style={{color:Number(r.remainingBudget)<0?"var(--accent-red)":"var(--accent-green)"}}>
                      ₹{Number(r.remainingBudget).toLocaleString("en-IN")}</td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div className="progress-bar" style={{width:80}}>
                          <div className={`progress-fill ${r.budgetStatus?.toLowerCase()}`}
                            style={{width:`${Math.min(Number(r.utilizationPercentage),100)}%`}}/>
                        </div>
                        <span style={{fontSize:12,fontWeight:600}}>{Number(r.utilizationPercentage).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${r.reconciliationStatus==="OVER_BUDGET"?"rejected":r.reconciliationStatus==="NEAR_LIMIT"?"under_review":"approved"}`}>
                        {r.reconciliationStatus?.replace("_"," ")}
                      </span>
                    </td>
                    <td><StatusBadge status={r.budgetStatus} /></td>
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