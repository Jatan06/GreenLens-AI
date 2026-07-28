import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Scan from "./pages/Scan";
import Results from "./pages/Results";
import MapPage from "./pages/MapPage";
import Rewards from "./pages/Rewards";
import "./index.css";
import "leaflet/dist/leaflet.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/"         element={<Scan />} />
          <Route path="/results"  element={<Results />} />
          <Route path="/map"      element={<MapPage />} />
          <Route path="/rewards"  element={<Rewards />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
