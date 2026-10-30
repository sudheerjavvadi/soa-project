import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DEMO = [
  { role: "System Admin",  email: "admin@spendwise.com",   pass: "Admin@123" },
  { role: "Finance Admin", email: "finance@spendwise.com", pass: "Finance@123" },
  { role: "Manager",       email: "manager@spendwise.com", pass: "Manager@123" },
  { role: "Employee",      email: "emp1@spendwise.com",    pass: "Emp@12345" },
];

function LogoMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M14.5 8.5H10a1.5 1.5 0 0 0 0 3h4a1.5 1.5 0 0 1 0 3H9"/>
      <line x1="12" y1="6" x2="12" y2="8.5"/>
      <line x1="12" y1="14.5" x2="12" y2="18"/>
    </svg>
  );
}

const FEATURES = [
  "JWT-secured microservice architecture",
  "Real-time WebSocket notifications",
  "Role-based access control (4 roles)",
  "Budget reconciliation & threshold alerts",
  "Financial analytics & reporting",
];

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const user = await login(form.email, form.password);
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
    <div className="login-page" style={{ position: "relative" }}>
      <div className="login-bg-decor" />

      {/* Left panel */}
      <div className="login-left slide-up">
        <div className="login-logo">
          <div className="login-logo-icon">
            <LogoMark size={26} />
          </div>
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
          {FEATURES.map(f => (
            <div className="login-feature" key={f}>
              <div className="feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel  form */}
      <div className="login-right">
        <div className="login-form-wrap fade-in">
          <h2 className="login-form-title">Welcome back</h2>
          <p className="login-form-sub">Sign in to your SpendWise account</p>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="form-input"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", display: "flex", padding: 0,
                  }}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              className="btn btn-primary login-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="demo-creds">
            <div className="demo-creds-title">Quick Demo Login</div>
            {DEMO.map(d => (
              <div className="demo-cred-item" key={d.role}>
                <span className="demo-role">{d.role}</span>
                <span style={{ color: "var(--text-secondary)", fontSize: 11 }}>{d.email}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => fillDemo(d)}>Use</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
