import { useState, useEffect } from "react";
import { authAPI } from "../../api/auth";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";

export default function AdminUsers() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(()=>{
    authAPI.getAllUsers().then(r=>setUsers(r.data?.data||[])).finally(()=>setLoad(false));
  },[]);

  const filtered = filter==="ALL" ? users : users.filter(u=>u.role===filter);

  return (
    <AppLayout title="User Management">
      <div className="card">
        <div className="card-header">
          <div><div className="card-title">👥 System Users</div>
            <div className="card-subtitle">{users.length} registered users</div></div>
          <div style={{display:"flex",gap:8}}>
            {["ALL","EMPLOYEE","MANAGER","FINANCE_ADMIN","SYSTEM_ADMIN"].map(r=>(
              <button key={r} className={`btn ${filter===r?"btn-primary":"btn-ghost"} btn-sm`} onClick={()=>setFilter(r)}>
                {r.replace("_"," ")}
              </button>
            ))}
          </div>
        </div>
        {loading ? <Loading /> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Employee ID</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map(u=>(
                  <tr key={u.id}>
                    <td style={{fontWeight:700}}>{u.firstName} {u.lastName}</td>
                    <td style={{color:"var(--text-secondary)"}}>{u.email}</td>
                    <td><span className={`role-tag ${u.role}`}>{u.role?.replace("_"," ")}</span></td>
                    <td>{u.department||"—"}</td>
                    <td style={{color:"var(--text-muted)"}}>{u.employeeId||"—"}</td>
                    <td><span className={`badge ${u.active?"badge-approved":"badge-rejected"}`}>{u.active?"Active":"Inactive"}</span></td>
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