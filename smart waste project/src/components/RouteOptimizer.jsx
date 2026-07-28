import React, { useState } from "react";
import { 
  Route, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Navigation, 
  Zap, 
  Leaf, 
  Clock, 
  ShieldCheck,
  Play
} from "lucide-react";

export default function RouteOptimizer({ bins, setBins }) {
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchComplete, setDispatchComplete] = useState(false);

  // Filter bins that require pickup (fillLevel >= 65%)
  const overflowBins = bins.filter((bin) => bin.fillLevel >= 65);
  
  // Stats calculations
  const distanceKm = (overflowBins.length * 2.8 + 3.2).toFixed(1);
  const fuelSavedLiters = (overflowBins.length * 1.4).toFixed(1);
  const co2PreventedKg = (fuelSavedLiters * 2.68).toFixed(1);
  const estTimeMin = Math.round(overflowBins.length * 12 + 15);

  const handleDispatchFleet = () => {
    setIsDispatching(true);
    setDispatchComplete(false);

    setTimeout(() => {
      setIsDispatching(false);
      setDispatchComplete(true);

      // Auto empty serviced bins in state
      setBins((prevBins) =>
        prevBins.map((bin) => {
          if (bin.fillLevel >= 65) {
            return {
              ...bin,
              fillLevel: 5,
              status: "Normal",
              lastEmptied: "Just now (Dispatched Truck #7)"
            };
          }
          return bin;
        })
      );
    }, 2500);
  };

  return (
    <div className="animate-fade-in" style={{ padding: "0 16px 32px 16px" }}>
      {/* Top Title */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(59, 130, 246, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Route size={20} color="#3b82f6" />
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>
            Fleet route logistics
          </h2>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Optimized collection routes for overflow bins, reducing mileage and service time across your fleet.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: "24px"
      }}>
        {/* Left Column: Route Metrics & Dispatch Action */}
        <div>
          <div className="glass-card" style={{ padding: "28px", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Truck size={20} color="#10b981" /> Collection Fleet Dispatch Panel
            </h3>

            {/* Metrics Row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "24px"
            }}>
              <div style={{ background: "var(--bg-main)", padding: "16px", borderRadius: "14px", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  <Navigation size={14} color="#3b82f6" /> Total Route Distance
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#3b82f6" }}>{distanceKm} km</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Shortest traveling path</div>
              </div>

              <div style={{ background: "var(--bg-main)", padding: "16px", borderRadius: "14px", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  <Leaf size={14} color="#10b981" /> Fuel & CO2 Saved
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#10b981" }}>{co2PreventedKg} kg</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{fuelSavedLiters}L diesel saved</div>
              </div>
            </div>

            {/* Target Overflow Bins Info */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Target Overflow Smart Bins:
                </span>
                <span className="badge badge-urgent">
                  {overflowBins.length} Bins Queued
                </span>
              </div>

              {overflowBins.length === 0 ? (
                <div style={{
                  padding: "16px",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "12px",
                  color: "#10b981",
                  fontSize: "0.88rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <ShieldCheck size={18} /> All smart bins are currently below threshold fill level! Fleet resting.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {overflowBins.map((bin, index) => (
                    <div key={bin.id} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "var(--bg-main)",
                      borderRadius: "10px",
                      border: "1px solid var(--border-color)"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: "#3b82f6",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 700
                        }}>
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{bin.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{bin.location}</div>
                        </div>
                      </div>
                      <span className="badge badge-urgent" style={{ fontSize: "0.7rem" }}>
                        {bin.fillLevel}% Full
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dispatch Action */}
            <button
              onClick={handleDispatchFleet}
              disabled={isDispatching || overflowBins.length === 0}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                justifyContent: "center",
                fontSize: "1rem",
                opacity: overflowBins.length === 0 ? 0.5 : 1
              }}
            >
              {isDispatching ? (
                <>
                  <Truck size={20} className="animate-pulse" /> Dispatching Truck Fleet & Calculating Route...
                </>
              ) : dispatchComplete ? (
                <>
                  <CheckCircle2 size={20} /> Route Completed & Bins Serviced!
                </>
              ) : (
                <>
                  <Play size={18} /> Dispatch Autonomous Collection Route
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Simulated Map Route Visualization */}
        <div>
          <div className="glass-card" style={{ padding: "24px", minHeight: "420px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={18} color="#06b6d4" /> Live Map Route Network
              </h3>
              <span className="badge badge-info" style={{ fontSize: "0.7rem" }}>
                GPS Telemetry Sync
              </span>
            </div>

            {/* Graphic Simulated Map Board */}
            <div style={{
              flex: 1,
              width: "100%",
              minHeight: "320px",
              background: "var(--bg-main)",
              borderRadius: "16px",
              border: "1px solid var(--border-color)",
              position: "relative",
              overflow: "hidden",
              backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}>
              {/* Central Fleet Depot */}
              <div style={{
                position: "absolute",
                top: "15%",
                left: "15%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 16px rgba(15, 118, 110, 0.25)",
                  zIndex: 2
                }}>
                  <Truck size={20} color="#ffffff" />
                </div>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#10b981", marginTop: "4px" }}>
                  Central Depot HQ
                </span>
              </div>

              {/* Waypoint nodes */}
              {overflowBins.map((bin, i) => {
                const topPos = `${30 + (i * 22) % 55}%`;
                const leftPos = `${40 + (i * 25) % 50}%`;
                return (
                  <div key={bin.id} style={{
                    position: "absolute",
                    top: topPos,
                    left: leftPos,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transition: "all 0.5s ease"
                  }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#ef4444",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      boxShadow: "0 0 15px rgba(239, 68, 68, 0.5)",
                      zIndex: 2
                    }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, background: "rgba(0,0,0,0.7)", padding: "2px 6px", borderRadius: "4px", marginTop: "2px", whiteSpace: "nowrap" }}>
                      {bin.name} ({bin.fillLevel}%)
                    </span>
                  </div>
                );
              })}

              {/* SVG Connecting Route Lines */}
              <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                <path
                  d="M 80 80 Q 200 150 280 220 T 420 180"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  style={{ opacity: 0.7 }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
