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
  };

  const handleLogout = () => {
    removeToken();
    setCurrentUser(null);
  };

  const urgentBinsCount = bins.filter(b => b.fillLevel >= 85).length;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userPoints={userPoints}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main style={{ flex: 1 }}>
        {activeTab === "dashboard" && (
          <>
            <Hero
              setActiveTab={setActiveTab}
              iotBinsCount={bins.length}
              urgentBinsCount={urgentBinsCount}
            />
            <AiScanner onAddPoints={handleAddPoints} currentUser={currentUser} />
          </>
        )}

        {activeTab === "scanner" && (
          <AiScanner onAddPoints={handleAddPoints} currentUser={currentUser} />
        )}

        {activeTab === "iot-bins" && (
          <IotBins
            bins={bins}
            setBins={setBins}
            onDispatchRoute={() => setActiveTab("routes")}
          />
        )}

        {activeTab === "routes" && (
          <RouteOptimizer bins={bins} setBins={setBins} />
        )}

        {activeTab === "analytics" && (
          <EsgAnalytics />
        )}

        {activeTab === "rewards" && (
          <EcoRewards 
            userPoints={userPoints} 
            setUserPoints={setUserPoints}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === "assistant" && (
          <WasteBot />
        )}
        {activeTab === "map" && (
          <MapPage />
        )}

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