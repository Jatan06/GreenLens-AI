import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUserProfile, loginUser, registerUser } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("glToken") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getCurrentUserProfile()
        .then((profile) => setUser(profile))
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem("glToken", data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (userData) => {
    const data = await registerUser(userData);
    localStorage.setItem("glToken", data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("glToken");
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const profile = await getCurrentUserProfile();
      setUser(profile);
    } catch {
      /* ignore */
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
