import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    full_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || "/profile";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await signup({
          email: formData.email,
          password: formData.password,
          username: formData.username || formData.email.split("@")[0],
          full_name: formData.full_name || formData.username,
        });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page page-enter" style={{ paddingBottom: "7rem" }}>
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "2rem", marginTop: "1rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🌱</div>
        <h2 style={{ fontWeight: 800, fontSize: "1.5rem" }}>
          {isLogin ? "Welcome Back" : "Join GreenLens AI"}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
          {isLogin ? "Sign in to track your recycling history & rewards" : "Create an eco-account to start earning reward points"}
        </p>
      </header>

      {/* Auth Card */}
      <div className="card glass-card" style={{ padding: "1.75rem" }}>
        {/* Mode Switcher */}
        <div
          style={{
            display: "flex",
            background: "var(--surface-2)",
            borderRadius: "var(--radius-md)",
            padding: "4px",
            marginBottom: "1.5rem",
          }}
        >
          <button
            type="button"
            style={{
              flex: 1,
              padding: "0.6rem",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
              fontSize: "0.85rem",
              background: isLogin ? "var(--green-primary)" : "transparent",
              color: isLogin ? "#000" : "var(--text-muted)",
              transition: "all var(--transition)",
            }}
            onClick={() => { setIsLogin(true); setError(null); }}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: "0.6rem",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
              fontSize: "0.85rem",
              background: !isLogin ? "var(--green-primary)" : "transparent",
              color: !isLogin ? "#000" : "var(--text-muted)",
              transition: "all var(--transition)",
            }}
            onClick={() => { setIsLogin(false); setError(null); }}
          >
            Register
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#fca5a5",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.82rem",
              marginBottom: "1.25rem",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          {!isLogin && (
            <>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Green"
                  className="auth-input"
                  required={!isLogin}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. alex_green"
                  className="auth-input"
                  required={!isLogin}
                />
              </div>
            </>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.4rem" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@example.com"
              className="auth-input"
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.4rem" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="auth-input"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account & Get 50 Pts"}
          </button>
        </form>
      </div>
    </main>
  );
}
