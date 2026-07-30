import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Scan, Sparkles, Cpu, Route, ShieldCheck, Zap, RefreshCw } from "lucide-react";
import OperatorHeader from "../components/OperatorHeader";
import { INITIAL_IOT_BINS } from "../data/wasteData";

export default function OperatorDashboard() {
  const [bins] = useState(INITIAL_IOT_BINS);
  const urgentBinsCount = bins.filter(b => b.fillLevel >= 85).length;

  return (
    <div className="page-wide animate-fade-in">
      <OperatorHeader title="Municipal Operator Portal" />
      
      <div className="glass-card" style={{
        padding: "40px 32px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Subtle Accent Glow */}
        <div style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: "var(--green-glow)",
          pointerEvents: "none",
          filter: "blur(30px)"
        }} />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "32px",
          alignItems: "center",
          position: "relative",
          zIndex: 1
        }}>
          {/* Left Copy */}
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--green-glass)",
              border: "1px solid var(--border)",
              padding: "6px 14px",
              borderRadius: "20px",
              color: "var(--green-light)",
              fontSize: "0.82rem",
              fontWeight: 700,
              marginBottom: "18px"
            }}>
              <Sparkles size={14} />
              <span>Smart waste intelligence for campus operations</span>
            </div>

            <h1 style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              marginBottom: "16px"
            }}>
              Smarter waste operations with clear bin data and faster pickup planning
            </h1>

            <p style={{
              fontSize: "1.05rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: "28px",
              maxWidth: "580px"
            }}>
              Control your waste operations from one dashboard, with real-time bin status, pickup planning, and item recognition that makes sorting faster and simpler.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link to="/operator/routes" className="btn-primary" style={{ padding: "14px 26px", fontSize: "1rem", textDecoration: "none" }}>
                <Route size={20} />
                Optimize Routes
              </Link>

              <Link to="/operator/iot-bins" className="btn-secondary" style={{ padding: "14px 24px", fontSize: "0.95rem", textDecoration: "none" }}>
                <Cpu size={18} />
                View bin fleet ({bins.length})
              </Link>
            </div>
          </div>

          {/* Right Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px"
          }}>
            {/* Card 1 */}
            <div className="glass-card" style={{
              padding: "20px",
              background: "var(--bg-2)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>SORTING ACCURACY</span>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck size={18} color="#10b981" />
                </div>
              </div>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 4px 0", color: "#10b981" }}>98.6%</h2>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>Computer vision neural net model</p>
            </div>

            {/* Card 2 */}
            <div className="glass-card" style={{
              padding: "20px",
              background: "var(--bg-2)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>OVERFLOW ALERTS</span>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={18} color="#ef4444" />
                </div>
              </div>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 4px 0", color: urgentBinsCount > 0 ? "#ef4444" : "var(--green-light)" }}>
                {urgentBinsCount} <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-muted)" }}>High priority</span>
              </h2>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>Require immediate collection dispatch</p>
            </div>

            {/* Card 3 */}
            <div className="glass-card" style={{
              padding: "20px",
              background: "var(--bg-2)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>ROUTE SAVINGS</span>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Route size={18} color="#06b6d4" />
                </div>
              </div>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 4px 0", color: "#06b6d4" }}>38.4%</h2>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>Fuel & mileage reduction</p>
            </div>

            {/* Card 4 */}
            <div className="glass-card" style={{
              padding: "20px",
              background: "var(--bg-2)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>CO2 DIVERTED</span>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <RefreshCw size={18} color="#8b5cf6" />
                </div>
              </div>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 4px 0", color: "#8b5cf6" }}>14.2 T</h2>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>Carbon emissions offset this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
