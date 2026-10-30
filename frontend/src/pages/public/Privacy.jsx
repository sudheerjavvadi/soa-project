import PublicLayout from "../../components/layout/PublicLayout";

export default function Privacy() {
  return (
    <PublicLayout>
      <div className="pub-page">
        <div className="pub-container pub-legal">
          <div className="pub-page-header">
            <div className="pub-label">LEGAL</div>
            <h1 className="pub-page-title">Privacy Policy</h1>
            <p className="pub-page-sub">Last updated: October 2026</p>
          </div>
          <div className="legal-note">
            SpendWise is an academic project. This Privacy Policy is provided for demonstration purposes only and does not constitute a legally binding document.
          </div>

          {[
            ["Information We Collect",
              "SpendWise collects user account information (name, corporate email, department, employee ID) and financial transaction data (expense amounts, categories, dates, descriptions) strictly for the purpose of operating the expense management system. No personal financial data beyond corporate expense claims is collected."],
            ["How We Use Your Information",
              "Account data is used for authentication, role assignment, and system access. Expense data is used to process claims, calculate budget utilization, and generate organizational reports. Audit log data is stored to ensure accountability and detect unauthorized access."],
            ["Data Storage",
              "All data is stored in MySQL databases, one per microservice, running within the organization's infrastructure. No data is shared with third-party services. JWT tokens are short-lived and stored only in the browser's localStorage."],
            ["Data Access Controls",
              "Access to data is strictly role-based. Employees see only their own expenses. Managers see their team's expenses. Finance Admins see organization-wide expense and budget data. System Admins have access to all data including audit logs."],
            ["Data Retention",
              "Expense and budget records are retained for the duration of the financial year. Audit logs are retained for system review. Data deletion requires a request to the System Administrator."],
            ["Security",
              "The system uses JWT-based authentication with short-lived tokens, HTTPS for all API communications in production, and Spring Security for endpoint authorization. Passwords are never stored in plain text."],
            ["Changes to This Policy",
              "This policy may be updated as the project evolves. Changes will be reflected on this page with an updated date."],
          ].map(([title, body]) => (
            <div key={title} className="legal-section">
              <h2 className="legal-h2">{title}</h2>
              <p className="legal-p">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
