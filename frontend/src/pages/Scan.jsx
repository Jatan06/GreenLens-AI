import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { predictWaste } from "../api/client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Scan() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [mode, setMode] = useState("idle"); // idle | camera | preview
  const [preview, setPreview] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle"); // idle|fetching|ok|error

  /* ── Camera ── */
  const openCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setMode("camera");
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 50);
    } catch {
      setError("Camera access denied. Please allow camera permission or upload a photo instead.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      setCapturedFile(file);
      setPreview(canvas.toDataURL("image/jpeg"));
      stopCamera();
      setMode("preview");
    }, "image/jpeg", 0.92);
  };

  /* ── File upload ── */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCapturedFile(file);
    setPreview(URL.createObjectURL(file));
    setMode("preview");
    setError(null);
  };

  /* ── Geolocation ── */
  const getLocation = () =>
    new Promise((resolve) => {
      setLocationStatus("fetching");
      navigator.geolocation.getCurrentPosition(
        (pos) => { setLocationStatus("ok"); resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }); },
        () => { setLocationStatus("error"); resolve({ lat: 20.5937, lng: 78.9629 }); }, // Default: India center
        { timeout: 8000, maximumAge: 60000 }
      );
    });

  /* ── Submit ── */
  const handleAnalyze = async () => {
    if (!capturedFile) return;
    setLoading(true);
    setError(null);
    try {
      const { lat, lng } = await getLocation();
      const data = await predictWaste(capturedFile, lat, lng);
      // Store results + centers in sessionStorage for Results page
      sessionStorage.setItem("glResult", JSON.stringify(data));
      sessionStorage.setItem("glPreview", preview);
      navigate("/results");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    stopCamera();
    setMode("idle");
    setPreview(null);
    setCapturedFile(null);
    setError(null);
  };

  return (
    <main className="page page-enter" style={{ paddingBottom: "7rem" }}>
      {/* Header */}
      <header style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
          <span style={{ fontSize: "1.6rem" }}>🌿</span>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, background: "linear-gradient(135deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            GreenLens AI
          </h1>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Scan any waste to identify, classify &amp; earn rewards
        </p>
      </header>

      {/* ── IDLE STATE ── */}
      {mode === "idle" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Hero scan zone */}
          <div
            onClick={openCamera}
            style={{
              height: 260,
              borderRadius: "var(--radius-xl)",
              border: "2px dashed var(--border-hover)",
              background: "var(--green-glass)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              cursor: "pointer",
              transition: "all var(--transition)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--green-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
          >
            <div
              className="pulse"
              style={{
                width: 80, height: 80,
                borderRadius: "50%",
                background: "var(--green-glass)",
                border: "2px solid var(--green-primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem",
              }}
            >
              📷
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.25rem" }}>Tap to open camera</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Point at any waste item to identify it</p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ color: "var(--text-dim)", fontSize: "0.75rem", fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Upload from gallery */}
          <button className="btn btn-outline btn-full" onClick={() => fileRef.current?.click()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Upload from gallery
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

          {/* Info strip */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem" }}>
            {[
              { icon: "♻️", label: "Recyclable" },
              { icon: "🌱", label: "Compostable" },
              { icon: "⚠️", label: "Hazardous" },
              { icon: "💻", label: "E-Waste" },
            ].map((c) => (
              <div key={c.label} className="card" style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem" }}>
                <span style={{ fontSize: "1.25rem" }}>{c.icon}</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CAMERA STATE ── */}
      {mode === "camera" && (
        <div style={{ position: "relative", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "100%", display: "block", borderRadius: "var(--radius-xl)", background: "#000", minHeight: 300 }}
          />
          {/* Overlay grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(34,197,94,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            borderRadius: "var(--radius-xl)",
            pointerEvents: "none",
          }} />
          {/* Scan frame */}
          <div style={{
            position: "absolute", inset: "20%",
            border: "2px solid var(--green-primary)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 0 0 2000px rgba(0,0,0,0.4)",
            pointerEvents: "none",
          }} />
          {/* Controls */}
          <div style={{
            position: "absolute", bottom: "1rem", left: 0, right: 0,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem",
          }}>
            <button className="btn-icon" onClick={reset} title="Cancel">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <button
              onClick={captureFrame}
              style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "var(--green-primary)",
                border: "4px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "var(--shadow-btn)",
                transition: "transform var(--transition)",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.93)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><circle cx="12" cy="13" r="4"/><path d="M5 7H3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M9 4h6"/></svg>
            </button>
            <button className="btn-icon" onClick={() => fileRef.current?.click()} title="Upload">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
          </div>
        </div>
      )}

      {/* ── PREVIEW STATE ── */}
      {mode === "preview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ position: "relative", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
            <img src={preview} alt="Preview" style={{ width: "100%", objectFit: "cover", maxHeight: 320, borderRadius: "var(--radius-xl)" }} />
            <button
              className="btn-icon"
              onClick={reset}
              style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "rgba(0,0,0,0.6)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {locationStatus === "fetching" && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center" }}>
              📍 Getting your location…
            </p>
          )}
          {locationStatus === "error" && (
            <p style={{ color: "#f59e0b", fontSize: "0.8rem", textAlign: "center" }}>
              ⚠️ Location unavailable — using default coordinates
            </p>
          )}

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", color: "#f87171", fontSize: "0.85rem" }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary btn-full" onClick={handleAnalyze} disabled={loading}>
            {loading ? (
              <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analysing…</>
            ) : (
              <><span>🔍</span> Analyze Waste</>
            )}
          </button>
          <button className="btn btn-outline btn-full" onClick={reset}>Retake</button>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>AI is analysing your waste…</p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>This may take a few seconds</p>
        </div>
      )}
    </main>
  );
}
