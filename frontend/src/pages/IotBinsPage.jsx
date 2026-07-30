import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Trash2, 
  Battery, 
  Thermometer, 
  CheckCircle2, 
  Zap, 
  MapPin, 
  Clock, 
  SlidersHorizontal,
  HardDrive
} from "lucide-react";
import OperatorHeader from "../components/OperatorHeader";
import { INITIAL_IOT_BINS } from "../data/wasteData";

export default function IotBinsPage() {
  const [bins, setBins] = useState(INITIAL_IOT_BINS);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const filteredBins = bins.filter((bin) => {
    if (filter === "urgent") return bin.fillLevel >= 85;
    if (filter === "warning") return bin.fillLevel >= 65 && bin.fillLevel < 85;
    if (filter === "normal") return bin.fillLevel < 65;
    return true;
  });

  // Action: Trigger Compactor cycle on IoT bin
  const handleCompact = (binId) => {
    setBins((prevBins) =>
      prevBins.map((bin) => {
        if (bin.id === binId) {
          const newFill = Math.max(10, bin.fillLevel - 25);
          const newStatus = newFill >= 85 ? "Urgent" : newFill >= 65 ? "Warning" : "Normal";
          return {
            ...bin,
            fillLevel: newFill,
            status: newStatus,
            compactorCyclesToday: bin.compactorCyclesToday + 1
          };
        }
        return bin;
      })
    );
  };

  // Action: Empty / Service Bin
  const handleEmptyBin = (binId) => {
    setBins((prevBins) =>
      prevBins.map((bin) => {
        if (bin.id === binId) {
          return {
            ...bin,
            fillLevel: 5,
            status: "Normal",
            lastEmptied: "Just now"
          };
        }
        return bin;
      })
    );
  };

  // Action: Simulate Incoming Waste Data (+15%)
  const handleSimulateFill = (binId) => {
    setBins((prevBins) =>
      prevBins.map((bin) => {
        if (bin.id === binId) {
          const newFill = Math.min(100, bin.fillLevel + 15);
          const newStatus = newFill >= 85 ? "Urgent" : newFill >= 65 ? "Warning" : "Normal";
          return {
            ...bin,
            fillLevel: newFill,
            status: newStatus
          };
        }
        return bin;
      })
    );
  };

  return (
    <div className="page-wide animate-fade-in">
      <OperatorHeader title="IoT Bin Fleet Operations" />

      {/* Top Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
        marginBottom: "24px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(6, 182, 212, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Trash2 size={20} color="#06b6d4" />
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>
              IoT Bin Telemetry
            </h2>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Real-time fill, temperature, and compactor status across your connected bin network.
          </p>
        </div>

        {/* Dispatch Route Button */}
        <button
          onClick={() => navigate("/operator/routes")}
          className="btn-primary"
          style={{ padding: "12px 20px" }}
        >
          <Zap size={18} />
          Optimize Pickup Route
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "24px",
        overflowX: "auto"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 600, marginRight: "4px" }}>
          <SlidersHorizontal size={16} /> Filter Status:
        </div>

        {[
          { id: "all", label: `All Bins (${bins.length})` },
          { id: "urgent", label: `Urgent Overflow (${bins.filter(b => b.fillLevel >= 85).length})` },
          { id: "warning", label: `Warning (${bins.filter(b => b.fillLevel >= 65 && b.fillLevel < 85).length})` },
          { id: "normal", label: `Normal (${bins.filter(b => b.fillLevel < 65).length})` },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: filter === f.id ? "1px solid var(--green-primary)" : "1px solid var(--border)",
              background: filter === f.id ? "var(--green-glass)" : "var(--bg-2)",
              color: filter === f.id ? "var(--green-light)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* IoT Smart Bins Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: "20px"
      }}>
        {filteredBins.map((bin) => {
          const isUrgent = bin.fillLevel >= 85;
          const isWarning = bin.fillLevel >= 65 && bin.fillLevel < 85;
          const statusColor = isUrgent ? "#ef4444" : isWarning ? "#facc15" : "var(--green-light)";

          return (
            <div key={bin.id} className="glass-card" style={{ padding: "24px" }}>
              {/* Card Top Row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                    ID: {bin.id}
                  </div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "2px 0 4px 0" }}>
                    {bin.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <MapPin size={14} color="#06b6d4" /> {bin.location}
                  </div>
                </div>

                <span className={isUrgent ? "badge badge-urgent" : isWarning ? "badge badge-warning" : "badge badge-success"}>
                  {bin.status}
                </span>
              </div>

              {/* Fill Level Progress Bar */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Capacity Fill Level</span>
                  <span style={{ color: statusColor }}>{bin.fillLevel}%</span>
                </div>

                <div style={{
                  width: "100%",
                  height: "12px",
                  background: "var(--bg-2)",
                  borderRadius: "6px",
                  overflow: "hidden",
                  border: "1px solid var(--border)"
                }}>
                  <div style={{
                    width: `${bin.fillLevel}%`,
                    height: "100%",
                    background: statusColor,
                    borderRadius: "6px",
                    transition: "width 0.5s ease",
                    boxShadow: `0 0 10px ${statusColor}66`
                  }} />
                </div>
              </div>

              {/* Telemetry Sensor Metrics */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                padding: "12px",
                background: "var(--bg-2)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                marginBottom: "20px"
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    <Thermometer size={12} color="#facc15" /> Temp
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>{bin.tempC}°C</div>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    <Battery size={12} color="var(--green-light)" /> Battery
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>{bin.battery}%</div>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    <HardDrive size={12} color="#8b5cf6" /> Cycles
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>{bin.compactorCyclesToday}</div>
                </div>
              </div>

              {/* Meta Info */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                <span>Type: <strong>{bin.wasteType}</strong></span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={12} /> {bin.lastEmptied}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <button
                  onClick={() => handleCompact(bin.id)}
                  className="btn-secondary"
                  style={{ padding: "8px", fontSize: "0.78rem", justifyContent: "center" }}
                  title="Run Solar Trash Compactor"
                >
                  <Zap size={14} color="#facc15" /> Compact (-25%)
                </button>

                <button
                  onClick={() => handleEmptyBin(bin.id)}
                  className="btn-secondary"
                  style={{ padding: "8px", fontSize: "0.78rem", justifyContent: "center" }}
                  title="Reset & Mark Serviced"
                >
                  <CheckCircle2 size={14} color="var(--green-light)" /> Mark Serviced
                </button>
              </div>

              {/* Sensor Simulation trigger */}
              <button
                onClick={() => handleSimulateFill(bin.id)}
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "6px",
                  background: "transparent",
                  border: "1px dashed var(--border)",
                  borderRadius: "8px",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  transition: "color var(--transition)"
                }}
                onMouseOver={(e) => e.target.style.color = "var(--text)"}
                onMouseOut={(e) => e.target.style.color = "var(--text-muted)"}
              >
                + Simulate Sensor Payload (+15% Waste)
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
