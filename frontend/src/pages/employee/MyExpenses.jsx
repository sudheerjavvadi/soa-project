import { useState, useEffect } from "react";
import { Icon } from "../../components/common/Icons";
import { expenseAPI } from "../../api/expenses";
import AppLayout from "../../components/layout/AppLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Loading from "../../components/common/Loading";

export default function MyExpenses() {
  const [data, setData]     = useState({ content: [], totalPages: 0 });
  const [page, setPage]     = useState(0);
  const [loading, setLoading] = useState(true);

  const load = (p) => {
    setLoading(true);
    expenseAPI.getMy(p, 10)
      .then(r => setData(r.data?.data || { content: [], totalPages: 0 }))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  return (
    <AppLayout title="My Expenses">
      <div className="card">
        <div className="card-header">
          <div><div className="card-title">My Expense Claims</div>
            <div className="card-subtitle">All your submitted expense claims</div></div>
        </div>
        {loading ? <Loading /> : data.content.length === 0 ? (
          <div className="empty-state"><div class="empty-icon"><Icon name="receipt" size={48} style={{opacity:0.35}} /></div>
            <div className="empty-text">No expenses found</div></div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Expense #</th><th>Description</th><th>Category</th><th>Amount</th><th>Date</th><th>Status</th><th>Merchant</th></tr></thead>
                <tbody>
                  {data.content.map(e => (
                    <tr key={e.id}>
                      <td style={{color:"var(--accent-blue)",fontWeight:600}}>{e.expenseNumber}</td>
                      <td style={{maxWidth:200}}>{e.description}</td>
                      <td>{e.categoryName}</td>
                      <td style={{fontWeight:700}}>&#8377;{Number(e.amount).toLocaleString("en-IN")}</td>
                      <td>{e.expenseDate}</td>
                      <td><StatusBadge status={e.status} /></td>
                      <td style={{color:"var(--text-muted)"}}>{e.merchantName || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.totalPages > 1 && (
              <div className="pagination">
                {[...Array(data.totalPages)].map((_, i) => (
                  <button key={i} className={`page-btn${page===i?" active":""}`} onClick={() => setPage(i)}>{i+1}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
