import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix leaflet default icon broken in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom green icon for user
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, 14); }, [center, map]);
  return null;
}

export default function MapPage() {
  const [centers, setCenters] = useState([]);
  const [userPos, setUserPos] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  useEffect(() => {
    // Load recycling centers from last scan
    const raw = sessionStorage.getItem("glResult");
    if (raw) {
      const { recycling_centers = [] } = JSON.parse(raw);
      setCenters(recycling_centers);
    }

    // Get user location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setStatus("ok");
      },
      () => {
        // Default to center of India
        setUserPos([20.5937, 78.9629]);
        setStatus("ok");
      },
      { timeout: 8000 }
    );
  }, []);

  const defaultCenter = userPos || [20.5937, 78.9629];

  return (
    <main className="page page-enter" style={{ padding: "1rem", paddingBottom: "6rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontWeight: 800, fontSize: "1.2rem" }}>♻️ Nearby Drop-off Points</h2>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
          {centers.length > 0
            ? `${centers.length} recycling center${centers.length > 1 ? "s" : ""} found near you`
            : "Scan waste first to find nearby centers"}
        </p>
      </div>

      {/* Map */}
      <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--border)", height: 340, marginBottom: "1.25rem" }}>
        {status === "ok" && (
          <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <RecenterMap center={defaultCenter} />

            {/* User location */}
            {userPos && (
              <Marker position={userPos} icon={userIcon}>
                <Popup>📍 You are here</Popup>
              </Marker>
            )}

            {/* Recycling centers */}
            {centers.map((c, i) => (
              <Marker key={i} position={[c.latitude, c.longitude]}>
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    <strong style={{ display: "block", marginBottom: "4px" }}>{c.name}</strong>
                    <span style={{ fontSize: "0.8rem" }}>{c.address || "No address available"}</span><br />
                    <span style={{ fontSize: "0.8rem", color: "#22c55e" }}>
                      {c.distance_m < 1000
                        ? `${c.distance_m}m away`
                        : `${(c.distance_m / 1000).toFixed(1)}km away`}
                    </span><br />
                    <a href={c.maps_url} target="_blank" rel="noopener noreferrer"
                       style={{ fontSize: "0.8rem", color: "#60a5fa", display: "inline-block", marginTop: "4px" }}>
                      Open in Google Maps →
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {status === "loading" && (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
            <div className="spinner" />
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Getting your location…</p>
          </div>
        )}
      </div>

      {/* Centers list */}
      {centers.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <span style={{ fontSize: "2.5rem" }}>🗺️</span>
          <p style={{ marginTop: "0.75rem", color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Scan waste to discover nearby recycling drop-off points.
          </p>
          <a href="/" className="btn btn-primary" style={{ display: "inline-flex", marginTop: "1rem" }}>Scan Now</a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {centers.map((c, i) => (
            <a
              key={i}
              href={c.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none" }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: "50%",
                background: "var(--green-glass)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.25rem", flexShrink: 0,
              }}>
                ♻️
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.name}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.address || "Address not available"}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--green-primary)", marginTop: "2px" }}>
                  {c.distance_m < 1000 ? `${c.distance_m}m away` : `${(c.distance_m / 1000).toFixed(1)}km away`}
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
