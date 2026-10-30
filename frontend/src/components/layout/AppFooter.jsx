import { Link } from "react-router-dom";

export default function AppFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <span className="app-footer-brand">SpendWise &copy; {year}</span>
        <div className="app-footer-links">
          <Link to="/about"   className="app-footer-link">About</Link>
          <Link to="/privacy" className="app-footer-link">Privacy</Link>
          <Link to="/terms"   className="app-footer-link">Terms</Link>
          <Link to="/help"    className="app-footer-link">Help</Link>
          <Link to="/contact" className="app-footer-link">Contact</Link>
        </div>
        <span className="app-footer-tech">Built with Spring Boot Microservices · React · JWT</span>
      </div>
    </footer>
  );
}

