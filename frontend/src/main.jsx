import { StrictMode } from "react";
import { createRoot }  from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Apply saved theme immediately to avoid flash-of-wrong-theme on load.
// Falls back to OS preference, then dark mode.
(function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
