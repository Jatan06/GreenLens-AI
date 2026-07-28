import React from "react";
import { 
  BarChart3, 
  Leaf, 
  TrendingUp, 
  PieChart, 
  CheckCircle2, 
  Award, 
  Download, 
  Globe, 
  Layers
} from "lucide-react";

export default function EsgAnalytics() {
  const materials = [
    { name: "Plastics (PET / HDPE)", percent: 35, tons: 4.9, color: "#3b82f6" },
    { name: "Paper & Cardboard", percent: 28, tons: 3.9, color: "#eab308" },
    { name: "Glass Containers", percent: 15, tons: 2.1, color: "#10b981" },
    { name: "Aluminum & Metals", percent: 12, tons: 1.7, color: "#06b6d4" },
    { name: "Organic Compost", percent: 7, tons: 1.0, color: "#22c55e" },
    { name: "E-Waste / Hazardous", percent: 3, tons: 0.4, color: "#ef4444" },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: "0 16px 32px 16px" }}>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(139, 92, 246, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <BarChart3 size={20} color="#8b5cf6" />
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>
              ESG sustainability analytics
            </h2>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Track environmental and compliance metrics across material recovery, diversion, and reporting.
          </p>
        </div>

        <button className="btn-secondary" style={{ gap: "8px" }}>
          <Download size={16} /> Export ESG Audit Report (PDF)
        </button>
      </div>

      {/* Overview Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        marginBottom: "28px"
      }}>
        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>LANDFILL DIVERSION</span>
            <Leaf size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#10b981", marginBottom: "4px" }}>87.4%</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>+12.3% vs previous quarter</div>
        </div>

        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>CO2 EQUIVALENT OFFSET</span>
            <Globe size={18} color="#06b6d4" />
          </div>
          <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#06b6d4", marginBottom: "4px" }}>14.2 Tons</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Equivalent to planting 640 trees</div>
        </div>

        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>TOTAL RECYCLED WEIGHT</span>
            <Layers size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#3b82f6", marginBottom: "4px" }}>14.0 Tons</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Processed across 6 smart zones</div>
        </div>

        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>ESG TARGET PROGRESS</span>
            <Award size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#8b5cf6", marginBottom: "4px" }}>92.5%</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>On track for 2026 Zero-Waste Goal</div>
        </div>
      </div>

      {/* Main Grid: Material Breakdown & Compliance Target */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: "24px"
      }}>
        {/* Material Distribution Breakdown */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <PieChart size={18} color="#10b981" /> Recovered Material Distribution
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {materials.map((m, idx) => (
              <div key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: "4px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: m.color, display: "inline-block" }} />
                    {m.name}
                  </span>
                  <span>{m.tons} Tons ({m.percent}%)</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "var(--bg-main)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{
                    width: `${m.percent}%`,
                    height: "100%",
                    background: m.color,
                    borderRadius: "4px"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ESG Sustainability Roadmap & Certificates */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 size={18} color="#06b6d4" /> 2026 Sustainability Roadmap Milestones
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ padding: "14px", background: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "12px" }}>
              <CheckCircle2 size={20} color="#10b981" />
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>100% Optical bin deployment</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Completed in Zone A, B, and C</div>
              </div>
            </div>

            <div style={{ padding: "14px", background: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "12px" }}>
              <CheckCircle2 size={20} color="#10b981" />
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Dynamic Electric Truck Route Logistics</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Fuel savings target exceeded by 14%</div>
              </div>
            </div>

            <div style={{ padding: "14px", background: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "12px" }}>
              <TrendingUp size={20} color="#3b82f6" />
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Zero Landfill Contamination Target</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Currently at 98.6% classification accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
