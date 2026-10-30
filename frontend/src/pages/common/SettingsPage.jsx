import { useState, useEffect } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { Icon } from "../../components/common/Icons";

export default function SettingsPage() {
  const [theme, setTheme]   = useState(() => localStorage.getItem("theme") || "dark");
  const [saved, setSaved]   = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const save = () => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppLayout title="Settings">
      {saved && (
        <div className="alert alert-success"
          style={{ position: "fixed", top: 80, right: 24, zIndex: 999, minWidth: 240 }}>
          <Icon name="success" size={16} /> Settings saved!
        </div>
      )}

      <div className="card" style={{ maxWidth: 580 }}>
        <div className="card-title" style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="shield" size={17} /> Appearance
        </div>

        <div className="form-group" style={{ marginBottom: 24 }}>
          <label className="form-label">Theme</label>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            {["dark", "light"].map(t => (
              <button key={t} onClick={() => setTheme(t)}
                className={`btn ${theme === t ? "btn-primary" : "btn-ghost"}`}
                style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 100 }}>
                {t === "dark" ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                )}
                {t.charAt(0).toUpperCase() + t.slice(1)} Mode
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 24, background: "var(--bg-elevated)" }}>
          <div className="card-title" style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <Icon name="bell" size={15} /> Notification Preferences
          </div>
          {[
            { label: "Expense submitted",   key: "notif_submitted",   def: true },
            { label: "Expense approved",    key: "notif_approved",    def: true },
            { label: "Expense rejected",    key: "notif_rejected",    def: true },
            { label: "Budget alerts",       key: "notif_budget",      def: true },
            { label: "Email notifications", key: "notif_email",       def: false },
          ].map(item => {
            const val = localStorage.getItem(item.key) !== null
              ? localStorage.getItem(item.key) === "true"
              : item.def;
            return (
              <div key={item.key} className="profile-row">
                <span className="profile-row-label" style={{ fontSize: 13 }}>{item.label}</span>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked={val}
                    onChange={e => localStorage.setItem(item.key, e.target.checked)} />
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{val ? "On" : "Off"}</span>
                </label>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-primary" onClick={save}>
            <Icon name="success" size={14} /> Save Settings
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

