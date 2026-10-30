import PublicLayout from "../../components/layout/PublicLayout";

export default function Terms() {
  return (
    <PublicLayout>
      <div className="pub-page">
        <div className="pub-container pub-legal">
          <div className="pub-page-header">
            <div className="pub-label">LEGAL</div>
            <h1 className="pub-page-title">Terms &amp; Conditions</h1>
            <p className="pub-page-sub">Last updated: October 2026</p>
          </div>
          <div className="legal-note">
            SpendWise is an academic project. These Terms are provided for demonstration purposes only and do not constitute a legally binding agreement.
          </div>

          {[
            ["Acceptance of Terms",
              "By accessing and using SpendWise, you agree to use the system in accordance with your organization's expense management policies and the role permissions assigned to your account."],
            ["Permitted Use",
              "SpendWise is provided exclusively for corporate expense management within the authorized organization. Users must not attempt to access data or features beyond their assigned role permissions."],
            ["User Responsibilities",
              "Users are responsible for submitting accurate and legitimate expense claims. False or fraudulent expense submissions violate organizational policy and may result in account suspension."],
            ["Account Security",
              "Users are responsible for keeping their login credentials confidential. Sharing accounts is not permitted. Suspected unauthorized access must be reported to the System Administrator immediately."],
            ["Data Accuracy",
              "Users who enter expense data are responsible for its accuracy. Finance Admins and Managers who approve expenses confirm that submitted data is reasonable and within budget policies."],
            ["System Availability",
              "SpendWise is provided on an as-is basis as an academic project. No uptime or availability guarantees are made. The system may be taken offline for maintenance without prior notice."],
            ["Limitation of Liability",
              "As an academic project, SpendWise provides no warranties of any kind. The developers are not liable for any data loss, financial discrepancy, or business impact resulting from use of the system."],
            ["Changes to Terms",
              "These terms may be updated as the project evolves. Continued use of the system after changes are published constitutes acceptance of the updated terms."],
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
