import React, { useState, useEffect } from "react";
import { 
  Award, 
  Coffee, 
  Bus, 
  Trees, 
  Gift, 
  Check, 
  Sparkles, 
  ShieldCheck,
  Trophy,
  Ticket,
  AlertCircle
} from "lucide-react";
import { getRewardCatalog, redeemReward, getUserRedeemedRewards, getGlobalLeaderboard } from "../api/client";
import { INITIAL_REWARDS } from "../data/wasteData";

export default function EcoRewards({ userPoints, setUserPoints, currentUser, onOpenAuthModal }) {
  const [catalog, setCatalog] = useState(INITIAL_REWARDS);
  const [myVouchers, setMyVouchers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState("catalog"); // 'catalog' | 'vouchers' | 'leaderboard'
  const [redeemingId, setRedeemingId] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadCatalog();
    loadLeaderboard();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadMyVouchers();
    }
  }, [currentUser]);

  const loadCatalog = async () => {
    try {
      const data = await getRewardCatalog();
      if (data && data.length > 0) {
        setCatalog(data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          pointsRequired: item.points_cost,
          vendor: item.partner_name || "Eco Partner",
          icon: item.category === "Mobility" ? "Bus" : item.category === "Impact" ? "Trees" : item.category === "Discount" ? "Coffee" : "Gift"
        })));
      }
    } catch (err) {
      console.warn("Backend rewards catalog fetch warning:", err);
    }
  };

  const loadMyVouchers = async () => {
    try {
      const data = await getUserRedeemedRewards();
      setMyVouchers(data);
    } catch (err) {
      console.warn("My rewards fetch warning:", err);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const data = await getGlobalLeaderboard(10);
      setLeaderboard(data);
    } catch (err) {
      console.warn("Leaderboard fetch warning:", err);
    }
  };

  const getRewardIcon = (iconName) => {
    switch (iconName) {
      case "Coffee": return <Coffee size={22} color="#f59e0b" />;
      case "Bus": return <Bus size={22} color="#3b82f6" />;
      case "Trees": return <Trees size={22} color="#10b981" />;
      case "Gift": return <Gift size={22} color="#8b5cf6" />;
      default: return <Award size={22} color="#10b981" />;
    }
  };

  const handleClaim = async (reward) => {
    setErrorMsg("");
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }

    if (userPoints < reward.pointsRequired) {
      setErrorMsg(`Insufficient points! You need ${reward.pointsRequired} pts but have ${userPoints} pts.`);
      return;
    }

    setRedeemingId(reward.id);
    try {
      const res = await redeemReward(reward.id);
      setUserPoints(res.remaining_points);
      setActiveModal({
        title: res.reward_title,
        code: res.redemption_code,
        message: res.message
      });
      loadMyVouchers();
    } catch (err) {
      setErrorMsg(err.message || "Failed to redeem reward.");
    } finally {
      setRedeemingId(null);
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
            Eco-Rewards & Leaderboard
          </h2>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Earn points for every waste scan and redeem them for real eco-vouchers or track your global citizen rank.
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
              {currentUser ? `Logged in as ${currentUser.username || currentUser.email}` : "Sign in to persist your eco-points and redeem rewards!"}
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

      {/* Tabs: Marketplace / My Vouchers / Leaderboard */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        borderBottom: "1px solid var(--border-color)",
        paddingBottom: "10px"
      }}>
        <button
          onClick={() => setActiveTab("catalog")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "10px",
            border: "none",
            background: activeTab === "catalog" ? "var(--accent)" : "transparent",
            color: activeTab === "catalog" ? "#fff" : "var(--text-secondary)",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          <Gift size={16} /> Rewards Marketplace
        </button>
        <button
          onClick={() => setActiveTab("vouchers")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "10px",
            border: "none",
            background: activeTab === "vouchers" ? "var(--accent)" : "transparent",
            color: activeTab === "vouchers" ? "#fff" : "var(--text-secondary)",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          <Ticket size={16} /> My Vouchers ({myVouchers.length})
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "10px",
            border: "none",
            background: activeTab === "leaderboard" ? "var(--accent)" : "transparent",
            color: activeTab === "leaderboard" ? "#fff" : "var(--text-secondary)",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          <Trophy size={16} /> Citizen Leaderboard
        </button>
      </div>

      {errorMsg && (
        <div style={{
          padding: "10px 14px",
          borderRadius: "10px",
          background: "rgba(239, 68, 68, 0.12)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#ef4444",
          fontSize: "0.85rem",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {/* Catalog Tab */}
      {activeTab === "catalog" && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px"
        }}>
          {catalog.map((reward) => {
            const canAfford = userPoints >= reward.pointsRequired;
            const isLoading = redeemingId === reward.id;

            return (
              <div key={reward.id} className="glass-card" style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: !canAfford ? 0.75 : 1
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
                    disabled={!canAfford || isLoading}
                    className="btn-primary"
                    style={{
                      width: "100%",
                      padding: "10px",
                      justifyContent: "center",
                      fontSize: "0.9rem",
                      background: !canAfford ? "var(--bg-main)" : "var(--accent)",
                      color: !canAfford ? "var(--text-muted)" : "#ffffff",
                      border: !canAfford ? "1px solid var(--border-color)" : "none",
                      cursor: canAfford ? "pointer" : "default"
                    }}
                  >
                    {isLoading ? "Processing..." : canAfford ? "Redeem Voucher" : `Need ${reward.pointsRequired - userPoints} More Pts`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* My Vouchers Tab */}
      {activeTab === "vouchers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {!currentUser ? (
            <div className="glass-card" style={{ padding: "32px", textAlign: "center" }}>
              <ShieldCheck size={36} color="var(--accent)" style={{ marginBottom: "12px" }} />
              <h3>Sign In to View Your Voucher Wallet</h3>
              <p style={{ color: "var(--text-secondary)" }}>Log in to view all your past redeemed coupon codes and discounts.</p>
              <button onClick={onOpenAuthModal} className="btn-primary" style={{ margin: "16px auto 0 auto" }}>Sign In Now</button>
            </div>
          ) : myVouchers.length === 0 ? (
            <div className="glass-card" style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
              You haven't redeemed any vouchers yet. Redeem points from the marketplace!
            </div>
          ) : (
            myVouchers.map((tx) => (
              <div key={tx.id} className="glass-card" style={{ padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    {tx.reward_title || "Eco Voucher"}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Redeemed on {new Date(tx.redeemed_at).toLocaleDateString()} • {tx.points_spent} pts spent
                  </div>
                </div>
                <div style={{
                  background: "var(--bg-main)",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  border: "1px dashed #10b981",
                  fontFamily: "monospace",
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "#10b981"
                }}>
                  {tx.redemption_code}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && (
        <div className="glass-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "16px" }}>
            🏆 Global Citizen Ranking
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {leaderboard.length === 0 ? (
              <div style={{ color: "var(--text-secondary)" }}>Loading leaderboard rankings...</div>
            ) : (
              leaderboard.map((user) => (
                <div key={user.rank} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 18px",
                  background: user.rank === 1 ? "rgba(245, 158, 11, 0.12)" : "var(--bg-main)",
                  borderRadius: "12px",
                  border: "1px solid var(--border-color)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: user.rank === 1 ? "#f59e0b" : user.rank === 2 ? "#94a3b8" : user.rank === 3 ? "#b45309" : "var(--border-color)",
                      color: "#fff",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem"
                    }}>
                      #{user.rank}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                        {user.full_name || user.username}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                        {user.total_scans} scans • {user.carbon_saved_kg} kg CO2 saved
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#10b981" }}>
                    {user.total_reward_points} pts
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Redemption Success Modal */}
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
              {activeModal.message || `You successfully redeemed ${activeModal.title}!`}
            </p>

            <div style={{
              background: "var(--bg-main)",
              padding: "12px",
              borderRadius: "10px",
              border: "1px dashed #10b981",
              fontFamily: "monospace",
              fontWeight: 800,
              fontSize: "1.2rem",
              color: "#10b981",
              letterSpacing: "0.1em",
              marginBottom: "24px"
            }}>
              {activeModal.code}
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
