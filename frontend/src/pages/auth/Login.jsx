import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DEMO = [
  { role: "System Admin",   email: "admin@spendwise.com",   pass: "Admin@123" },
  { role: "Finance Admin",  email: "finance@spendwise.com", pass: "Finance@123" },
  { role: "Manager",        email: "manager@spendwise.com", pass: "Manager@123" },
  { role: "Employee",       email: "emp1@spendwise.com",    pass: "Emp@12345" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      // Route based on role
      const routes = {
        SYSTEM_ADMIN:  "/admin/dashboard",
        FINANCE_ADMIN: "/finance/dashboard",
        MANAGER:       "/manager/dashboard",
        EMPLOYEE:      "/employee/dashboard",
      };
      navigate(routes[user.role] || "/employee/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (d) => setForm({ email: d.email, password: d.pass });

  return (
    <div className="login-page">
      <div className="login-bg-decor" />

      {/* Left - Marketing */}
      <div className="login-left slide-up">
        <div className="login-logo">
          <div className="login-logo-icon">??</div>
          <span className="login-logo-name">SpendWise</span>
        </div>
        <h1 className="login-tagline">
          Corporate Finance,<br />
          <span>Reimagined.</span>
        </h1>
        <p className="login-desc">
          Real-time expense management, budget reconciliation, and financial analytics
          for modern enterprises. Built on Spring Boot Microservices.
        </p>
        <div className="login-features">
          {["JWT-secured microservice architecture","Real-time WebSocket notifications","Role-based access control (4 roles)","Budget reconciliation & threshold alerts","Financial analytics & reporting"].map(f => (
            <div className="login-feature" key={f}><div className="feature-dot" />{f}</div>
          ))}
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="login-right">
        <div className="login-form-wrap fade-in">
          <h2 className="login-form-title">Welcome back</h2>
          <p className="login-form-sub">Sign in to your SpendWise account</p>

          {error && <div className="alert alert-error">? {error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@company.com"
                value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required />
            </div>
            <button className="btn btn-primary login-submit" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In ?"}
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="demo-creds">
            <div className="demo-creds-title">? Quick Demo Login</div>
            {DEMO.map(d => (
              <div className="demo-cred-item" key={d.role}>
                <span className="demo-role">{d.role}</span>
                <span style={{color:"var(--text-secondary)",fontSize:11}}>{d.email}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => fillDemo(d)}>Use</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
