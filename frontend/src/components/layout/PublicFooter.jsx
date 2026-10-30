import { Link } from "react-router-dom";

function LogoMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M14.5 8.5H10a1.5 1.5 0 0 0 0 3h4a1.5 1.5 0 0 1 0 3H9"/>
      <line x1="12" y1="6" x2="12" y2="8.5"/>
      <line x1="12" y1="14.5" x2="12" y2="18"/>
    </svg>
  );
}

const FOOTER_LINKS = {
  Product:  [
    { label: "Home",      to: "/home" },
    { label: "Features",  to: "/home#features" },
    { label: "Dashboard", to: "/login" },
    { label: "Reports",   to: "/login" },
  ],
  Company:  [
    { label: "About Us",   to: "/about" },
    { label: "Contact Us", to: "/contact" },
  ],
  Support:  [
    { label: "Help Center", to: "/help" },
    { label: "FAQs",        to: "/help#faq" },
    { label: "Feedback",    to: "/contact" },
  ],
  Legal:    [
    { label: "Privacy Policy",     to: "/privacy" },
    { label: "Terms & Conditions", to: "/terms" },
  ],
};

export default function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="pub-footer">
      <div className="pub-footer-inner">
        {/* Brand */}
        <div className="pub-footer-brand">
          <div className="pub-footer-logo">
            <LogoMark size={22} />
            <span>SpendWise</span>
          </div>
          <p className="pub-footer-desc">
            A modern corporate expense management platform built on Spring Boot microservices.
            Track, manage, and analyze your organization's finances in one place.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([section, links]) => (
          <div key={section} className="pub-footer-col">
            <div className="pub-footer-col-title">{section}</div>
            {links.map(l => (
              <Link key={l.label} to={l.to} className="pub-footer-link">{l.label}</Link>
            ))}
          </div>
        ))}
      </div>

      <div className="pub-footer-bottom">
        <span>&copy; {year} SpendWise. All rights reserved.</span>
        <span>Built with Spring Boot Microservices &middot; React &middot; JWT Auth</span>
      </div>
    </footer>
  );
}
