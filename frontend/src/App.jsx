import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public pages
import Home         from "./pages/public/Home";
import About        from "./pages/public/About";
import Contact      from "./pages/public/Contact";
import HelpFaq      from "./pages/public/HelpFaq";
import Privacy      from "./pages/public/Privacy";
import Terms        from "./pages/public/Terms";

// Auth
import Login from "./pages/auth/Login";

// Common
import ProfilePage  from "./pages/common/ProfilePage";
import SettingsPage from "./pages/common/SettingsPage";

// Employee
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MyExpenses        from "./pages/employee/MyExpenses";
import NewExpense        from "./pages/employee/NewExpense";
import Notifications     from "./pages/employee/Notifications";

// Manager
import ManagerDashboard  from "./pages/manager/ManagerDashboard";
import PendingApprovals  from "./pages/manager/PendingApprovals";
import TeamExpenses      from "./pages/manager/TeamExpenses";
import ManagerBudgets    from "./pages/manager/ManagerBudgets";
import ManagerReports    from "./pages/manager/ManagerReports";

// Finance
import FinanceDashboard  from "./pages/finance/FinanceDashboard";
import FinanceExpenses   from "./pages/finance/FinanceExpenses";
import BudgetManagement  from "./pages/finance/BudgetManagement";
import Reconciliation    from "./pages/finance/Reconciliation";
import Categories        from "./pages/finance/Categories";
import FinanceReports    from "./pages/finance/FinanceReports";

// Admin
import AdminDashboard    from "./pages/admin/AdminDashboard";
import AdminUsers        from "./pages/admin/AdminUsers";
import AdminExpenses     from "./pages/admin/AdminExpenses";
import AdminCategories   from "./pages/admin/AdminCategories";
import AdminBudgets      from "./pages/admin/AdminBudgets";
import AdminReports      from "./pages/admin/AdminReports";
import AuditLogs         from "./pages/admin/AuditLogs";

const ALL_ROLES = ["EMPLOYEE", "MANAGER", "FINANCE_ADMIN", "SYSTEM_ADMIN"];

/** Smart root redirect — logged-in users go straight to their dashboard */
function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/home" replace />;
  const routes = {
    SYSTEM_ADMIN:  "/admin/dashboard",
    FINANCE_ADMIN: "/finance/dashboard",
    MANAGER:       "/manager/dashboard",
    EMPLOYEE:      "/employee/dashboard",
  };
  return <Navigate to={routes[user.role] || "/employee/dashboard"} replace />;
}

/** Redirect logged-in users away from Login/Home pages */
function PublicRoute({ children }) {
  const { user } = useAuth();
  if (!user) return children;
  const routes = {
    SYSTEM_ADMIN:  "/admin/dashboard",
    FINANCE_ADMIN: "/finance/dashboard",
    MANAGER:       "/manager/dashboard",
    EMPLOYEE:      "/employee/dashboard",
  };
  return <Navigate to={routes[user.role] || "/employee/dashboard"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public — redirect to dashboard if already logged in */}
          <Route path="/home"    element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/about"   element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help"    element={<HelpFaq />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms"   element={<Terms />} />
          <Route path="/login"   element={<PublicRoute><Login /></PublicRoute>} />

          {/* Employee */}
          <Route path="/employee/dashboard"    element={<ProtectedRoute roles={ALL_ROLES}><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/employee/expenses"     element={<ProtectedRoute roles={ALL_ROLES}><MyExpenses /></ProtectedRoute>} />
          <Route path="/employee/new-expense"  element={<ProtectedRoute roles={ALL_ROLES}><NewExpense /></ProtectedRoute>} />
          <Route path="/employee/notifications" element={<ProtectedRoute roles={ALL_ROLES}><Notifications /></ProtectedRoute>} />
          <Route path="/employee/profile"      element={<ProtectedRoute roles={ALL_ROLES}><ProfilePage /></ProtectedRoute>} />
          <Route path="/employee/settings"     element={<ProtectedRoute roles={ALL_ROLES}><SettingsPage /></ProtectedRoute>} />

          {/* Manager */}
          <Route path="/manager/dashboard"     element={<ProtectedRoute roles={["MANAGER","FINANCE_ADMIN","SYSTEM_ADMIN"]}><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/manager/pending"       element={<ProtectedRoute roles={["MANAGER","FINANCE_ADMIN","SYSTEM_ADMIN"]}><PendingApprovals /></ProtectedRoute>} />
          <Route path="/manager/expenses"      element={<ProtectedRoute roles={["MANAGER","FINANCE_ADMIN","SYSTEM_ADMIN"]}><TeamExpenses /></ProtectedRoute>} />
          <Route path="/manager/budgets"       element={<ProtectedRoute roles={["MANAGER","FINANCE_ADMIN","SYSTEM_ADMIN"]}><ManagerBudgets /></ProtectedRoute>} />
          <Route path="/manager/reports"       element={<ProtectedRoute roles={["MANAGER","FINANCE_ADMIN","SYSTEM_ADMIN"]}><ManagerReports /></ProtectedRoute>} />
          <Route path="/manager/notifications" element={<ProtectedRoute roles={["MANAGER","FINANCE_ADMIN","SYSTEM_ADMIN"]}><Notifications /></ProtectedRoute>} />
          <Route path="/manager/profile"       element={<ProtectedRoute roles={["MANAGER","FINANCE_ADMIN","SYSTEM_ADMIN"]}><ProfilePage /></ProtectedRoute>} />
          <Route path="/manager/settings"      element={<ProtectedRoute roles={["MANAGER","FINANCE_ADMIN","SYSTEM_ADMIN"]}><SettingsPage /></ProtectedRoute>} />

          {/* Finance Admin */}
          <Route path="/finance/dashboard"      element={<ProtectedRoute roles={["FINANCE_ADMIN","SYSTEM_ADMIN"]}><FinanceDashboard /></ProtectedRoute>} />
          <Route path="/finance/expenses"       element={<ProtectedRoute roles={["FINANCE_ADMIN","SYSTEM_ADMIN"]}><FinanceExpenses /></ProtectedRoute>} />
          <Route path="/finance/budgets"        element={<ProtectedRoute roles={["FINANCE_ADMIN","SYSTEM_ADMIN"]}><BudgetManagement /></ProtectedRoute>} />
          <Route path="/finance/reconciliation" element={<ProtectedRoute roles={["FINANCE_ADMIN","SYSTEM_ADMIN"]}><Reconciliation /></ProtectedRoute>} />
          <Route path="/finance/categories"     element={<ProtectedRoute roles={["FINANCE_ADMIN","SYSTEM_ADMIN"]}><Categories /></ProtectedRoute>} />
          <Route path="/finance/reports"        element={<ProtectedRoute roles={["FINANCE_ADMIN","SYSTEM_ADMIN"]}><FinanceReports /></ProtectedRoute>} />
          <Route path="/finance/notifications"  element={<ProtectedRoute roles={["FINANCE_ADMIN","SYSTEM_ADMIN"]}><Notifications /></ProtectedRoute>} />
          <Route path="/finance/profile"        element={<ProtectedRoute roles={["FINANCE_ADMIN","SYSTEM_ADMIN"]}><ProfilePage /></ProtectedRoute>} />
          <Route path="/finance/settings"       element={<ProtectedRoute roles={["FINANCE_ADMIN","SYSTEM_ADMIN"]}><SettingsPage /></ProtectedRoute>} />

          {/* System Admin */}
          <Route path="/admin/dashboard"    element={<ProtectedRoute roles={["SYSTEM_ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users"        element={<ProtectedRoute roles={["SYSTEM_ADMIN"]}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/expenses"     element={<ProtectedRoute roles={["SYSTEM_ADMIN"]}><AdminExpenses /></ProtectedRoute>} />
          <Route path="/admin/categories"   element={<ProtectedRoute roles={["SYSTEM_ADMIN"]}><AdminCategories /></ProtectedRoute>} />
          <Route path="/admin/budgets"      element={<ProtectedRoute roles={["SYSTEM_ADMIN"]}><AdminBudgets /></ProtectedRoute>} />
          <Route path="/admin/reports"      element={<ProtectedRoute roles={["SYSTEM_ADMIN"]}><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/audit-logs"   element={<ProtectedRoute roles={["SYSTEM_ADMIN"]}><AuditLogs /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute roles={["SYSTEM_ADMIN"]}><Notifications /></ProtectedRoute>} />
          <Route path="/admin/profile"      element={<ProtectedRoute roles={["SYSTEM_ADMIN"]}><ProfilePage /></ProtectedRoute>} />
          <Route path="/admin/settings"     element={<ProtectedRoute roles={["SYSTEM_ADMIN"]}><SettingsPage /></ProtectedRoute>} />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
