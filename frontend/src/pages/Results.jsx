const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CATEGORY_META = {
  Recyclable:  { color: "var(--cat-recyclable)",  icon: "♻️",  badge: "badge-recyclable"  },
  Compostable: { color: "var(--cat-compostable)", icon: "🌱", badge: "badge-compostable" },
  Hazardous:   { color: "var(--cat-hazardous)",   icon: "⚠️",  badge: "badge-hazardous"   },
  "E-Waste":   { color: "var(--cat-ewaste)",      icon: "💻", badge: "badge-e-waste"     },
  General:     { color: "var(--cat-general)",     icon: "🗑️", badge: "badge-general"     },
};

const BIN_COLOR = { Blue: "#3b82f6", Green: "#22c55e", Red: "#ef4444", Black: "#a855f7", Grey: "#6b7280" };

/* ── Eco Score Ring ── */
function EcoRing({ score = 50 }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="eco-ring-wrap">
      <svg viewBox="0 0 64 64">
        <circle className="eco-ring-bg" cx="32" cy="32" r={r} />
        <circle
          className="eco-ring-fg"
          cx="32" cy="32" r={r}
          strokeDasharray={`${dash} ${circ - dash}`}
        />
      </svg>
      <span className="eco-ring-label">{score}</span>
    </div>
  );
}

/* ── Single detection card ── */
function DetectionCard({ item }) {
  const meta = CATEGORY_META[item.category] || CATEGORY_META["General"];
  const binColor = BIN_COLOR[item.bin] || "#6b7280";

  return (
    <div className="card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
      <EcoRing score={item.eco_score || 50} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: "0.95rem", textTransform: "capitalize" }}>{item.name}</span>
          <span className={`badge ${meta.badge}`}>{meta.icon} {item.category}</span>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "auto" }}>
            {Math.round(item.confidence * 100)}% confidence
          </span>
        </div>

        {/* Bin & Reward row */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: binColor, display: "inline-block" }} />
            {item.bin} Bin
          </span>
          <span style={{ fontSize: "0.78rem", color: "#facc15", fontWeight: 600 }}>+{item.reward} pts</span>
          <span style={{ fontSize: "0.78rem", color: "var(--green-primary)" }}>🌍 {item.carbon_saved} saved</span>
        </div>

        {/* Description */}
        {item.description && (
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.5rem", lineHeight: 1.5 }}>
            {item.description}
          </p>
        )}

        {/* Can become */}
        {item.can_become?.length > 0 && (
          <div style={{ marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
              Can become →
            </span>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "4px" }}>
              {(Array.isArray(item.can_become) ? item.can_become : [item.can_become]).map((b) => (
                <span key={b} style={{
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  borderRadius: "999px", padding: "2px 8px", fontSize: "0.7rem", color: "var(--text-muted)"
                }}>{b}</span>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {item.tips?.length > 0 && (
          <div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Tips</span>
            <ul style={{ marginTop: "4px", paddingLeft: "1rem" }}>
              {item.tips.map((t) => (
                <li key={t} style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Results Page ── */
export default function Results() {
  const raw = sessionStorage.getItem("glResult");
  const previewUrl = sessionStorage.getItem("glPreview");

  if (!raw) {
    return (
      <main className="page page-enter" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
        <span style={{ fontSize: "3rem" }}>🤔</span>
        <p style={{ color: "var(--text-muted)" }}>No scan results found.</p>
        <a href="/" className="btn btn-primary">Go Scan Something</a>
      </main>
    );
  }

  const data = JSON.parse(raw);
  const { overall, detections = [], recycling_centers = [] } = data;
  const annotatedUrl = data.annotated_image ? `${API_BASE}${data.annotated_image}` : null;

  // Track reward in localStorage
  const storedPts = parseInt(localStorage.getItem("glPoints") || "0", 10);
  const newTotal = storedPts + (overall?.total_reward || 0);
  localStorage.setItem("glPoints", newTotal);
  const storedScans = parseInt(localStorage.getItem("glScans") || "0", 10);
  localStorage.setItem("glScans", storedScans + 1);
  const storedCarbon = parseFloat(localStorage.getItem("glCarbon") || "0");
  localStorage.setItem("glCarbon", (storedCarbon + (overall?.total_carbon_saved || 0)).toFixed(2));

  return (
    <main className="page page-enter" style={{ paddingBottom: "7rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <a href="/" className="btn-icon" style={{ textDecoration: "none" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </a>
        <h2 style={{ fontWeight: 800, fontSize: "1.2rem" }}>Scan Results</h2>
      </div>

      {/* Annotated image */}
      {(annotatedUrl || previewUrl) && (
        <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", marginBottom: "1.25rem", border: "1px solid var(--border)" }}>
          <img src={annotatedUrl || previewUrl} alt="Annotated" style={{ width: "100%", display: "block" }} />
        </div>
      )}

      {/* Stats strip */}
      <div className="stat-row mb-2">
        <div className="stat-chip">
          <span className="value">{overall?.total_items ?? 0}</span>
          <span className="label">Items Found</span>
        </div>
        <div className="stat-chip">
          <span className="value" style={{ color: "#facc15" }}>+{overall?.total_reward ?? 0}</span>
          <span className="label">Points Earned</span>
        </div>
        <div className="stat-chip">
          <span className="value">{overall?.total_carbon_saved?.toFixed(2) ?? "0"}kg</span>
          <span className="label">CO₂ Saved</span>
        </div>
      </div>

      {/* Reward toast */}
      {overall?.total_reward > 0 && (
        <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "2rem" }}>🏆</span>
          <div>
            <p style={{ fontWeight: 700 }}>+{overall.total_reward} Green Points Earned!</p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Total: {newTotal} points — keep going!</p>
          </div>
        </div>
      )}

      {/* Detections */}
      {detections.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <span style={{ fontSize: "2.5rem" }}>🔍</span>
          <p style={{ marginTop: "0.75rem", color: "var(--text-muted)" }}>No waste items detected. Try a clearer photo.</p>
        </div>
      ) : (
        <>
          <div className="section-header">
            <span className="section-title">Detected Items ({detections.length})</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {detections.map((item, i) => <DetectionCard key={i} item={item} />)}
          </div>
        </>
      )}

      {/* Recycling centers shortcut */}
      {recycling_centers.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <div className="section-header">
            <span className="section-title">Nearest Drop-offs ({recycling_centers.length})</span>
            <a href="/map" style={{ fontSize: "0.78rem", color: "var(--green-primary)", fontWeight: 600 }}>View Map →</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {recycling_centers.slice(0, 3).map((c, i) => (
              <a
                key={i}
                href={c.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}
              >
                <span style={{ fontSize: "1.4rem" }}>📍</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: "0.88rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{(c.distance_m / 1000).toFixed(1)} km away</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
