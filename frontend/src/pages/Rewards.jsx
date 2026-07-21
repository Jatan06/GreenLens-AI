import { useEffect, useState } from "react";

const MILESTONES = [
  { label: "Eco Novice",     pts: 0,    icon: "🌱", color: "#6b7280" },
  { label: "Green Explorer", pts: 100,  icon: "🍃", color: "#22c55e" },
  { label: "Eco Warrior",    pts: 300,  icon: "⚡", color: "#3b82f6" },
  { label: "Green Champion", pts: 600,  icon: "🏆", color: "#f59e0b" },
  { label: "Planet Guardian",pts: 1000, icon: "🌍", color: "#a855f7" },
];

function getCurrentMilestone(pts) {
  let current = MILESTONES[0];
  let next = MILESTONES[1];
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    if (pts >= MILESTONES[i].pts) { current = MILESTONES[i]; next = MILESTONES[i + 1] || null; break; }
  }
  return { current, next };
}

function ProgressBar({ value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ background: "var(--surface-2)", borderRadius: "999px", height: 8, overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`, height: "100%",
        background: color || "var(--green-primary)",
        borderRadius: "999px",
        transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: `0 0 10px ${color || "var(--green-primary)"}60`,
      }} />
    </div>
  );
}

export default function Rewards() {
  const [points, setPoints]   = useState(0);
  const [scans, setScans]     = useState(0);
  const [carbon, setCarbon]   = useState(0);

  useEffect(() => {
    setPoints(parseInt(localStorage.getItem("glPoints") || "0", 10));
    setScans(parseInt(localStorage.getItem("glScans") || "0", 10));
    setCarbon(parseFloat(localStorage.getItem("glCarbon") || "0"));
  }, []);

  const { current, next } = getCurrentMilestone(points);
  const progressPts  = points - current.pts;
  const progressMax  = next ? next.pts - current.pts : 1;
  const progressPct  = next ? Math.round((progressPts / progressMax) * 100) : 100;

  return (
    <main className="page page-enter" style={{ paddingBottom: "7rem" }}>
      {/* Header */}
      <header style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontWeight: 800, fontSize: "1.2rem" }}>🏆 Rewards &amp; Impact</h2>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Your eco journey so far</p>
      </header>

      {/* Milestone card */}
      <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.25rem", textAlign: "center" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>{current.icon}</div>
        <h3 style={{ fontWeight: 800, fontSize: "1.35rem", color: current.color }}>{current.label}</h3>
        <p style={{ fontSize: "2rem", fontWeight: 900, color: "var(--green-primary)", margin: "0.35rem 0" }}>
          {points.toLocaleString()}
          <span style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 500 }}> pts</span>
        </p>

        {next ? (
          <>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              {progressPts} / {progressMax} pts to <strong style={{ color: current.color }}>{next.label}</strong>
            </p>
            <ProgressBar value={progressPts} max={progressMax} color={current.color} />
          </>
        ) : (
          <p style={{ fontSize: "0.85rem", color: current.color, fontWeight: 600, marginTop: "0.5rem" }}>
            🎉 Max level reached! You're a Planet Guardian!
          </p>
        )}
      </div>

      {/* Stats row */}
      <div className="stat-row mb-2">
        <div className="stat-chip">
          <span className="value">{scans}</span>
          <span className="label">Total Scans</span>
        </div>
        <div className="stat-chip">
          <span className="value">{carbon}kg</span>
          <span className="label">CO₂ Saved</span>
        </div>
        <div className="stat-chip">
          <span className="value" style={{ color: "#facc15" }}>{points}</span>
          <span className="label">Green Points</span>
        </div>
      </div>

      {/* Milestone ladder */}
      <div className="section-header mt-2">
        <span className="section-title">Milestone Ladder</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {MILESTONES.map((m, i) => {
          const achieved = points >= m.pts;
          return (
            <div
              key={m.label}
              className="card"
              style={{
                display: "flex", alignItems: "center", gap: "1rem",
                opacity: achieved ? 1 : 0.45,
                borderColor: achieved ? m.color + "50" : "var(--border)",
              }}
            >
              <span style={{ fontSize: "1.6rem" }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: achieved ? m.color : "var(--text-muted)", fontSize: "0.9rem" }}>
                  {m.label}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>{m.pts} points</p>
              </div>
              {achieved && (
                <span style={{
                  background: m.color + "20", color: m.color,
                  border: `1px solid ${m.color}50`,
                  borderRadius: "999px", padding: "3px 10px", fontSize: "0.7rem", fontWeight: 700
                }}>
                  ✓ Achieved
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Environmental impact */}
      <div className="section-header mt-3">
        <span className="section-title">🌍 Your Environmental Impact</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {[
          { icon: "🌳", value: `${(carbon / 21).toFixed(1)}`, label: "Trees worth of CO₂ absorbed", color: "#22c55e" },
          { icon: "🚗",  value: `${(carbon * 4.2).toFixed(1)}km`, label: "Car travel equivalent saved", color: "#3b82f6" },
          { icon: "💡",  value: `${Math.round(carbon * 8.5)}h`, label: "LED bulb hours saved", color: "#f59e0b" },
          { icon: "🔋",  value: `${Math.round(points * 0.5)}`, label: "Waste items properly handled", color: "#a855f7" },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ textAlign: "center", padding: "1rem" }}>
            <div style={{ fontSize: "1.75rem", marginBottom: "0.35rem" }}>{stat.icon}</div>
            <p style={{ fontWeight: 800, fontSize: "1.15rem", color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: "0.68rem", color: "var(--text-dim)", lineHeight: 1.4 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Reset (dev only) */}
      <button
        onClick={() => {
          localStorage.removeItem("glPoints");
          localStorage.removeItem("glScans");
          localStorage.removeItem("glCarbon");
          window.location.reload();
        }}
        style={{
          marginTop: "2rem", width: "100%", padding: "0.65rem",
          background: "transparent", border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)", color: "var(--text-dim)",
          fontSize: "0.75rem", cursor: "pointer"
        }}
      >
        Reset Progress (Dev Only)
      </button>
    </main>
  );
}
