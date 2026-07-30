import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import BottomNav from "./components/BottomNav";
import Scan from "./pages/Scan";
import Results from "./pages/Results";
import MapPage from "./pages/MapPage";
import Rewards from "./pages/Rewards";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AssistantPage from "./pages/AssistantPage";
import OperatorDashboard from "./pages/OperatorDashboard";
import IotBinsPage from "./pages/IotBinsPage";
import RouteOptimizerPage from "./pages/RouteOptimizerPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import "./index.css";
import "leaflet/dist/leaflet.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Scan />} />
            <Route path="/results" element={<Results />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/operator" element={<OperatorDashboard />} />
            <Route path="/operator/iot-bins" element={<IotBinsPage />} />
            <Route path="/operator/routes" element={<RouteOptimizerPage />} />
            <Route path="/operator/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomNav />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
