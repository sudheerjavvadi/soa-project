import { Icon } from "../../components/common/Icons";
import { useState, useEffect } from "react";
import { categoryAPI } from "../../api/categories";
import AppLayout from "../../components/layout/AppLayout";
import Loading from "../../components/common/Loading";

export default function Categories() {
  const [cats, setCats]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow]     = useState(false);
  const [form, setForm]     = useState({ name: "", description: "", icon: "", budgetLimitPercentage: 100 });
  const [msg,  setMsg]      = useState(null);

  const load = () => {
    setLoading(true);
    categoryAPI.getAll().then(r => setCats(r.data?.data || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name.trim()) return;
    try {
      await categoryAPI.create(form);
      setMsg("Category created successfully!");
      setShow(false);
      setForm({ name: "", description: "", icon: "", budgetLimitPercentage: 100 });
      load();
      setTimeout(() => setMsg(null), 3000);
    } catch {
      setMsg("Failed to create category.");
      setTimeout(() => setMsg(null), 3000);
    }
  };

  return (
    <AppLayout title="Categories">
      {/* Toast */}
      {msg && (
        <div className="alert alert-success" style={{ position: "fixed", top: 80, right: 24, zIndex: 999, minWidth: 260 }}>
          <Icon name="success" size={16} /> {msg}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="category" size={18} /> Expense Categories
            </div>
            <div className="card-subtitle">{cats.length} categories configured</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShow(true)}>
            <Icon name="add" size={15} /> New Category
          </button>
        </div>

        {loading ? <Loading /> : cats.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="empty" size={48} style={{ opacity: 0.35 }} /></div>
            <div className="empty-text">No categories yet</div>
            <div className="empty-sub">Click "New Category" to create one</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Budget Limit %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cats.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontSize: 22 }}>{c.icon || <Icon name="category" size={20} />}</td>
                    <td style={{ fontWeight: 700 }}>{c.name}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{c.description}</td>
                    <td>{c.budgetLimitPercentage}%</td>
                    <td>
                      <span className={`badge ${c.active ? "badge-approved" : "badge-rejected"}`}>
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Category Modal */}
      {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="add" size={18} /> New Category
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Icon (emoji or text)</label>
                <input className="form-input" placeholder="e.g. ✈ or Travel" value={form.icon}
                  onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" placeholder="e.g. Travel" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Brief description..." value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Budget Limit %</label>
                <input className="form-input" type="number" min="1" max="200" value={form.budgetLimitPercentage}
                  onChange={e => setForm(p => ({ ...p, budgetLimitPercentage: parseInt(e.target.value) }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={!form.name.trim()} onClick={save}>
                <Icon name="success" size={14} /> Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
