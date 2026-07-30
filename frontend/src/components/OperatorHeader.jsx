import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Cpu, Route, BarChart3, ArrowLeft } from "lucide-react";

const TABS = [
  { path: "/operator", label: "Overview", Icon: LayoutDashboard },
  { path: "/operator/iot-bins", label: "IoT Bins", Icon: Cpu },
  { path: "/operator/routes", label: "Routing", Icon: Route },
  { path: "/operator/analytics", label: "ESG Analytics", Icon: BarChart3 },
];

export default function OperatorHeader({ title }) {
  const { pathname } = useLocation();

  return (
    <header className="glass-card" style={{
      padding: "1rem 1.5rem",
      marginBottom: "2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "0.75rem",
      background: "var(--bg-2)",
      borderRadius: "var(--radius-xl)",
      border: "1px solid var(--border)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link to="/profile" style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          color: "var(--green-light)", fontSize: "0.85rem", fontWeight: 700
        }}>
          <ArrowLeft size={16} /> Exit Portal
        </Link>
        <div style={{ height: "20px", width: "1px", background: "var(--border)" }} />
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
          {title || "Municipal Operator Portal"}
        </h2>
      </div>

      <nav style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
        {TABS.map(({ path, label, Icon }) => (
          <Link key={path} to={path} style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            fontSize: "0.85rem", fontWeight: 600,
            color: pathname === path ? "var(--green-light)" : "var(--text-muted)"
          }}>
            <Icon size={16} /> {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
