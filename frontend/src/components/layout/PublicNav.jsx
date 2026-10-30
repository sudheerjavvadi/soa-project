import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LogoMark({ size = 26 }) {
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

function SunIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
}
function MoonIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
}
function MenuIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
}
function XIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

const NAV_LINKS = [
  { to: "/home",    label: "Home" },
  { to: "/about",   label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/help",    label: "Help" },
];

export default function PublicNav({ theme, onToggleTheme }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashRoute = {
    SYSTEM_ADMIN:  "/admin/dashboard",
    FINANCE_ADMIN: "/finance/dashboard",
    MANAGER:       "/manager/dashboard",
    EMPLOYEE:      "/employee/dashboard",
  };

  return (
    <nav className={`pub-nav${scrolled ? " scrolled" : ""}`}>
      <div className="pub-nav-inner">
        {/* Logo */}
        <Link to="/home" className="pub-logo">
          <LogoMark size={24} />
          <span>SpendWise</span>
        </Link>

        {/* Desktop links */}
        <div className="pub-nav-links">
          {NAV_LINKS.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => "pub-nav-link" + (isActive ? " active" : "")}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="pub-nav-actions">
          <button className="pub-theme-btn" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {user ? (
            <button className="btn btn-primary btn-sm" onClick={() => navigate(dashRoute[user.role] || "/employee/dashboard")}>
              My Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/login" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button className="pub-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="pub-mobile-menu" onClick={() => setMenuOpen(false)}>
          {NAV_LINKS.map(l => (
            <NavLink key={l.to} to={l.to} className="pub-mobile-link">{l.label}</NavLink>
          ))}
          <div className="pub-mobile-btns">
            {user ? (
              <button className="btn btn-primary" onClick={() => navigate(dashRoute[user.role] || "/employee/dashboard")}>
                My Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/login" className="btn btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
