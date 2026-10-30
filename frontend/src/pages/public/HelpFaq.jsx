import { useState } from "react";
import PublicLayout from "../../components/layout/PublicLayout";

const FAQS = [
  { q: "What is SpendWise?",
    a: "SpendWise is a corporate expense management platform built with Spring Boot microservices and React. It lets employees submit expense claims, managers approve them, and finance admins manage budgets and reports." },
  { q: "How do I log in?",
    a: "Use the Login button in the navigation bar. Enter your corporate email and password. The system routes you to your role-specific dashboard automatically." },
  { q: "What are the four user roles?",
    a: "Employee: Submit and track expense claims. Manager: Approve or reject team expenses. Finance Admin: Manage budgets, categories, and run reports. System Admin: Full control including user management and audit logs." },
  { q: "How do I submit an expense?",
    a: "Log in as an Employee, navigate to New Expense in the sidebar, fill in the description, amount, category, and date, then click Submit for Approval." },
  { q: "How does budget tracking work?",
    a: "Finance Admins allocate budgets per department per category per month. The system automatically calculates utilization as expenses are approved. Alerts fire at 80% (Warning) and 100% (Critical)." },
  { q: "Can I export data?",
    a: "Yes. The Reports section supports CSV export for expenses, budgets, and user data. Use the Export CSV button in the reports page." },
  { q: "What happens after I submit an expense?",
    a: "Your manager receives a notification and can approve or reject it. You will receive a notification with the decision. Finance Admins can view all approved expenses for reconciliation." },
  { q: "Is my data secure?",
    a: "Yes. All API calls use JWT bearer tokens. Each role can only access its permitted endpoints. Audit logs record every login and significant action." },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button className="faq-q" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && <div className="faq-a">{a}</div>}
    </div>
  );
}

export default function HelpFaq() {
  return (
    <PublicLayout>
      <div className="pub-page">
        <div className="pub-container" style={{ maxWidth: 800 }}>
          <div className="pub-page-header">
            <div className="pub-label">HELP CENTER</div>
            <h1 className="pub-page-title">Frequently Asked Questions</h1>
            <p className="pub-page-sub">Find answers to common questions about using SpendWise.</p>
          </div>

          <div id="faq" className="faq-list">
            {FAQS.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
          </div>

          <div className="help-cta-box">
            <h3>Still have questions?</h3>
            <p>Use the Contact page to send us a message — we will respond as soon as possible.</p>
            <a href="/contact" className="btn btn-primary btn-sm">Contact Us</a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
