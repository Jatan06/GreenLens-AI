import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Info } from "lucide-react";
import { getNearbyRecyclingCenters, getAllRecyclingCenters } from "../api/client";

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
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function MapPage() {
  const [centers, setCenters] = useState([]);
  const [userPos, setUserPos] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  useEffect(() => {
    // Get user location and then fetch nearby centers
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserPos([lat, lng]);
        setStatus("ok");
        try {
          const res = await getNearbyRecyclingCenters(lat, lng, null, 20);
          setCenters(res || []);
        } catch (err) {
          console.warn("Failed to fetch nearby centers:", err);
          fallbackToAllCenters();
        }
      },
      () => {
        // Default to center of San Francisco if location denied
        const defaultLat = 37.7749;
        const defaultLng = -122.4194;
        setUserPos([defaultLat, defaultLng]);
        setStatus("ok");
        getNearbyRecyclingCenters(defaultLat, defaultLng, null, 20)
          .then((res) => setCenters(res || []))
          .catch(() => fallbackToAllCenters());
      },
      { timeout: 8000 }
    );
  }, []);

  const fallbackToAllCenters = async () => {
    try {
      const res = await getAllRecyclingCenters();
      setCenters(res || []);
    } catch (e) {
      console.warn("Fallback to all centers failed:", e);
    }
  };

  const defaultCenter = userPos || [37.7749, -122.4194];

  return (
    <div className="animate-fade-in" style={{ padding: "0 16px 32px 16px" }}>
      {/* Top Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(16, 185, 129, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <MapPin size={20} color="#10b981" />
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>
            Interactive Recycling Map
          </h2>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          {centers.length > 0
            ? `Found ${centers.length} recycling centers and drop-off points near you.`
            : "Locating nearby recycling centers..."}
        </p>
      </div>

      {/* Map View */}
      <div className="glass-card" style={{ padding: "12px", marginBottom: "24px", overflow: "hidden", zIndex: 1 }}>
        <div style={{
          width: "100%",
          height: "450px",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid var(--border-color)",
          background: "var(--bg-main)",
          position: "relative",
          zIndex: 1
        }}>
          {status === "ok" ? (
            <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <RecenterMap center={defaultCenter} />

              {/* User location pin */}
              {userPos && (
                <Marker position={userPos} icon={userIcon}>
                  <Popup>
                    <div style={{ color: "#000", fontWeight: "bold" }}>📍 You are here</div>
                  </Popup>
                </Marker>
              )}

              {/* Recycling centers pins */}
              {centers.map((c, i) => (
                <Marker key={i} position={[c.latitude, c.longitude]}>
                  <Popup>
                    <div style={{ color: "#000", minWidth: "180px", fontFamily: "sans-serif" }}>
                      <strong style={{ display: "block", marginBottom: "4px", fontSize: "1.1em" }}>
                        {c.name}
                      </strong>
                      <span style={{ fontSize: "0.9em", color: "#555" }}>
                        {c.address || "No address available"}
                      </span><br />
                      {c.distance_km !== undefined && (
                        <span style={{ fontSize: "0.85em", color: "#059669", fontWeight: "bold" }}>
                          {c.distance_km.toFixed(1)} km away
                        </span>
                      )}
                      {c.accepted_materials && (
                        <div style={{ marginTop: "6px", fontSize: "0.8em", color: "#444" }}>
                          <strong>Accepts:</strong> {c.accepted_materials}
                        </div>
                      )}
                      <a href={c.maps_url} target="_blank" rel="noopener noreferrer"
                         style={{ 
                           display: "inline-block", 
                           marginTop: "8px", 
                           background: "#3b82f6", 
                           color: "#fff", 
                           padding: "6px 12px", 
                           borderRadius: "4px", 
                           textDecoration: "none",
                           fontSize: "0.85em",
                           fontWeight: "bold"
                         }}>
                        Open in Maps
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
              <div className="spinner" style={{ marginBottom: "16px" }}></div>
              <p>Fetching geospatial data...</p>
            </div>
          )}
        </div>
      </div>

      {/* Centers List View */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "16px"
      }}>
        {centers.map((c, i) => (
          <a key={i} href={c.maps_url} target="_blank" rel="noopener noreferrer" className="glass-card" style={{ padding: "16px", display: "flex", alignItems: "flex-start", gap: "14px", textDecoration: "none", transition: "transform 0.2s" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <MapPin size={20} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 4px 0", color: "var(--text-primary)" }}>
                {c.name}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0 0 6px 0" }}>
                {c.address || "Address not provided"}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.75rem" }}>
                {c.distance_km !== undefined && (
                  <span style={{ color: "#10b981", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                    <Navigation size={12} /> {c.distance_km.toFixed(1)} km
                  </span>
                )}
                {c.accepted_materials && (
                  <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Info size={12} /> {c.accepted_materials.split(",")[0]}...
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
