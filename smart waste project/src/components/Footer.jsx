import React from "react";
import { Recycle, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass-card" style={{
      margin: "32px 16px 16px 16px",
      padding: "24px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "16px",
      borderRadius: "16px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Recycle size={20} color="#10b981" />
        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
          Smart Waste Management System
        </span>
      </div>

      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
        Supporting efficient collection and recycling across service routes.
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600 }}>
        <ShieldCheck size={16} /> System status normal
      </div>
    </footer>
  );
}
