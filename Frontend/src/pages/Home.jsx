import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AiScanner from "../components/AiScanner";
import IotBins from "../components/IotBins";
import RouteOptimizer from "../components/RouteOptimizer";
import EsgAnalytics from "../components/EsgAnalytics";
import EcoRewards from "../components/EcoRewards";
import WasteBot from "../components/WasteBot";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import MapPage from "../components/MapPage";
import UserProfile from "../components/UserProfile";
import { INITIAL_IOT_BINS } from "../data/wasteData";
import { getCurrentUser, removeToken, getUserImpactStats } from "../api/client";

export default function Home() {
  const [portalMode, setPortalMode] = useState("citizen"); // "citizen" | "admin"
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userPoints, setUserPoints] = useState(350);
  const [theme, setTheme] = useState("dark");
  const [bins, setBins] = useState(INITIAL_IOT_BINS);
  
  // User Auth & Profile State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load user profile on app startup if token exists
  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setUserPoints(user.total_reward_points || 350);
          if (user.role === "admin") {
            setPortalMode("admin");
            setActiveTab("iot-bins");
          }
        }
      } catch (err) {
        console.warn("Could not fetch logged-in user profile:", err);
      }
    }
    loadUser();
  }, []);

  // Apply dark / light theme to body document attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const handleAddPoints = (pts) => {
    setUserPoints(prev => prev + pts);
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, total_reward_points: (prev.total_reward_points || 0) + pts } : prev);
    }
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (user && user.total_reward_points !== undefined) {
      setUserPoints(user.total_reward_points);
    }
    if (user && user.role === "admin") {
      setPortalMode("admin");
      setActiveTab("iot-bins");
    }
  };

  const handleLogout = () => {
    removeToken();
    setCurrentUser(null);
    setPortalMode("citizen");
    setActiveTab("dashboard");
  };

  const urgentBinsCount = bins.filter(b => b.fillLevel >= 85).length;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        portalMode={portalMode}
        setPortalMode={setPortalMode}
        userPoints={userPoints}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {portalMode === "admin" && (
        <div style={{
          margin: "0 16px 16px 16px",
          padding: "10px 20px",
          borderRadius: "12px",
          background: "linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              background: "#6366f1",
              color: "#fff",
              fontSize: "0.7rem",
              fontWeight: 800,
              padding: "4px 8px",
              borderRadius: "6px",
              textTransform: "uppercase"
            }}>
              Municipal Command Center
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>
              Viewing Municipal Waste Management, Fleet Dispatch & ESG Analytics Portal
            </span>
          </div>
          {(!currentUser || currentUser.role !== "admin") && (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#6366f1",
                background: "#ffffff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Sign in as Admin
            </button>
          )}
        </div>
      )}

      <main style={{ flex: 1 }}>
        {/* CITIZEN PORTAL VIEWS */}
        {portalMode === "citizen" && activeTab === "dashboard" && (
          <>
            <Hero
              setActiveTab={setActiveTab}
              iotBinsCount={bins.length}
              urgentBinsCount={urgentBinsCount}
            />
            <AiScanner onAddPoints={handleAddPoints} currentUser={currentUser} />
          </>
        )}

        {portalMode === "citizen" && activeTab === "scanner" && (
          <AiScanner onAddPoints={handleAddPoints} currentUser={currentUser} />
        )}

        {portalMode === "citizen" && activeTab === "map" && (
          <MapPage />
        )}

        {portalMode === "citizen" && activeTab === "rewards" && (
          <EcoRewards 
            userPoints={userPoints} 
            setUserPoints={setUserPoints}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {portalMode === "citizen" && activeTab === "assistant" && (
          <WasteBot />
        )}

        {/* MUNICIPAL ADMIN PORTAL VIEWS */}
        {portalMode === "admin" && activeTab === "iot-bins" && (
          <IotBins
            bins={bins}
            setBins={setBins}
            onDispatchRoute={() => setActiveTab("routes")}
          />
        )}

        {portalMode === "admin" && activeTab === "routes" && (
          <RouteOptimizer bins={bins} setBins={setBins} />
        )}

        {portalMode === "admin" && activeTab === "analytics" && (
          <EsgAnalytics />
        )}

        {/* SHARED VIEWS */}
        {activeTab === "profile" && (
          <UserProfile currentUser={currentUser} onLogout={handleLogout} />
        )}
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}