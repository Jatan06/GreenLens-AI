import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserScanHistory } from "../api/client";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
      return;
    }

    if (user) {
      getUserScanHistory()
        .then((data) => setHistory(data))
        .catch(() => setHistory([]))
        .finally(() => setLoadingHistory(false));
    }
  }, [user, authLoading, navigate]);

  if (authLoading || (!user && loadingHistory)) {
    return (
      <main
        className="page"
        style={{ textAlign: "center", paddingTop: "5rem" }}
      >
        <p style={{ color: "var(--text-muted)" }}>Loading user profile...</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="page page-enter" style={{ paddingBottom: "7rem" }}>
      {/* Profile Header Card */}
      <div
        className="card glass-card"
        style={{ padding: "1.5rem", marginBottom: "1.5rem" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--green-primary), #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#000",
              boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
            }}
          >
            {user.username ? user.username[0].toUpperCase() : "U"}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: 800, fontSize: "1.2rem" }}>
              {user.full_name || user.username}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              @{user.username} • {user.email}
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "var(--surface-2)",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                marginTop: "0.4rem",
                fontSize: "0.72rem",
                color: "var(--green-light)",
                border: "1px solid var(--border)",
              }}
            >
              <span>🔥</span> {user.streak_days || 1} Day Streak
            </div>
          </div>
        </div>
      </div>

      {/* User Stats Grid */}
      <div className="stat-row mb-2">
        <div className="stat-chip">
          <span className="value">{user.total_scans || 0}</span>
          <span className="label">Total Scans</span>
        </div>
        <div className="stat-chip">
          <span className="value" style={{ color: "var(--green-light)" }}>
            {user.carbon_saved_kg || 0}kg
          </span>
          <span className="label">CO₂ Saved</span>
        </div>
        <div className="stat-chip">
          <span className="value" style={{ color: "#facc15" }}>
            {user.total_reward_points || 0}
          </span>
          <span className="label">Reward Pts</span>
        </div>
      </div>

      {/* Scan History Section */}
      <section style={{ marginTop: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ fontWeight: 700, fontSize: "1.05rem" }}>
            📸 Scan History Records
          </h3>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            {history.length} scans
          </span>
        </div>

        {loadingHistory ? (
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Loading history records...
          </p>
        ) : history.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: "center", padding: "2rem 1rem" }}
          >
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🍃</p>
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--text)",
              }}
            >
              No waste scans yet!
            </p>
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                marginTop: "0.2rem",
              }}
            >
              Scan recyclable items to build your record and earn points.
            </p>
            <Link
              to="/"
              className="btn btn-primary"
              style={{
                marginTop: "1rem",
                padding: "0.6rem 1.2rem",
                fontSize: "0.85rem",
              }}
            >
              Start Scanning
            </Link>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            {history.map((scan) => (
              <div
                key={scan.id}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.85rem 1rem",
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "var(--radius-sm)",
                    background: "var(--surface-2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    border: "1px solid var(--border)",
                  }}
                >
                  ♻️
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "var(--text)",
                    }}
                  >
                    {scan.total_items} items detected
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      marginTop: "0.1rem",
                    }}
                  >
                    {new Date(scan.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      display: "block",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      color: "#facc15",
                    }}
                  >
                    +{scan.total_reward} pts
                  </span>
                  <span
                    style={{ fontSize: "0.72rem", color: "var(--green-light)" }}
                  >
                    {scan.total_carbon_saved}kg CO₂
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Link
        to="/operator"
        style={{
          display: "block",
          width: "100%",
          marginTop: "2rem",
          padding: "0.85rem",
          textAlign: "center",
          borderRadius: "var(--radius-xl)",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          color: "var(--text)",
          fontWeight: 700,
          fontSize: "0.9rem",
          textDecoration: "none"
        }}
      >
        🏢 Open Municipal Operator Portal
      </Link>

      {/* Logout Action */}
      <button
        onClick={logout}
        style={{
          width: "100%",
          marginTop: "2rem",
          padding: "0.85rem",
          borderRadius: "var(--radius-xl)",
          background: "rgba(239, 68, 68, 0.12)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#ef4444",
          fontWeight: 700,
          fontSize: "0.9rem",
          transition: "all var(--transition)",
        }}
      >
        🚪 Sign Out
      </button>
    </main>
  );
}
