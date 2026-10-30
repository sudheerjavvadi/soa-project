import { useState } from "react";
import PublicLayout from "../../components/layout/PublicLayout";

function InputField({ label, type = "text", name, value, onChange, required, placeholder }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}{required && " *"}</label>
      <input className="form-input" type={type} name={name} value={value}
        onChange={onChange} required={required} placeholder={placeholder} />
    </div>
  );
}

export default function Contact() {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | success | error

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    // NOTE: No backend endpoint for contact messages yet.
    // Validation passes but no message is actually sent.
    setStatus("success");
  };

  return (
    <PublicLayout>
      <div className="pub-page">
        <div className="pub-container" style={{ maxWidth: 900 }}>
          <div className="pub-page-header">
            <div className="pub-label">CONTACT</div>
            <h1 className="pub-page-title">Get in Touch</h1>
            <p className="pub-page-sub">
              Have a question about SpendWise? Fill in the form below.
            </p>
          </div>

          <div className="contact-grid">
            {/* Info */}
            <div className="contact-info">
              <h3 className="contact-info-title">Project Information</h3>
              {[
                ["Project Type",    "Academic SOA Project"],
                ["Technology",      "Spring Boot 3 + React 18"],
                ["Architecture",    "6 Microservices + API Gateway"],
                ["Authentication",  "JWT + Role-based Access Control"],
              ].map(([k, v]) => (
                <div key={k} className="contact-info-row">
                  <span className="contact-info-key">{k}</span>
                  <span className="contact-info-val">{v}</span>
                </div>
              ))}
              <div className="contact-note">
                <strong>Note:</strong> This is an academic project. No real support team monitors this form.
                Message delivery requires backend integration.
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-wrap">
              {status === "success" ? (
                <div className="contact-success">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#35c98a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <h3>Message Validated</h3>
                  <p>Your form was validated successfully. <strong>Note:</strong> Message delivery requires backend integration — no message has been sent yet.</p>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setStatus("idle"); setForm({ name:"", email:"", subject:"", message:"" }); }}>
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-grid">
                    <InputField label="Full Name"  name="name"    value={form.name}    onChange={set("name")}    required placeholder="Your name" />
                    <InputField label="Email"      name="email"   value={form.email}   onChange={set("email")}   required type="email" placeholder="you@example.com" />
                  </div>
                  <InputField label="Subject" name="subject" value={form.subject} onChange={set("subject")} placeholder="How can we help?" />
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea className="form-textarea" rows={5} value={form.message}
                      onChange={set("message")} required placeholder="Describe your question or feedback..." />
                  </div>
                  <div className="contact-notice">
                    This form performs frontend validation only. Backend message delivery is not yet implemented.
                  </div>
                  <button className="btn btn-primary" type="submit" style={{ width: "100%", justifyContent: "center" }}>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
