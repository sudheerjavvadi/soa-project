import Sidebar from "./Sidebar";
import Topbar  from "./Topbar";

export default function AppLayout({ title, children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title={title} />
        <div className="page-content fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}
