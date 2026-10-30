import PublicLayout from "../../components/layout/PublicLayout";

const TEAM = [
  { initials: "SA", name: "System Admin",  role: "Platform Architect",    color: "#8b5cf6" },
  { initials: "FA", name: "Finance Admin", role: "Financial Operations",  color: "#4f8ef7" },
  { initials: "MG", name: "Manager",       role: "Team Lead & Approvals", color: "#f59e0b" },
  { initials: "EM", name: "Employee",       role: "Expense Submitter",    color: "#35c98a" },
];

export default function About() {
  return (
    <PublicLayout>
      <div className="pub-page">
        <div className="pub-container">
          {/* Header */}
          <div className="pub-page-header">
            <div className="pub-label">ABOUT</div>
            <h1 className="pub-page-title">About SpendWise</h1>
            <p className="pub-page-sub">
              A corporate financial expense management platform built as a Service-Oriented Architecture
              project using Spring Boot microservices and React.
            </p>
          </div>

          {/* Mission */}
          <div className="about-section">
            <h2 className="about-h2">Our Mission</h2>
            <p className="about-p">
              SpendWise was designed to simplify corporate expense management for organizations of all sizes.
              By combining modern microservices architecture with an intuitive user interface, we help finance
              teams reduce manual work, improve budget visibility, and ensure every expense is properly
              reviewed and approved.
            </p>
            <p className="about-p">
              The platform supports four distinct roles — Employee, Manager, Finance Admin, and System Admin —
              each with precisely scoped permissions to ensure data security and operational efficiency.
            </p>
          </div>

          {/* Architecture */}
          <div className="about-section">
            <h2 className="about-h2">Technical Architecture</h2>
            <div className="about-arch-grid">
              {[
                { service: "Auth Service :8081",         desc: "JWT authentication, user management, and audit logs." },
                { service: "Expense Service :8082",      desc: "Expense submission, approval workflow, and history." },
                { service: "Category Service :8083",     desc: "Expense categories and budget limit configuration." },
                { service: "Budget Service :8084",       desc: "Budget allocation, utilization tracking, and alerts." },
                { service: "Notification Service :8086", desc: "Real-time WebSocket notifications for all events." },
                { service: "API Gateway :8080",          desc: "Centralized routing, JWT validation, and load balancing." },
              ].map(a => (
                <div key={a.service} className="arch-card">
                  <div className="arch-service">{a.service}</div>
                  <div className="arch-desc">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Roles */}
          <div className="about-section">
            <h2 className="about-h2">System Roles</h2>
            <div className="roles-grid">
              {TEAM.map(t => (
                <div key={t.name} className="role-card">
                  <div className="role-avatar" style={{ background: t.color }}>{t.initials}</div>
                  <div className="role-name">{t.name}</div>
                  <div className="role-desc">{t.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic note */}
          <div className="about-note">
            <strong>Academic Project Note:</strong> SpendWise is a Service-Oriented Architecture (SOA) project
            developed as part of an engineering curriculum. The system demonstrates real-world microservices
            patterns including service discovery, API gateway, inter-service communication via Feign clients,
            and role-based access control with JWT.
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
