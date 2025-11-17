import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const linkStyle = {
  color: "#374151",
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: "6px",
};

export default function App() {
  const loc = useLocation();
  return (
    <div>
      <header style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto", padding: "12px 16px" }}>
          <div style={{ fontWeight: 700, color: "#111827" }}>TechLearn LMS</div>
          <nav style={{ display: "flex", gap: 8 }}>
            <Link to="/dashboard" style={{ ...linkStyle, background: loc.pathname.startsWith("/dashboard") ? "#E5E7EB" : "transparent" }}>Dashboard</Link>
            <Link to="/courses" style={{ ...linkStyle, background: loc.pathname.startsWith("/courses") ? "#E5E7EB" : "transparent" }}>Courses</Link>
            <Link to="/login" style={{ ...linkStyle }}>Login</Link>
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
        <Outlet />
      </main>
    </div>
  );
}
