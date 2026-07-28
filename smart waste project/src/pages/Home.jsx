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
import { INITIAL_IOT_BINS } from "../data/wasteData";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userPoints, setUserPoints] = useState(350);
  const [theme, setTheme] = useState("dark");
  const [bins, setBins] = useState(INITIAL_IOT_BINS);

  // Apply dark / light theme to body document attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const handleAddPoints = (pts) => {
    setUserPoints(prev => prev + pts);
  };

  const urgentBinsCount = bins.filter(b => b.fillLevel >= 85).length;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userPoints={userPoints}
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
            <AiScanner onAddPoints={handleAddPoints} />
          </>
        )}

        {activeTab === "scanner" && (
          <AiScanner onAddPoints={handleAddPoints} />
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
          <EcoRewards userPoints={userPoints} setUserPoints={setUserPoints} />
        )}

        {activeTab === "assistant" && (
          <WasteBot />
        )}
      </main>

      <Footer />
    </div>
  );
}