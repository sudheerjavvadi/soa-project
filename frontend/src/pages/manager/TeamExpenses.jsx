import { useState, useEffect } from "react";
import { expenseAPI } from "../../api/expenses";
import AppLayout from "../../components/layout/AppLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Loading from "../../components/common/Loading";

export default function TeamExpenses() {
  const [data, setData]   = useState({ content:[], totalPages:0 });
  const [page, setPage]   = useState(0);
  const [loading, setLoad]= useState(true);

  const load = (p) => {
    setLoad(true);
    expenseAPI.getAll(p,15).then(r=>setData(r.data?.data||{content:[],totalPages:0})).finally(()=>setLoad(false));
  };
  useEffect(()=>{ load(page); },[page]);

  const approve = async (id) => { await expenseAPI.approve(id); load(page); };
  const reject  = async (id) => { const r=prompt("Rejection reason:"); if(!r)return; await expenseAPI.reject(id,r); load(page); };

  return (
    <AppLayout title="Team Expenses">
      <div className="card">
        <div className="card-header">
          <div><div className="card-title">🧾 Team Expense Claims</div>
            <div className="card-subtitle">All expenses from your team</div></div>
        </div>
        {loading ? <Loading /> : data.content.length===0 ? (
          <div className="empty-state"><div className="empty-icon">🧾</div><div className="empty-text">No expenses yet</div></div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Exp #</th><th>Employee</th><th>Dept</th><th>Description</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.content.map(e=>(
                    <tr key={e.id}>
                      <td style={{color:"var(--accent-blue)",fontWeight:600}}>{e.expenseNumber}</td>
                      <td>{e.employeeName}</td>
                      <td style={{color:"var(--text-muted)"}}>{e.department}</td>
                      <td style={{maxWidth:160}}>{e.description}</td>
                      <td style={{fontWeight:700}}>₹{Number(e.amount).toLocaleString("en-IN")}</td>
                      <td>{e.expenseDate}</td>
                      <td><StatusBadge status={e.status}/></td>
                      <td>
                        {e.status==="SUBMITTED" && (
                          <div style={{display:"flex",gap:6}}>
                            <button className="btn btn-success btn-sm" onClick={()=>approve(e.id)}>✅</button>
                            <button className="btn btn-danger btn-sm"  onClick={()=>reject(e.id)}>❌</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.totalPages>1 && (
              <div className="pagination">
                {[...Array(data.totalPages)].map((_,i)=>(
                  <button key={i} className={`page-btn${page===i?" active":""}`} onClick={()=>setPage(i)}>{i+1}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}