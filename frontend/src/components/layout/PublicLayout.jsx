import { useState, useEffect } from "react";
import PublicNav    from "./PublicNav";
import PublicFooter from "./PublicFooter";

export default function PublicLayout({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <div className="pub-layout">
      <PublicNav theme={theme} onToggleTheme={toggle} />
      <main className="pub-main">{children}</main>
      <PublicFooter />
    </div>
  );
}
