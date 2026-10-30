import { useState, useEffect } from "react";
import { Icon } from "../../components/common/Icons";
import { authAPI } from "../../api/auth";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";

const ROLES = ["EMPLOYEE", "MANAGER", "FINANCE_ADMIN", "SYSTEM_ADMIN"];
const DEPARTMENTS = ["Engineering", "Finance", "Marketing", "HR", "Operations", "IT", "Sales", "Legal"];

const EMPTY_FORM = {
  firstName: "", lastName: "", email: "", password: "",
  employeeId: "", department: "Engineering", role: "EMPLOYEE", phone: "",
};

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}

function ToggleIcon({ active }) {
  return active ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="3" fill="currentColor"/>
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="8" cy="12" r="3" fill="currentColor"/>
    </svg>
  );
}

export default function AdminUsers() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoad]      = useState(true);
  const [filter, setFilter]     = useState("ALL");
  const [modal, setModal]       = useState(null);   // null | "add" | "edit"
  const [editUser, setEditUser] = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState(null);   // {type, text}
  const [search, setSearch]     = useState("");
  const [confirmDel, setConfirmDel] = useState(null);

  const load = () => {
    setLoad(true);
    authAPI.getAllUsers()
      .then(r => setUsers(r.data?.data || []))
      .catch(() => flash("error", "Failed to load users"))
      .finally(() => setLoad(false));
  };

  useEffect(() => { load(); }, []);

  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  const filtered = users.filter(u => {
    const matchRole = filter === "ALL" || u.role === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (u.firstName + " " + u.lastName).toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.employeeId || "").toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal("add");
  };

  const openEdit = (u) => {
    setEditUser(u);
    setForm({
      firstName:  u.firstName  || "",
      lastName:   u.lastName   || "",
      email:      u.email      || "",
      password:   "",
      employeeId: u.employeeId || "",
      department: u.department || "Engineering",
      role:       u.role       || "EMPLOYEE",
      phone:      u.phone      || "",
    });
    setModal("edit");
  };

  const closeModal = () => { setModal(null); setEditUser(null); setForm(EMPTY_FORM); };

  const handleInput = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === "add") {
        await authAPI.register({
          ...form,
          active: true,
        });
        flash("success", `User ${form.firstName} ${form.lastName} added successfully!`);
      } else {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await authAPI.updateUser(editUser.id, payload);
        flash("success", `User ${form.firstName} ${form.lastName} updated successfully!`);
      }
      closeModal();
      load();
    } catch (err) {
      flash("error", err.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (u) => {
    try {
      await authAPI.updateUser(u.id, { active: !u.active });
      flash("success", `User ${u.active ? "deactivated" : "activated"} successfully`);
      load();
    } catch {
      flash("error", "Failed to update user status");
    }
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    try {
      await authAPI.updateUser(confirmDel.id, { active: false });
      flash("success", `User deactivated successfully`);
      setConfirmDel(null);
      load();
    } catch {
      flash("error", "Failed to deactivate user");
    }
  };

  return (
    <AppLayout title="User Management">
      {/* Toast */}
      {msg && (
        <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}
          style={{ position: "fixed", top: 80, right: 24, zIndex: 999, minWidth: 280, maxWidth: 400 }}>
          {msg.type === "success" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          )}
          {msg.text}
        </div>
      )}

      {/* Confirm Deactivate Dialog */}
      {confirmDel && (
        <div className="modal-overlay" onClick={() => setConfirmDel(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-title" style={{ color: "var(--accent-red)" }}>Deactivate User?</div>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 8 }}>
              Are you sure you want to deactivate <strong>{confirmDel.firstName} {confirmDel.lastName}</strong>?
              They will no longer be able to log in.
            </p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmDel(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Deactivate</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="users" size={18} />
              {modal === "add" ? "Add New User" : "Edit User"}
            </div>
            <form onSubmit={handleSave}>
              <div className="form-grid" style={{ marginBottom: 14 }}>
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input className="form-input" name="firstName" value={form.firstName} onChange={handleInput} required placeholder="John" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input className="form-input" name="lastName" value={form.lastName} onChange={handleInput} required placeholder="Doe" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input className="form-input" name="email" type="email" value={form.email} onChange={handleInput} required placeholder="john@spendwise.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">{modal === "add" ? "Password *" : "New Password (leave blank to keep)"}</label>
                  <input className="form-input" name="password" type="password" value={form.password}
                    onChange={handleInput} required={modal === "add"} placeholder="Min 8 characters" />
                </div>
                <div className="form-group">
                  <label className="form-label">Employee ID *</label>
                  <input className="form-input" name="employeeId" value={form.employeeId} onChange={handleInput} required placeholder="EMP001" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" name="phone" value={form.phone} onChange={handleInput} placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select className="form-select" name="department" value={form.department} onChange={handleInput}>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select className="form-select" name="role" value={form.role} onChange={handleInput}>
                    {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : modal === "add" ? "Add User" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="users" size={16} /> System Users
            </div>
            <div className="card-subtitle">{users.length} registered users · {users.filter(u => u.active).length} active</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                style={{ paddingLeft: 32, width: 200 }}
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            {/* Role filters */}
            {["ALL", "EMPLOYEE", "MANAGER", "FINANCE_ADMIN", "SYSTEM_ADMIN"].map(r => (
              <button key={r} className={`btn ${filter === r ? "btn-primary" : "btn-ghost"} btn-sm`} onClick={() => setFilter(r)}>
                {r.replace("_", " ")}
              </button>
            ))}
            {/* Add User */}
            <button className="btn btn-primary btn-sm" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add User
            </button>
          </div>
        </div>

        {loading ? <Loading /> : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="users" size={48} style={{ opacity: 0.3 }} /></div>
            <div className="empty-text">No users found</div>
            <div className="empty-sub">Try a different search or filter</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Employee ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700 }}>{u.firstName} {u.lastName}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{u.email}</td>
                    <td><span className={`role-tag ${u.role}`}>{u.role?.replace("_", " ")}</span></td>
                    <td>{u.department || "—"}</td>
                    <td style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>{u.employeeId || "—"}</td>
                    <td>
                      <span className={`badge ${u.active ? "badge-approved" : "badge-rejected"}`}>
                        {u.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="user-mgmt-actions">
                        <button className="action-btn" title="Edit user" onClick={() => openEdit(u)}>
                          <EditIcon />
                        </button>
                        <button className="action-btn success" title={u.active ? "Deactivate" : "Activate"}
                          onClick={() => toggleActive(u)}>
                          <ToggleIcon active={u.active} />
                        </button>
                        <button className="action-btn danger" title="Deactivate user"
                          onClick={() => setConfirmDel(u)}>
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
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
