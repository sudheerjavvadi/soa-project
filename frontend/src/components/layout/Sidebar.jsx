import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = {
  EMPLOYEE: [
    { to: "/employee/dashboard", icon: "??", label: "Dashboard" },
    { to: "/employee/expenses",  icon: "??", label: "My Expenses" },
    { to: "/employee/new-expense",icon: "?", label: "New Expense" },
    { to: "/employee/notifications", icon: "??", label: "Notifications" },
  ],
  MANAGER: [
    { to: "/manager/dashboard",  icon: "??", label: "Dashboard" },
    { to: "/manager/pending",    icon: "?", label: "Pending Approvals" },
    { to: "/manager/expenses",   icon: "??", label: "Team Expenses" },
    { to: "/manager/budgets",    icon: "??", label: "Budgets" },
    { to: "/manager/reports",    icon: "??", label: "Reports" },
    { to: "/manager/notifications", icon: "??", label: "Notifications" },
  ],
  FINANCE_ADMIN: [
    { to: "/finance/dashboard",      icon: "??", label: "Dashboard" },
    { to: "/finance/expenses",       icon: "??", label: "All Expenses" },
    { to: "/finance/budgets",        icon: "??", label: "Budget Management" },
    { to: "/finance/reconciliation", icon: "??", label: "Reconciliation" },
    { to: "/finance/categories",     icon: "???", label: "Categories" },
    { to: "/finance/reports",        icon: "??", label: "Reports" },
    { to: "/finance/notifications",  icon: "??", label: "Notifications" },
  ],
  SYSTEM_ADMIN: [
    { to: "/admin/dashboard",  icon: "??", label: "Dashboard" },
    { to: "/admin/users",      icon: "??", label: "Users" },
    { to: "/admin/expenses",   icon: "??", label: "All Expenses" },
    { to: "/admin/categories", icon: "???", label: "Categories" },
    { to: "/admin/budgets",    icon: "??", label: "Budgets" },
    { to: "/admin/reports",    icon: "??", label: "Reports" },
    { to: "/admin/audit-logs", icon: "??", label: "Audit Logs" },
    { to: "/admin/notifications", icon: "??", label: "Notifications" },
  ],
};

const ROLE_LABEL = {
  EMPLOYEE: "Employee", MANAGER: "Manager",
  FINANCE_ADMIN: "Finance Admin", SYSTEM_ADMIN: "System Admin"
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const links = NAV[user?.role] || NAV.EMPLOYEE;
  const initials = ((user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")).toUpperCase() || "?";

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">??</div>
        <span className="brand-name">SpendWise</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>
            <span className="nav-icon">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">{initials}</div>
        <div>
          <div className="user-name">{user?.firstName} {user?.lastName}</div>
          <div className="user-role">{ROLE_LABEL[user?.role]}</div>
        </div>
        <button className="logout-btn" onClick={logout} title="Logout">?</button>
      </div>
    </div>
  );
}
