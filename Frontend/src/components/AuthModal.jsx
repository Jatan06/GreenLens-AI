import React, { useState } from "react";
import { X, LogIn, UserPlus, Lock, Mail, User, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { loginUser, registerUser } from "../api/client";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [role, setRole] = useState("citizen"); // 'citizen' | 'admin'
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await loginUser(email, password);
        setSuccess("Login successful!");
        setTimeout(() => {
          onAuthSuccess(res.user);
          onClose();
        }, 600);
      } else {
        const res = await registerUser(email, username, password, fullName, role);
        setSuccess(`Registration successful! Registered as ${role.toUpperCase()}.`);
        setTimeout(() => {
          onAuthSuccess(res.user);
          onClose();
        }, 800);
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: "100%",
        maxWidth: "420px",
        borderRadius: "20px",
        padding: "28px",
        position: "relative",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.15)"
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            padding: "4px"
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "var(--accent-soft)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "12px"
          }}>
            <ShieldCheck size={26} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
            {mode === "login" ? "Sign In to GreenLens AI" : "Create Citizen Account"}
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "4px" }}>
            {mode === "login" 
              ? "Access your waste scan history and redeem eco-vouchers"
              : "Join our green initiative and get 50 bonus Eco-Points"}
          </p>
        </div>

        {/* Form Mode Tabs */}
        <div style={{
          display: "flex",
          background: "var(--bg-main)",
          padding: "4px",
          borderRadius: "12px",
          marginBottom: "20px",
          border: "1px solid var(--border-color)"
        }}>
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "8px",
              border: "none",
              background: mode === "login" ? "var(--accent)" : "transparent",
              color: mode === "login" ? "#fff" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            <LogIn size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "8px",
              border: "none",
              background: mode === "register" ? "var(--accent)" : "transparent",
              color: mode === "register" ? "#fff" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            <UserPlus size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
            Register
          </button>
        </div>

        {/* Alert Messages */}
        {error && (
          <div style={{
            padding: "10px 14px",
            borderRadius: "10px",
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
            fontSize: "0.82rem",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <AlertCircle size={16} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            padding: "10px 14px",
            borderRadius: "10px",
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#10b981",
            fontSize: "0.82rem",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <CheckCircle2 size={16} flexShrink={0} />
            <span>{success}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@greenlens.ai"
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 38px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-main)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          {mode === "register" && (
            <>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                  Account Type
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setRole("citizen")}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: role === "citizen" ? "1px solid #10b981" : "1px solid var(--border-color)",
                      background: role === "citizen" ? "rgba(16, 185, 129, 0.12)" : "var(--bg-main)",
                      color: role === "citizen" ? "#10b981" : "var(--text-secondary)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    🌿 Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: role === "admin" ? "1px solid #6366f1" : "1px solid var(--border-color)",
                      background: role === "admin" ? "rgba(99, 102, 241, 0.12)" : "var(--bg-main)",
                      color: role === "admin" ? "#818cf8" : "var(--text-secondary)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    🏢 Municipal Admin
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                  Username
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="green_warrior_99"
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 38px",
                      borderRadius: "10px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-main)",
                      color: "var(--text-primary)",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivers"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-main)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 38px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-main)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "8px",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "var(--accent)",
              color: "#ffffff",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {loading ? "Authenticating..." : mode === "login" ? "Sign In" : "Register Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
