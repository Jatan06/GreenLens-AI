import React, { useState } from "react";
import { 
  Award, 
  Coffee, 
  Bus, 
  Trees, 
  Gift, 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck,
  Star
} from "lucide-react";
import { INITIAL_REWARDS } from "../data/wasteData";

export default function EcoRewards({ userPoints, setUserPoints }) {
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  const getRewardIcon = (iconName) => {
    switch (iconName) {
      case "Coffee": return <Coffee size={22} color="#f59e0b" />;
      case "Bus": return <Bus size={22} color="#3b82f6" />;
      case "Trees": return <Trees size={22} color="#10b981" />;
      case "Gift": return <Gift size={22} color="#8b5cf6" />;
      default: return <Award size={22} color="#10b981" />;
    }
  };

  const handleClaim = (reward) => {
    if (userPoints >= reward.pointsRequired) {
      setUserPoints(prev => prev - reward.pointsRequired);
      setClaimedRewards([...claimedRewards, reward.id]);
      setActiveModal(reward);
    }
  };

  const currentLevel = Math.floor(userPoints / 200) + 1;
  const nextLevelPts = currentLevel * 200;
  const levelProgress = Math.min(100, Math.round(((userPoints % 200) / 200) * 100));

  return (
    <div className="animate-fade-in" style={{ padding: "0 16px 32px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(245, 158, 11, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Award size={20} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>
            Eco-Rewards
          </h2>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Earn points for every item scan and recycling contribution. Redeem points for partner rewards.
        </p>
      </div>

      {/* User Level & Points Status Banner */}
      <div className="glass-card" style={{
        padding: "28px",
        marginBottom: "28px",
        background: "var(--bg-card-alt)",
        border: "1px solid rgba(15, 118, 110, 0.14)"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
          alignItems: "center"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="badge badge-success">Level {currentLevel} Eco-Warrior</span>
              <Sparkles size={14} color="#10b981" />
            </div>
            <h1 style={{ fontSize: "2.6rem", fontWeight: 800, margin: 0, color: "#10b981" }}>
              {userPoints} <span style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-primary)" }}>Eco-Points</span>
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
              Keep scanning items to level up and unlock exclusive partner perks!
            </p>
          </div>

          {/* Level Progress */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
              <span>Level {currentLevel} Progress</span>
              <span>{userPoints} / {nextLevelPts} Pts</span>
            </div>
            <div style={{
              width: "100%",
              height: "12px",
              background: "var(--bg-main)",
              borderRadius: "6px",
              overflow: "hidden",
              border: "1px solid var(--border-color)"
            }}>
              <div style={{
                width: `${levelProgress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #10b981, #06b6d4)",
                borderRadius: "6px",
                transition: "width 0.4s ease"
              }} />
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "6px", textAlign: "right" }}>
              {nextLevelPts - userPoints} points to Level {currentLevel + 1}
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Catalog */}
      <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Gift size={20} color="#10b981" /> Claimable Eco-Rewards Marketplace
      </h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px"
      }}>
        {INITIAL_REWARDS.map((reward) => {
          const isClaimed = claimedRewards.includes(reward.id);
          const canAfford = userPoints >= reward.pointsRequired;

          return (
            <div key={reward.id} className="glass-card" style={{
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: !canAfford && !isClaimed ? 0.75 : 1
            }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "var(--bg-main)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {getRewardIcon(reward.icon)}
                  </div>
                  <span className="badge badge-info" style={{ fontSize: "0.7rem" }}>
                    {reward.category}
                  </span>
                </div>

                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 6px 0" }}>
                  {reward.title}
                </h4>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: 1.4 }}>
                  {reward.description}
                </p>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", fontSize: "0.9rem", fontWeight: 700 }}>
                  <span style={{ color: "var(--text-muted)" }}>Cost:</span>
                  <span style={{ color: canAfford ? "#10b981" : "#ef4444" }}>
                    {reward.pointsRequired} Pts
                  </span>
                </div>

                <button
                  onClick={() => handleClaim(reward)}
                  disabled={!canAfford || isClaimed}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "10px",
                    justifyContent: "center",
                    fontSize: "0.9rem",
                    background: isClaimed 
                      ? "rgba(16, 185, 129, 0.2)" 
                      : !canAfford 
                      ? "var(--bg-main)" 
                      : "var(--accent)",
                    color: isClaimed ? "#10b981" : !canAfford ? "var(--text-muted)" : "#ffffff",
                    border: !canAfford && !isClaimed ? "1px solid var(--border-color)" : "none",
                    cursor: canAfford && !isClaimed ? "pointer" : "default"
                  }}
                >
                  {isClaimed ? (
                    <>
                      <Check size={16} /> Voucher Claimed!
                    </>
                  ) : canAfford ? (
                    "Redeem Voucher"
                  ) : (
                    `Need ${reward.pointsRequired - userPoints} More Pts`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Claim Success Modal */}
      {activeModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "16px"
        }}>
          <div className="glass-card animate-fade-in" style={{
            padding: "32px",
            maxWidth: "420px",
            width: "100%",
            textAlign: "center",
            background: "var(--bg-card)"
          }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "var(--bg-main)",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto"
            }}>
              <Check size={32} />
            </div>

            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "8px" }}>
              Reward Voucher Unlocked!
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
              You redeemed <strong>{activeModal.title}</strong> from {activeModal.vendor}.
            </p>

            <div style={{
              background: "var(--bg-main)",
              padding: "12px",
              borderRadius: "10px",
              border: "1px dashed #10b981",
              fontWeight: 800,
              fontSize: "1.2rem",
              color: "#10b981",
              letterSpacing: "0.1em",
              marginBottom: "24px"
            }}>
              ECO-WASTE-2026-{Math.floor(1000 + Math.random() * 9000)}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Done & Save Voucher
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
