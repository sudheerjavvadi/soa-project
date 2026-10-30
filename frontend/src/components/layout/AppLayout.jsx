import Sidebar from "./Sidebar";
import Topbar  from "./Topbar";
import AppFooter from "./AppFooter";

export default function AppLayout({ title, children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title={title} />
        <div className="page-content fade-in">
          {children}
        </div>
        <AppFooter />
      </div>
    </div>
  );
}
