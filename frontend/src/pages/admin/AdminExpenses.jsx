import { useState, useEffect } from "react";
import { expenseAPI } from "../../api/expenses";
import AppLayout from "../../components/layout/AppLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Loading from "../../components/common/Loading";

export default function AdminExpenses() {
  const [data, setData]   = useState({ content:[], totalPages:0 });
  const [page, setPage]   = useState(0);
  const [loading, setLoad]= useState(true);

  useEffect(()=>{
    setLoad(true);
    expenseAPI.getAll(page,15).then(r=>setData(r.data?.data||{content:[],totalPages:0})).finally(()=>setLoad(false));
  },[page]);

  const total = data.content.reduce((s,e)=>s+Number(e.amount||0),0);

  return (
    <AppLayout title="All Expenses (Admin)">
      <div className="card">
        <div className="card-header">
          <div><div className="card-title">🧾 All Expenses — System Admin View</div>
            <div className="card-subtitle">Showing page {page+1} · Total on page: ₹{total.toLocaleString("en-IN")}</div></div>
        </div>
        {loading ? <Loading /> : data.content.length===0 ? (
          <div className="empty-state"><div className="empty-icon">🧾</div><div className="empty-text">No expenses</div></div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Exp #</th><th>Employee</th><th>Dept</th><th>Description</th><th>Category</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {data.content.map(e=>(
                    <tr key={e.id}>
                      <td style={{color:"var(--accent-blue)",fontWeight:600}}>{e.expenseNumber}</td>
                      <td>{e.employeeName}</td>
                      <td style={{color:"var(--text-muted)"}}>{e.department}</td>
                      <td style={{maxWidth:180}}>{e.description}</td>
                      <td>{e.categoryName}</td>
                      <td style={{fontWeight:700}}>₹{Number(e.amount).toLocaleString("en-IN")}</td>
                      <td>{e.expenseDate}</td>
                      <td><StatusBadge status={e.status}/></td>
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