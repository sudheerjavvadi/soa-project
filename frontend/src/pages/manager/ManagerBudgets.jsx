import { useState, useEffect } from "react";
import { budgetAPI } from "../../api/budgets";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";

export default function ManagerBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoad]    = useState(true);

  useEffect(()=>{
    budgetAPI.getAll().then(r=>setBudgets(r.data?.data||[])).finally(()=>setLoad(false));
  },[]);

  const alerts = budgets.filter(b=>["WARNING","CRITICAL","EXCEEDED"].includes(b.status));

  return (
    <AppLayout title="Budgets">
      {alerts.length>0 && (
        <div className="alert alert-warning" style={{marginBottom:16}}>
          ⚠️ {alerts.length} budget(s) have reached warning threshold!
        </div>
      )}
      <div className="card">
        <div className="card-header">
          <div><div className="card-title">💰 Department Budgets</div>
            <div className="card-subtitle">Current month budget overview</div></div>
        </div>
        {loading ? <Loading /> : budgets.length===0 ? (
          <div className="empty-state"><div className="empty-icon">💰</div>
            <div className="empty-text">No budgets configured</div>
            <div className="empty-sub">Contact Finance Admin to allocate budgets</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Department</th><th>Category</th><th>Allocated</th><th>Spent</th><th>Remaining</th><th>Utilization</th><th>Status</th></tr></thead>
              <tbody>
                {budgets.map(b=>(
                  <tr key={b.id}>
                    <td style={{fontWeight:700}}>{b.department}</td>
                    <td>{b.categoryName}</td>
                    <td>₹{Number(b.allocatedAmount).toLocaleString("en-IN")}</td>
                    <td style={{fontWeight:600}}>₹{Number(b.spentAmount).toLocaleString("en-IN")}</td>
                    <td style={{color:Number(b.remainingAmount)<0?"var(--accent-red)":"var(--accent-green)"}}>
                      ₹{Number(b.remainingAmount).toLocaleString("en-IN")}</td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div className="progress-bar" style={{width:80}}>
                          <div className={`progress-fill ${b.status?.toLowerCase()}`}
                            style={{width:`${Math.min(Number(b.utilizationPercentage),100)}%`}}/>
                        </div>
                        <span style={{fontSize:12,fontWeight:600}}>{Number(b.utilizationPercentage).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td><StatusBadge status={b.status}/></td>
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