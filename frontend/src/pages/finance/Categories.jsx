import { useState, useEffect } from "react";
import { categoryAPI } from "../../api/categories";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";

export default function Categories() {
  const [cats, setCats]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow]   = useState(false);
  const [form, setForm]   = useState({ name:"", description:"", icon:"🏷️", budgetLimitPercentage:100 });
  const [msg,  setMsg]    = useState("");

  const load = () => { setLoading(true); categoryAPI.getAll().then(r => setCats(r.data?.data||[])).finally(()=>setLoading(false)); };
  useEffect(()=>{ load(); },[]);

  const save = async () => {
    await categoryAPI.create(form);
    setMsg("Category created!"); setShow(false); setForm({ name:"", description:"", icon:"🏷️", budgetLimitPercentage:100 });
    load(); setTimeout(()=>setMsg(""),3000);
  };

  return (
    <AppLayout title="Categories">
      {msg && <div className="alert alert-success" style={{position:"fixed",top:80,right:24,zIndex:999}}>✅ {msg}</div>}
      <div className="card">
        <div className="card-header">
          <div><div className="card-title">🏷️ Expense Categories</div>
            <div className="card-subtitle">{cats.length} categories configured</div></div>
          <button className="btn btn-primary" onClick={()=>setShow(true)}>➕ New Category</button>
        </div>
        {loading ? <Loading /> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Icon</th><th>Name</th><th>Description</th><th>Budget Limit %</th><th>Status</th></tr></thead>
              <tbody>
                {cats.map(c => (
                  <tr key={c.id}>
                    <td style={{fontSize:22}}>{c.icon}</td>
                    <td style={{fontWeight:700}}>{c.name}</td>
                    <td style={{color:"var(--text-secondary)"}}>{c.description}</td>
                    <td>{c.budgetLimitPercentage}%</td>
                    <td><span className={`badge ${c.active?"badge-approved":"badge-rejected"}`}>{c.active?"Active":"Inactive"}</span></td>
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
            <div className="modal-title">➕ New Category</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="form-group"><label className="form-label">Icon (emoji)</label>
                <input className="form-input" value={form.icon} onChange={e=>setForm(p=>({...p,icon:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Name *</label>
                <input className="form-input" placeholder="e.g. Travel" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Budget Limit %</label>
                <input className="form-input" type="number" value={form.budgetLimitPercentage} onChange={e=>setForm(p=>({...p,budgetLimitPercentage:parseInt(e.target.value)}))} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShow(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Create Category</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}