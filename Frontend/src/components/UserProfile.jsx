import React, { useState, useEffect } from "react";
import { User, Mail, Shield, Award, Edit3, Settings, History, CheckCircle2 } from "lucide-react";
import { getUserProfile, updateUserProfile, getScanHistory, getFullMediaUrl } from "../api/client";

export default function UserProfile({ currentUser, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [scans, setScans] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", username: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      loadProfileData();
    }
  }, [currentUser]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const prof = await getUserProfile();
      setProfile(prof);
      setFormData({ full_name: prof.full_name || "", username: prof.username || "" });
      
      const history = await getScanHistory(0, 10);
      setScans(history || []);
    } catch (err) {
      console.warn("Failed to load profile details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      loadProfileData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error updating profile: " + err.message);
    }
  };

  if (!currentUser) {
    return (
      <div className="animate-fade-in" style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>User Profile</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>
          Please sign in to view your profile and scan history.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: "0 16px 32px 16px", maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
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
            <User size={20} color="#3b82f6" />
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>
            Account Settings
          </h2>
        </div>
      </div>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* Profile Card */}
        <div className="glass-card" style={{ flex: "1 1 300px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: 800
            }}>
              {profile?.username ? profile.username.charAt(0).toUpperCase() : "U"}
            </div>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                <Edit3 size={18} />
              </button>
            )}
          </div>
          
          {message && (
            <div style={{ padding: "10px", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={16} /> {message}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="input-field"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="input-field"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: "10px", justifyContent: "center" }}>Save</button>
                <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)} style={{ padding: "10px" }}>Cancel</button>
              </div>
            </form>
          ) : (
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 4px 0" }}>{profile?.full_name || profile?.username}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px", margin: "0 0 16px 0" }}>
                <Mail size={14} /> {profile?.email}
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}><Award size={14} /> Eco-Score</span>
                  <span style={{ fontWeight: 700, color: "#10b981" }}>{profile?.eco_score}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}><Settings size={14} /> Role</span>
                  <span className="badge badge-info" style={{
                    background: profile?.role === "admin" ? "rgba(99, 102, 241, 0.2)" : "rgba(16, 185, 129, 0.2)",
                    color: profile?.role === "admin" ? "#818cf8" : "#10b981",
                    border: profile?.role === "admin" ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid rgba(16, 185, 129, 0.4)",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontWeight: 700
                  }}>
                    {profile?.role ? profile.role.toUpperCase() : "CITIZEN"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}><Shield size={14} /> Joined</span>
                  <span style={{ fontSize: "0.85rem" }}>{new Date(profile?.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: "24px" }}>
            <button onClick={onLogout} className="btn-secondary" style={{ width: "100%", justifyContent: "center", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.2)", background: "rgba(239, 68, 68, 0.05)" }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Scan History */}
        <div className="glass-card" style={{ flex: "2 1 400px", padding: "24px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <History size={18} color="var(--accent)" /> Your AI Scan History
          </h3>
          
          {scans.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--text-secondary)", background: "var(--bg-main)", borderRadius: "12px", border: "1px dashed var(--border-color)" }}>
              No scans found. Go to the Scanner to analyze some waste!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {scans.map((scan) => (
                <div key={scan.id} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "var(--bg-main)",
                  borderRadius: "12px",
                  border: "1px solid var(--border-color)",
                  transition: "transform 0.2s"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "8px", overflow: "hidden", background: "var(--bg-card)" }}>
                      <img 
                        src={getFullMediaUrl(scan.annotated_image_url || scan.image_url)} 
                        alt="Scan preview" 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                        Scan #{scan.id} - {scan.total_items} item(s)
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {new Date(scan.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10b981", marginBottom: "2px" }}>
                      +{scan.total_reward} pts
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      {scan.total_carbon_saved}kg CO2
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
