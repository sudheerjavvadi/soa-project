import { useState, useEffect } from "react";
import { budgetAPI }   from "../../api/budgets";
import { categoryAPI } from "../../api/categories";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";

const MONTHS = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DEPTS  = ["Engineering","Finance","Marketing","Operations","HR","Sales","Legal","Product"];

export default function BudgetManagement() {
  const [budgets, setBudgets] = useState([]);
  const [cats, setCats]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow]       = useState(false);
  const [msg,  setMsg]        = useState("");
  const now = new Date();
  const [form, setForm] = useState({ department:"Engineering", categoryId:"", categoryName:"",
    financialYear: now.getFullYear(), month: now.getMonth()+1, allocatedAmount:"" });

  const load = () => {
    Promise.all([
      budgetAPI.getAll().then(r => setBudgets(r.data?.data||[])),
      categoryAPI.getActive().then(r => setCats(r.data?.data||[])),
    ]).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);

  const save = async () => {
    const cat = cats.find(c=>c.id==form.categoryId);
    await budgetAPI.create({...form, categoryId:parseInt(form.categoryId),
      categoryName:cat?.name||"", allocatedAmount:parseFloat(form.allocatedAmount)});
    setMsg("Budget created!"); setShow(false); load(); setTimeout(()=>setMsg(""),3000);
  };

  return (
    <AppLayout title="Budget Management">
      {msg && <div className="alert alert-success" style={{position:"fixed",top:80,right:24,zIndex:999}}>✅ {msg}</div>}
      <div className="card">
        <div className="card-header">
          <div><div className="card-title">💰 Budget Management</div>
            <div className="card-subtitle">Allocate monthly budgets per department/category</div></div>
          <button className="btn btn-primary" onClick={()=>setShow(true)}>➕ New Budget</button>
        </div>
        {loading ? <Loading /> : budgets.length===0 ? (
          <div className="empty-state"><div className="empty-icon">💰</div><div className="empty-text">No budgets yet</div>
            <div className="empty-sub">Click "New Budget" to allocate a budget</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Department</th><th>Category</th><th>Month/Year</th><th>Allocated</th><th>Spent</th><th>Remaining</th><th>Utilization</th><th>Status</th></tr></thead>
              <tbody>
                {budgets.map(b => (
                  <tr key={b.id}>
                    <td style={{fontWeight:700}}>{b.department}</td>
                    <td>{b.categoryName}</td>
                    <td>{MONTHS[b.month]} {b.financialYear}</td>
                    <td>₹{Number(b.allocatedAmount).toLocaleString("en-IN")}</td>
                    <td style={{fontWeight:600}}>₹{Number(b.spentAmount).toLocaleString("en-IN")}</td>
                    <td style={{color:Number(b.remainingAmount)<0?"var(--accent-red)":"var(--accent-green)"}}>
                      ₹{Number(b.remainingAmount).toLocaleString("en-IN")}</td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div className="progress-bar" style={{width:70}}>
                          <div className={`progress-fill ${b.status?.toLowerCase()}`} style={{width:`${Math.min(Number(b.utilizationPercentage),100)}%`}}/>
                        </div>
                        <span style={{fontSize:12}}>{Number(b.utilizationPercentage).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {show && (
        <div className="modal-overlay" onClick={()=>setShow(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">➕ Allocate Budget</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="form-group"><label className="form-label">Department</label>
                <select className="form-select" value={form.department} onChange={e=>setForm(p=>({...p,department:e.target.value}))}>
                  {DEPTS.map(d=><option key={d}>{d}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Category</label>
                <select className="form-select" value={form.categoryId} onChange={e=>setForm(p=>({...p,categoryId:e.target.value}))}>
                  <option value="">Select…</option>
                  {cats.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div className="form-group"><label className="form-label">Month</label>
                  <select className="form-select" value={form.month} onChange={e=>setForm(p=>({...p,month:parseInt(e.target.value)}))}>
                    {MONTHS.slice(1).map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Year</label>
                  <input className="form-input" type="number" value={form.financialYear} onChange={e=>setForm(p=>({...p,financialYear:parseInt(e.target.value)}))} /></div>
              </div>
              <div className="form-group"><label className="form-label">Allocated Amount (₹)</label>
                <input className="form-input" type="number" placeholder="e.g. 50000" value={form.allocatedAmount} onChange={e=>setForm(p=>({...p,allocatedAmount:e.target.value}))} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShow(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Allocate Budget</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}