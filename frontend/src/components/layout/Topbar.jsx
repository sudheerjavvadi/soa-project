import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { notificationAPI } from "../../api/notifications";
import { useAuth } from "../../context/AuthContext";

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

const ROLE_PREFIXES = {
  EMPLOYEE: "/employee",
  MANAGER: "/manager",
  FINANCE_ADMIN: "/finance",
  SYSTEM_ADMIN: "/admin",
};

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread]       = useState(0);
  const [theme, setTheme]         = useState(() => localStorage.getItem("theme") || "dark");
  const [profileOpen, setProfile] = useState(false);
  const profileRef                = useRef(null);

  const initials = ((user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")).toUpperCase() || "U";
  const prefix   = ROLE_PREFIXES[user?.role] || "/employee";

  /* Apply theme on mount & change */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* Fetch unread count */
  useEffect(() => {
    const fetch = () => notificationAPI.getUnreadCount().then(r => setUnread(r.data?.data || 0)).catch(() => {});
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfile(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const goNotif = () => {
    navigate(`${prefix}/notifications`);
  };

  return (
    <div className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-actions">
        {/* Theme Toggle */}
        <button className="theme-toggle" onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme">
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Notification Bell */}
        <button className="notif-bell" onClick={goNotif} title="Notifications" style={{cursor:"pointer",border:"none",background:"var(--bg-elevated)"}}>
          <BellIcon />
          {unread > 0 && <span className="notif-count">{unread > 9 ? "9+" : unread}</span>}
        </button>

        {/* Profile Avatar + Dropdown */}
        <div className="profile-menu-wrap" ref={profileRef}>
          <button className="profile-avatar-btn" onClick={() => setProfile(o => !o)} title="Profile & Settings">
            <div className="topbar-avatar">{initials}</div>
          </button>

          {profileOpen && (
            <div className="profile-dropdown slide-up">
              {/* User info header */}
              <div className="pd-header">
                <div className="pd-avatar">{initials}</div>
                <div>
                  <div className="pd-name">{user?.firstName} {user?.lastName}</div>
                  <div className="pd-email">{user?.email}</div>
                  <span className={`role-tag ${user?.role}`} style={{marginTop:4,display:"inline-flex"}}>
                    {user?.role?.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
              <div className="pd-divider"/>
              {/* Menu items */}
              <button className="pd-item" onClick={() => { navigate(`${prefix}/profile`); setProfile(false); }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                My Profile
              </button>
              <button className="pd-item" onClick={() => { navigate(`${prefix}/settings`); setProfile(false); }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Settings
              </button>
              <button className="pd-item" onClick={() => { navigate(`${prefix}/notifications`); setProfile(false); }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                Notifications
                {unread > 0 && <span className="pd-badge">{unread > 9 ? "9+" : unread}</span>}
              </button>
              <div className="pd-divider"/>
              <button className="pd-item pd-item-danger" onClick={() => { setProfile(false); logout(); }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
