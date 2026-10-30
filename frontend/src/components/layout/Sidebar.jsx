import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = {
  EMPLOYEE: [
    { to: "/employee/dashboard",     icon: "grid",     label: "Dashboard" },
    { to: "/employee/expenses",       icon: "receipt",  label: "My Expenses" },
    { to: "/employee/new-expense",    icon: "plus",     label: "New Expense" },
    { to: "/employee/notifications",  icon: "bell",     label: "Notifications" },
  ],
  MANAGER: [
    { to: "/manager/dashboard",       icon: "grid",     label: "Dashboard" },
    { to: "/manager/pending",         icon: "clock",    label: "Pending Approvals" },
    { to: "/manager/expenses",        icon: "layers",   label: "Team Expenses" },
    { to: "/manager/budgets",         icon: "chart",    label: "Budgets" },
    { to: "/manager/reports",         icon: "bar",      label: "Reports" },
    { to: "/manager/notifications",   icon: "bell",     label: "Notifications" },
  ],
  FINANCE_ADMIN: [
    { to: "/finance/dashboard",       icon: "grid",     label: "Dashboard" },
    { to: "/finance/expenses",        icon: "layers",   label: "All Expenses" },
    { to: "/finance/budgets",         icon: "chart",    label: "Budget Management" },
    { to: "/finance/reconciliation",  icon: "balance",  label: "Reconciliation" },
    { to: "/finance/categories",      icon: "tag",      label: "Categories" },
    { to: "/finance/reports",         icon: "bar",      label: "Reports" },
    { to: "/finance/notifications",   icon: "bell",     label: "Notifications" },
  ],
  SYSTEM_ADMIN: [
    { to: "/admin/dashboard",         icon: "grid",     label: "Dashboard" },
    { to: "/admin/users",             icon: "users",    label: "Users" },
    { to: "/admin/expenses",          icon: "layers",   label: "All Expenses" },
    { to: "/admin/categories",        icon: "tag",      label: "Categories" },
    { to: "/admin/budgets",           icon: "chart",    label: "Budgets" },
    { to: "/admin/reports",           icon: "bar",      label: "Reports" },
    { to: "/admin/audit-logs",        icon: "shield",   label: "Audit Logs" },
    { to: "/admin/notifications",     icon: "bell",     label: "Notifications" },
  ],
};

const ROLE_LABEL = {
  EMPLOYEE: "Employee",
  MANAGER: "Manager",
  FINANCE_ADMIN: "Finance Admin",
  SYSTEM_ADMIN: "System Admin",
};

/* SVG icon map  lightweight, no dependency */
function NavIcon({ name }) {
  const icons = {
    grid: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    receipt: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/>
        <path d="M8 10h8M8 14h8M8 6h8"/>
      </svg>
    ),
    plus: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
    bell: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    clock: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    layers: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
    chart: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6"  y1="20" x2="6"  y2="14"/>
        <line x1="2"  y1="20" x2="22" y2="20"/>
      </svg>
    ),
    bar: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/>
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
      </svg>
    ),
    balance: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    tag: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
    users: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    shield: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    logout: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
  };
  return icons[name] || null;
}

/* SpendWise logo mark - SVG based, no emoji */
function BrandMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M14.5 8.5H10a1.5 1.5 0 0 0 0 3h4a1.5 1.5 0 0 1 0 3H9"/>
      <line x1="12" y1="6" x2="12" y2="8.5"/>
      <line x1="12" y1="14.5" x2="12" y2="18"/>
    </svg>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const links = NAV[user?.role] || NAV.EMPLOYEE;

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon"><BrandMark /></div>
        <span className="brand-name">SpendWise</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            <span className="nav-icon"><NavIcon name={l.icon} /></span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
