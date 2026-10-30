import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PublicLayout from "../../components/layout/PublicLayout";

/* ── tiny inline SVG helpers ── */
function Ic({ d, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  );
}

const FEATURES = [
  {
    icon: <Ic d={<><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2"/><path d="M8 10h8M8 14h8M8 6h8"/></>} />,
    title: "Expense Tracking",
    desc: "Submit, track, and manage all expense claims in one place. Real-time status from draft to approval.",
  },
  {
    icon: <Ic d={<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></>} />,
    title: "Budget Planning",
    desc: "Allocate budgets by department and category. Get instant alerts when spending approaches limits.",
  },
  {
    icon: <Ic d={<><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></>} />,
    title: "Financial Reports",
    desc: "Interactive charts showing spending by department, category, and time period. Export to CSV.",
  },
  {
    icon: <Ic d={<><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>} />,
    title: "Category Management",
    desc: "Organize expenses into custom categories with budget limits and spending rules.",
  },
  {
    icon: <Ic d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
    title: "Role-Based Access",
    desc: "Four roles — Employee, Manager, Finance Admin, and System Admin — each with precise permissions.",
  },
  {
    icon: <Ic d={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>} />,
    title: "Secure & Auditable",
    desc: "JWT-secured APIs, complete audit logs, and WebSocket notifications for real-time updates.",
  },
];

const STEPS = [
  { num: "01", title: "Create Your Account", desc: "Register or log in with your corporate credentials. Your role is assigned by the system administrator." },
  { num: "02", title: "Record Expenses",      desc: "Submit expense claims with descriptions, amounts, categories, and receipts. Save drafts or submit for approval." },
  { num: "03", title: "Track & Analyze",      desc: "Monitor budget utilization, view detailed reports, and export data. Managers approve expenses in one click." },
];

const DEMO_CARDS = [
  { label: "Total Expenses",  value: "Rs. 1,95,400", color: "blue",   sub: "This month" },
  { label: "Approved",        value: "Rs. 1,42,000", color: "green",  sub: "Ready to process" },
  { label: "Pending Approval",value: "12 claims",    color: "orange", sub: "Awaiting review" },
  { label: "Budget Used",     value: "68%",           color: "purple", sub: "Within limits" },
];

export default function Home() {
  const { user } = useAuth();
  const dashRoute = { SYSTEM_ADMIN: "/admin/dashboard", FINANCE_ADMIN: "/finance/dashboard", MANAGER: "/manager/dashboard", EMPLOYEE: "/employee/dashboard" };

  return (
    <PublicLayout>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-dot-grid" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-badge">Corporate Finance Platform</div>
          <h1 className="hero-title">
            Take Control of<br />
            <span className="hero-accent">Your Finances.</span>
          </h1>
          <p className="hero-sub">
            Track expenses, manage budgets, and understand your money with
            one simple financial dashboard. Built on Spring Boot Microservices.
          </p>
          <div className="hero-btns">
            {user ? (
              <Link to={dashRoute[user.role] || "/employee/dashboard"} className="btn btn-primary hero-btn">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary hero-btn">Get Started Free</Link>
                <a href="#features" className="btn btn-ghost hero-btn">See Features</a>
              </>
            )}
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="hero-preview">
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-dot" style={{ background: "#ff4545" }} />
              <div className="preview-dot" style={{ background: "#f59e0b" }} />
              <div className="preview-dot" style={{ background: "#35c98a" }} />
              <span style={{ marginLeft: 8, fontSize: 11, color: "var(--text-muted)" }}>SpendWise Dashboard</span>
            </div>
            <div className="preview-kpis">
              {DEMO_CARDS.map(c => (
                <div key={c.label} className={`preview-kpi stat-icon ${c.color}`} style={{ background: "var(--bg-elevated)", borderRadius: 10, padding: "12px 14px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>{c.value}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{c.label}</div>
                </div>
              ))}
            </div>
            {/* Mini chart bars */}
            <div style={{ padding: "12px 14px 14px", borderTop: "1px solid var(--border)" }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 8 }}>Spending Trend</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 48 }}>
                {[35, 55, 42, 70, 48, 65, 80, 58, 72, 60, 85, 68].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "3px 3px 0 0",
                    background: i === 11 ? "#4f8ef7" : "var(--border-light)", transition: "all 0.3s" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEMO STATS ── */}
      <section className="pub-section pub-section-alt">
        <div className="pub-container">
          <div className="pub-label">DEMO PREVIEW — Sample figures for illustration only</div>
          <div className="pub-stats-row">
            {DEMO_CARDS.map(c => (
              <div key={c.label} className="pub-stat-card">
                <div className={`pub-stat-dot ${c.color}`} />
                <div className="pub-stat-value">{c.value}</div>
                <div className="pub-stat-label">{c.label}</div>
                <div className="pub-stat-sub">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="pub-section" id="features">
        <div className="pub-container">
          <div className="pub-section-header">
            <div className="pub-label">FEATURES</div>
            <h2 className="pub-section-title">Everything you need to manage finances</h2>
            <p className="pub-section-sub">A complete corporate expense management system — from employee claims to executive reports.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="pub-section pub-section-alt">
        <div className="pub-container">
          <div className="pub-section-header">
            <div className="pub-label">HOW IT WORKS</div>
            <h2 className="pub-section-title">Up and running in three steps</h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
                {i < STEPS.length - 1 && <div className="step-arrow" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="pub-section">
        <div className="pub-container">
          <div className="pub-section-header">
            <div className="pub-label">ARCHITECTURE</div>
            <h2 className="pub-section-title">Built for enterprise-grade reliability</h2>
          </div>
          <div className="tech-grid">
            {[
              ["Spring Boot 3", "Microservices architecture with 6 independent services"],
              ["Eureka Discovery", "Service registry and load balancing"],
              ["API Gateway", "Centralized routing and JWT authentication"],
              ["React + Vite", "Fast, modern frontend with role-based UI"],
              ["WebSocket", "Real-time notifications across all roles"],
              ["MySQL", "Persistent storage with separate schemas per service"],
            ].map(([title, desc]) => (
              <div key={title} className="tech-card">
                <div className="tech-title">{title}</div>
                <div className="tech-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pub-cta">
        <div className="pub-container" style={{ textAlign: "center" }}>
          <h2 className="pub-cta-title">Ready to streamline your expense management?</h2>
          <p className="pub-cta-sub">Sign in with your corporate credentials and start tracking in minutes.</p>
          <div className="hero-btns" style={{ justifyContent: "center" }}>
            <Link to="/login" className="btn btn-primary hero-btn">Sign In Now</Link>
            <Link to="/about" className="btn btn-ghost hero-btn">Learn More</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
