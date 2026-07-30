import React from "react";
import { 
  Recycle, 
  Scan, 
  Trash2, 
  Route, 
  MapPin,
  BarChart3, 
  Award, 
  Bot, 
  Sun, 
  Moon, 
  Layers,
  UserCheck,
  LogIn,
  LogOut,
  Building2,
  User
} from "lucide-react";

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  portalMode,
  setPortalMode,
  userPoints, 
  currentUser,
  onOpenAuthModal,
  onLogout,
  theme, 
  toggleTheme 
}) {
  // Citizen Portal Navigation Items
  const citizenNavItems = [
    { id: "dashboard", label: "Overview", icon: Layers },
    { id: "scanner", label: "Item Scanner", icon: Scan },
    { id: "map", label: "Recycling Map", icon: MapPin },
    { id: "rewards", label: "Eco-Rewards", icon: Award },
    { id: "assistant", label: "AI Assistant", icon: Bot },
  ];

  // Municipal Admin Hub Navigation Items
  const adminNavItems = [
    { id: "iot-bins", label: "Smart Bins", icon: Trash2 },
    { id: "routes", label: "Fleet Routes", icon: Route },
    { id: "analytics", label: "ESG Analytics", icon: BarChart3 },
  ];

  const currentNavItems = portalMode === "admin" ? adminNavItems : citizenNavItems;

  const handlePortalSwitch = (mode) => {
    setPortalMode(mode);
    if (mode === "admin") {
      setActiveTab("iot-bins");
    } else {
      setActiveTab("dashboard");
    }
  };

  return (
    <nav className="glass-card" style={{
      position: "sticky",
      top: "12px",
      zIndex: 100,
      margin: "12px 16px 24px 16px",
      padding: "12px 24px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      flexWrap: "wrap"
    }}>
      {/* Brand Logo & Portal Selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div 
          onClick={() => handlePortalSwitch("citizen")} 
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
        >
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: portalMode === "admin" ? "rgba(99, 102, 241, 0.15)" : "var(--accent-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: portalMode === "admin" ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid rgba(15, 118, 110, 0.14)",
            transition: "all 0.3s ease"
          }}>
            {portalMode === "admin" ? (
              <Building2 size={24} color="#6366f1" />
            ) : (
              <Recycle size={24} color="var(--accent)" />
            )}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                GreenLens AI
              </span>
              <span style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "2px 8px",
                borderRadius: "12px",
                background: portalMode === "admin" ? "rgba(99, 102, 241, 0.2)" : "rgba(16, 185, 129, 0.2)",
                color: portalMode === "admin" ? "#818cf8" : "#10b981",
                border: portalMode === "admin" ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid rgba(16, 185, 129, 0.4)"
              }}>
                {portalMode === "admin" ? "Admin Hub" : "Citizen"}
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: 0 }}>
              {portalMode === "admin" ? "Municipal Operator Command Center" : "Citizen Waste Intelligence App"}
            </p>
          </div>
        </div>

        {/* Portal Mode Switcher Toggle Pill */}
        <div style={{
          display: "flex",
          background: "var(--bg-main)",
          padding: "3px",
          borderRadius: "20px",
          border: "1px solid var(--border-color)",
          marginLeft: "8px"
        }}>
          <button
            onClick={() => handlePortalSwitch("citizen")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "16px",
              border: "none",
              fontSize: "0.75rem",
              fontWeight: 700,
              background: portalMode === "citizen" ? "var(--accent)" : "transparent",
              color: portalMode === "citizen" ? "#ffffff" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <User size={13} />
            Citizen Portal
          </button>
          <button
            onClick={() => handlePortalSwitch("admin")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "16px",
              border: "none",
              fontSize: "0.75rem",
              fontWeight: 700,
              background: portalMode === "admin" ? "#6366f1" : "transparent",
              color: portalMode === "admin" ? "#ffffff" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <Building2 size={13} />
            Municipal Admin
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        background: "var(--bg-main)",
        padding: "4px",
        borderRadius: "12px",
        border: "1px solid var(--border-color)",
        overflowX: "auto",
        maxWidth: "100%"
      }}>
        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const activeBg = portalMode === "admin" ? "#6366f1" : "var(--accent)";
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "10px",
                border: "none",
                fontSize: "0.85rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#ffffff" : "var(--text-secondary)",
                background: isActive ? activeBg : "transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                boxShadow: "none"
              }}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Controls, Points & Auth */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Points Display */}
        {portalMode === "citizen" && (
          <div 
            onClick={() => setActiveTab("rewards")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--accent-soft)",
              border: "1px solid rgba(15, 118, 110, 0.16)",
              padding: "6px 12px",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--accent)"
            }}
          >
            <Award size={16} />
            <span>{userPoints} Eco-Pts</span>
          </div>
        )}

        {/* User Auth Button */}
        {currentUser ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div 
              onClick={() => setActiveTab("profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: activeTab === "profile" ? "rgba(16, 185, 129, 0.15)" : "var(--bg-main)",
                border: activeTab === "profile" ? "1px solid #10b981" : "1px solid var(--border-color)",
                padding: "6px 12px",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: activeTab === "profile" ? "#10b981" : "var(--text-primary)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <UserCheck size={14} color="#10b981" />
              <span>{currentUser.username || currentUser.email}</span>
              <span style={{
                fontSize: "0.65rem",
                fontWeight: 800,
                textTransform: "uppercase",
                padding: "1px 5px",
                borderRadius: "4px",
                background: currentUser.role === "admin" ? "rgba(99, 102, 241, 0.2)" : "rgba(16, 185, 129, 0.2)",
                color: currentUser.role === "admin" ? "#818cf8" : "#10b981"
              }}>
                {currentUser.role || "citizen"}
              </span>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: portalMode === "admin" ? "#6366f1" : "var(--accent)",
              border: "none",
              color: "#ffffff",
              padding: "8px 14px",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            <LogIn size={15} />
            Sign In
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            border: "1px solid var(--border-color)",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#3b82f6" />}
        </button>
      </div>
    </nav>
  );
}

