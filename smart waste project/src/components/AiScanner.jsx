import React, { useState, useEffect } from "react";
import { 
  Scan, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Award, 
  Sparkles, 
  RefreshCw,
  Info,
  Scale,
  Leaf,
  Layers,
  FileCheck,
  MapPin,
  Clock,
  History
} from "lucide-react";
import { AI_SAMPLE_PRESETS } from "../data/wasteData";
import { analyzeWasteScan, getScanHistory, getFullMediaUrl } from "../api/client";

export default function AiScanner({ onAddPoints, currentUser }) {
  const [selectedPreset, setSelectedPreset] = useState(AI_SAMPLE_PRESETS[0]);
  const [customImage, setCustomImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scannedResult, setScannedResult] = useState(AI_SAMPLE_PRESETS[0]);
  const [nearbyCenters, setNearbyCenters] = useState([]);
  const [pointsClaimed, setPointsClaimed] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [apiError, setApiError] = useState("");

  // Fetch scan history if user is logged in
  useEffect(() => {
    if (currentUser) {
      loadHistory();
    }
  }, [currentUser]);

  const loadHistory = async () => {
    try {
      const history = await getScanHistory(0, 5);
      setScanHistory(history);
    } catch (err) {
      console.warn("Scan history fetch error:", err);
    }
  };

  const handlePresetSelect = (preset) => {
    setCustomImage(null);
    setSelectedPreset(preset);
    setNearbyCenters([]);
    runAiScanMock(preset);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setCustomImage(imageUrl);
    setIsScanning(true);
    setScanStep(1);
    setPointsClaimed(false);
    setApiError("");

    const { latitude: userLat, longitude: userLon } = await new Promise((resolve) => {
      if (!navigator.geolocation) return resolve({ latitude: 37.7749, longitude: -122.4194 });
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        () => resolve({ latitude: 37.7749, longitude: -122.4194 }),
        { timeout: 8000, maximumAge: 60000 }
      );
    });

    setTimeout(() => setScanStep(2), 500);
    setTimeout(() => setScanStep(3), 1000);

    try {
      const res = await analyzeWasteScan(file, userLat, userLon);
      setIsScanning(false);

      const topDetection = res.detections && res.detections.length > 0 ? res.detections[0] : null;
      const formattedResult = {
        id: `scan-${res.id}`,
        name: topDetection?.name || "No supported waste item detected",
        category: topDetection ? topDetection.category : "Recyclable",
        binType: topDetection?.bin ? `${topDetection.bin} Bin` : "Check local guidance",
        binColor: topDetection?.bin === "Green" ? "#22c55e" : topDetection?.bin === "Red" ? "#ef4444" : topDetection?.bin === "Black" ? "#374151" : "#3b82f6",
        confidence: topDetection ? Math.round(topDetection.confidence * 100) : 0,
        weightKg: topDetection ? 0.15 : 0.2,
        co2SavedKg: res.overall?.total_carbon_saved ?? 0,
        recyclabilityRate: topDetection?.category === "Recyclable" ? "95%" : "See disposal guidance",
        imageUrl: res.annotated_image ? getFullMediaUrl(res.annotated_image) : imageUrl,
        tags: res.detections?.map(d => d.name) || ["No detection"],
        instructions: topDetection?.tips?.length ? topDetection.tips : [
          "Ensure material is empty and rinsed of residue.",
          "Place in designated bin or take to nearby facility."
        ],
        composition: res.summary ? Object.entries(res.summary).map(([key, val]) => ({ name: key, percent: Math.min(100, (val.count || 1) * 100) })) : [
          { name: "Recyclable Material", percent: 85 },
          { name: "Residual Matter", percent: 15 }
        ],
        earnedReward: res.overall?.total_reward ?? 0
      };

      setScannedResult(formattedResult);
      if (res.recycling_centers) {
        setNearbyCenters(res.recycling_centers);
      }

      if (res.overall?.total_reward) {
        onAddPoints(res.overall.total_reward);
        setPointsClaimed(true);
      }

      if (currentUser) {
        loadHistory();
      }
    } catch (err) {
      console.warn("Backend scan failed:", err);
      setApiError(err.message || "Backend processing failed. Please try another image.");
      setIsScanning(false);
    }
  };

  const runAiScanMock = (targetData) => {
    setIsScanning(true);
    setScanStep(1);
    setPointsClaimed(false);
    setApiError("");

    setTimeout(() => setScanStep(2), 400);
    setTimeout(() => setScanStep(3), 800);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult(targetData);
    }, 1200);
  };

  const handleClaimPoints = () => {
    if (!pointsClaimed) {
      onAddPoints(scannedResult.earnedReward || 50);
      setPointsClaimed(true);
    }
  };

  const currentImage = customImage || scannedResult.imageUrl || selectedPreset.imageUrl;

  return (
    <div className="animate-fade-in" style={{ padding: "0 16px 32px 16px" }}>
      {/* Header Title */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(16, 185, 129, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Scan size={20} color="#10b981" />
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>
            AI Waste Recognition & Sorting Guide
          </h2>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Upload a photo of waste to trigger real-time AI object detection, carbon calculation, and reward credits.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: "24px"
      }}>
        {/* Left Column: Input Controls & Image Scanner Preview */}
        <div>
          {/* Sample Preset Selector */}
          <div className="glass-card" style={{ padding: "20px", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Layers size={16} color="#10b981" /> Select Sample Preset Item:
            </h3>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px"
            }}>
              {AI_SAMPLE_PRESETS.map((preset) => {
                const isSelected = !customImage && selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    style={{
                      padding: "8px",
                      borderRadius: "12px",
                      border: isSelected ? "2px solid #10b981" : "1px solid var(--border-color)",
                      background: isSelected ? "rgba(16, 185, 129, 0.12)" : "var(--bg-main)",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <img 
                      src={preset.imageUrl} 
                      alt={preset.name} 
                      style={{
                        width: "100%",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "6px"
                      }} 
                    />
                    <div style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: isSelected ? "#10b981" : "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {preset.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom File Upload Box */}
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px dashed var(--border-color)" }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "12px",
                border: "2px dashed var(--border-color)",
                borderRadius: "12px",
                cursor: "pointer",
                background: "var(--bg-main)",
                transition: "all 0.2s ease"
              }}>
                <Upload size={18} color="#10b981" />
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Upload Custom Photo for Backend AI Analysis
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  style={{ display: "none" }} 
                />
              </label>
            </div>
          </div>

          {/* Scanner Live Preview Box */}
          <div className="glass-card" style={{
            padding: "20px",
            position: "relative",
            overflow: "hidden",
            minHeight: "360px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxHeight: "320px",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
            }}>
              <img 
                src={currentImage} 
                alt="Scanning preview"
                style={{
                  width: "100%",
                  height: "280px",
                  objectFit: "cover",
                  filter: isScanning ? "brightness(0.7) contrast(1.1)" : "none",
                  transition: "all 0.3s ease"
                }} 
              />

              {/* Scanning Laser Line Overlay */}
              {isScanning && (
                <div style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "rgba(16, 185, 129, 0.35)",
                  boxShadow: "0 0 12px rgba(16, 185, 129, 0.3)",
                  animation: "scanLine 1.5s infinite linear"
                }} />
              )}

              {/* Bounding Box overlay */}
              {!isScanning && (
                <div style={{
                  position: "absolute",
                  top: "15%",
                  left: "20%",
                  right: "20%",
                  bottom: "15%",
                  border: "2px dashed #10b981",
                  borderRadius: "12px",
                  pointerEvents: "none",
                  boxShadow: "inset 0 0 15px rgba(16, 185, 129, 0.2)",
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "8px"
                }}>
                  <span className="badge badge-success" style={{ fontSize: "0.68rem" }}>
                    Detected: {scannedResult.category} ({scannedResult.confidence}%)
                  </span>
                </div>
              )}
            </div>

            {/* Scan Progress Bar & Logs */}
            {isScanning ? (
              <div style={{ width: "100%", marginTop: "16px", textAlign: "center" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#10b981",
                  marginBottom: "8px"
                }}>
                  <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} />
                  {scanStep === 1 && "Connecting to FastAPI backend..."}
                  {scanStep === 2 && "Running PyTorch/YOLO inference..."}
                  {scanStep === 3 && "Computing carbon savings & rewards..."}
                </div>
                <div style={{
                  width: "100%",
                  height: "6px",
                  background: "var(--bg-main)",
                  borderRadius: "3px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${(scanStep / 3) * 100}%`,
                    height: "100%",
                    background: "var(--accent)",
                    transition: "width 0.4s ease"
                  }} />
                </div>
              </div>
            ) : (
              <div style={{ marginTop: "14px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  Press scan to re-analyze material composition.
                </span>
                <button
                  onClick={() => runAiScanMock(selectedPreset)}
                  className="btn-secondary"
                  style={{ padding: "6px 14px", fontSize: "0.8rem" }}
                >
                  <RefreshCw size={14} /> Re-scan Item
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scanned Result & Recycling Directive */}
        <div>
          <div className="glass-card" style={{ padding: "28px" }}>
            {/* Bin Destination Header */}
            <div style={{
              background: "var(--bg-main)",
              border: `1.5px solid ${scannedResult.binColor || "#3b82f6"}66`,
              padding: "16px 20px",
              borderRadius: "16px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px"
            }}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: scannedResult.binColor || "#3b82f6", letterSpacing: "0.05em" }}>
                  DISPOSAL DESTINATION
                </span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "2px 0 0 0", color: "var(--text-primary)" }}>
                  {scannedResult.binType}
                </h3>
              </div>
              <div style={{
                background: scannedResult.binColor || "#3b82f6",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "0.9rem",
                boxShadow: `0 4px 12px ${scannedResult.binColor || "#3b82f6"}44`
              }}>
                {scannedResult.confidence}% Match
              </div>
            </div>

            {/* Material Name & Category */}
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "6px" }}>
                {scannedResult.name}
              </h2>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span className="badge badge-info">{scannedResult.category}</span>
                {scannedResult.tags && scannedResult.tags.map((tag, idx) => (
                  <span key={idx} className="badge" style={{ background: "var(--bg-main)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              marginBottom: "20px"
            }}>
              <div style={{ background: "var(--bg-main)", padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "4px" }}>
                  <Scale size={14} /> Weight
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{scannedResult.weightKg} kg</div>
              </div>

              <div style={{ background: "var(--bg-main)", padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "4px" }}>
                  <Leaf size={14} color="#10b981" /> CO2 Saved
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#10b981" }}>+{scannedResult.co2SavedKg} kg</div>
              </div>

              <div style={{ background: "var(--bg-main)", padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "4px" }}>
                  <Sparkles size={14} color="#3b82f6" /> Recyclability
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#3b82f6" }}>{scannedResult.recyclabilityRate}</div>
              </div>
            </div>

            {/* Material Composition Bars */}
            {scannedResult.composition && (
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "10px" }}>
                  MATERIAL COMPOSITION BREAKDOWN
                </h4>
                {scannedResult.composition.map((comp, i) => (
                  <div key={i} style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "3px", fontWeight: 600 }}>
                      <span>{comp.name}</span>
                      <span>{comp.percent}%</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "var(--bg-main)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{
                        width: `${comp.percent}%`,
                        height: "100%",
                        background: i === 0 ? "#10b981" : i === 1 ? "#3b82f6" : "#f59e0b",
                        borderRadius: "3px"
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Nearby Recycling Facilities */}
            {nearbyCenters && nearbyCenters.length > 0 && (
              <div style={{ marginBottom: "20px", background: "var(--bg-main)", padding: "14px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={16} /> RECOMMENDED NEARBY RECYCLING CENTER
                </h4>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {nearbyCenters[0].name}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {nearbyCenters[0].address} ({nearbyCenters[0].distance_km ? `${nearbyCenters[0].distance_km.toFixed(1)} km away` : "Nearby"})
                </div>
              </div>
            )}

            {/* Preparation & Sorting Instructions */}
            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <FileCheck size={16} color="#10b981" /> PREPARATION & RECYCLING STEPS
              </h4>
              <ul style={{ paddingLeft: "18px", margin: 0, fontSize: "0.88rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "6px" }}>
                {scannedResult.instructions && scannedResult.instructions.map((step, idx) => (
                  <li key={idx} style={{ lineHeight: 1.4 }}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Reward Action Button */}
            <button
              onClick={handleClaimPoints}
              disabled={pointsClaimed}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                justifyContent: "center",
                fontSize: "1rem",
                background: pointsClaimed ? "rgba(16, 185, 129, 0.2)" : "var(--accent)",
                color: pointsClaimed ? "#10b981" : "#ffffff",
                cursor: pointsClaimed ? "default" : "pointer"
              }}
            >
              {pointsClaimed ? (
                <>
                  <CheckCircle2 size={20} /> +{scannedResult.earnedReward || 50} Eco-Points Added to Wallet!
                </>
              ) : (
                <>
                  <Award size={20} /> Record Recycling Scan & Claim +{scannedResult.earnedReward || 50} Eco-Points
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* User Past Scan History Section */}
      {currentUser && scanHistory.length > 0 && (
        <div className="glass-card" style={{ marginTop: "32px", padding: "24px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <History size={20} color="var(--accent)" /> Your Recent Scan History
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {scanHistory.map((scan) => (
              <div key={scan.id} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "var(--bg-main)",
                borderRadius: "12px",
                border: "1px solid var(--border-color)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img 
                    src={getFullMediaUrl(scan.annotated_image_url || scan.image_url)} 
                    alt="Scan" 
                    style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                      Scan #{scan.id} - {scan.total_items} item(s) detected
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "flex", gap: "12px", marginTop: "2px" }}>
                      <span><Leaf size={12} style={{ verticalAlign: "middle" }} /> {scan.total_carbon_saved} kg CO2</span>
                      <span><Award size={12} style={{ verticalAlign: "middle" }} /> +{scan.total_reward} pts</span>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={12} /> {new Date(scan.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
