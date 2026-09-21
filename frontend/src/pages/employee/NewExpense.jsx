import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { expenseAPI } from "../../api/expenses";
import { categoryAPI } from "../../api/categories";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "../../components/layout/AppLayout";

export default function NewExpense() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    description: "", amount: "", currency: "INR",
    categoryId: "", expenseDate: new Date().toISOString().split("T")[0],
    merchantName: "", receiptUrl: "", notes: "",
  });

  useEffect(() => {
    categoryAPI.getActive()
      .then(r => setCategories(r.data?.data || []))
      .catch(() => {});
  }, []);

  const set = (k, v) => setForm(p => ({...p, [k]: v}));

  const handleSave = async (submit = false) => {
    if (!form.description || !form.amount || !form.categoryId) {
      setError("Description, amount, and category are required."); return;
    }
    setError(""); setSubmitting(true);
    try {
      const res = await expenseAPI.create({
        ...form, amount: parseFloat(form.amount),
        categoryId: parseInt(form.categoryId),
        employeeId: user.id, department: user.department,
        employeeName: `${user.firstName} ${user.lastName}`,
      });
      const id = res.data?.data?.id;
      if (submit && id) await expenseAPI.submit(id);
      setSuccess(submit ? "Expense submitted for approval!" : "Expense saved as draft.");
      setTimeout(() => navigate("/employee/expenses"), 1500);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save expense");
    } finally { setSubmitting(false); }
  };

  return (
    <AppLayout title="New Expense">
      <div style={{maxWidth:680}}>
        <h2 style={{fontSize:22,fontWeight:800,marginBottom:6}}>Submit Expense Claim</h2>
        <p style={{color:"var(--text-muted)",marginBottom:24}}>Fill in the details below and either save as draft or submit for manager approval.</p>

        {error   && <div className="alert alert-error">? {error}</div>}
        {success && <div className="alert alert-success">? {success}</div>}

        <div className="card">
          <div className="form-grid">
            <div className="form-group" style={{gridColumn:"1/-1"}}>
              <label className="form-label">Description *</label>
              <input className="form-input" placeholder="e.g. Flight tickets to Mumbai for client meeting"
                value={form.description} onChange={e => set("description", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Amount (?) *</label>
              <input className="form-input" type="number" min="0" step="0.01" placeholder="0.00"
                value={form.amount} onChange={e => set("amount", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-select" value={form.categoryId} onChange={e => set("categoryId", e.target.value)}>
                <option value="">Select category…</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Expense Date *</label>
              <input className="form-input" type="date" value={form.expenseDate} onChange={e => set("expenseDate", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Merchant / Vendor Name</label>
              <input className="form-input" placeholder="e.g. IndiGo Airlines"
                value={form.merchantName} onChange={e => set("merchantName", e.target.value)} />
            </div>
            <div className="form-group" style={{gridColumn:"1/-1"}}>
              <label className="form-label">Receipt URL (optional)</label>
              <input className="form-input" placeholder="https://drive.google.com/receipt.pdf"
                value={form.receiptUrl} onChange={e => set("receiptUrl", e.target.value)} />
            </div>
            <div className="form-group" style={{gridColumn:"1/-1"}}>
              <label className="form-label">Additional Notes</label>
              <textarea className="form-textarea" placeholder="Any additional details…"
                value={form.notes} onChange={e => set("notes", e.target.value)} />
            </div>
          </div>
          <div style={{display:"flex",gap:12,marginTop:24}}>
            <button className="btn btn-ghost" onClick={() => handleSave(false)} disabled={submitting}>
              ?? Save as Draft
            </button>
            <button className="btn btn-primary" onClick={() => handleSave(true)} disabled={submitting}>
              {submitting ? "Submitting…" : "?? Submit for Approval"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
