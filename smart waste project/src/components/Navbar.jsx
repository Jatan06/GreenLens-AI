import React from "react";
import { 
  Recycle, 
  Scan, 
  Trash2, 
  Route, 
  BarChart3, 
  Award, 
  Bot, 
  Sun, 
  Moon, 
  Activity,
  Layers,
  UserCheck,
  LogIn,
  LogOut
} from "lucide-react";

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  userPoints, 
  currentUser,
  onOpenAuthModal,
  onLogout,
  theme, 
  toggleTheme 
}) {
  const navItems = [
    { id: "dashboard", label: "Overview", icon: Layers },
    { id: "scanner", label: "Item Scanner", icon: Scan },
    { id: "iot-bins", label: "Bins", icon: Trash2 },
    { id: "routes", label: "Routes", icon: Route },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "rewards", label: "Rewards", icon: Award },
    { id: "assistant", label: "Assistant", icon: Bot },
  ];

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
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveTab("dashboard")} 
        style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
      >
        <div style={{
          width: "42px",
          height: "42px",
          borderRadius: "12px",
          background: "var(--accent-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(15, 118, 110, 0.14)"
        }}>
          <Recycle size={24} color="var(--accent)" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              GreenLens AI
            </span>
            <span className="badge badge-success" style={{ padding: "2px 8px", fontSize: "0.65rem" }}>
              <Activity size={10} /> Live IoT API
            </span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: 0 }}>
            Smart Waste Management System
          </p>
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
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
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
                background: isActive ? "var(--accent)" : "transparent",
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

        {/* User Auth Button */}
        {currentUser ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--bg-main)",
              border: "1px solid var(--border-color)",
              padding: "6px 12px",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--text-primary)"
            }}>
              <UserCheck size={14} color="#10b981" />
              <span>{currentUser.username || currentUser.email}</span>
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
              background: "var(--accent)",
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
