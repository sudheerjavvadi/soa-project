import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../api/auth";
import AppLayout from "../../components/layout/AppLayout";
import { Icon } from "../../components/common/Icons";

const ROLE_LABEL = {
  EMPLOYEE: "Employee", MANAGER: "Manager",
  FINANCE_ADMIN: "Finance Admin", SYSTEM_ADMIN: "System Admin",
};

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({
    firstName:  user?.firstName  || "",
    lastName:   user?.lastName   || "",
    phone:      user?.phone      || "",
    department: user?.department || "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState(null);

  const initials = ((user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")).toUpperCase() || "U";

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authAPI.updateUser(user.id, form);
      // Update stored user
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const updated = { ...stored, ...form };
      localStorage.setItem("user", JSON.stringify(updated));
      setMsg({ type: "success", text: "Profile updated successfully!" });
      setEditing(false);
      setTimeout(() => setMsg(null), 3000);
    } catch {
      setMsg({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const rows = [
    { label: "Employee ID",  value: user?.employeeId },
    { label: "Email",        value: user?.email },
    { label: "Department",   value: user?.department },
    { label: "Role",         value: ROLE_LABEL[user?.role] },
    { label: "Phone",        value: user?.phone || "—" },
    { label: "Account Status", value: "Active" },
  ];

  return (
    <AppLayout title="My Profile">
      {msg && (
        <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}
          style={{ position: "fixed", top: 80, right: 24, zIndex: 999, minWidth: 280 }}>
          <Icon name={msg.type === "success" ? "success" : "error"} size={16} />
          {msg.text}
        </div>
      )}

      <div className="card profile-page-card">
        {/* Header */}
        <div className="profile-hero">
          <div className="profile-hero-avatar">{initials}</div>
          <div>
            <div className="profile-hero-name">{user?.firstName} {user?.lastName}</div>
            <div className="profile-hero-email">{user?.email}</div>
            <span className={`role-tag ${user?.role}`} style={{ marginTop: 6, display: "inline-flex" }}>
              {user?.role?.replace(/_/g, " ")}
            </span>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }}
            onClick={() => setEditing(v => !v)}>
            <Icon name="draft" size={14} /> {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Edit Form */}
        {editing ? (
          <form onSubmit={handleSave}>
            <div className="form-grid" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input className="form-input" value={form.department}
                  onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          /* Info Rows */
          <div>
            {rows.map(r => (
              <div key={r.label} className="profile-row">
                <span className="profile-row-label">{r.label}</span>
                <span className="profile-row-value">{r.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

