// GreenLens AI Core Backend API Client
// Connects Smart Waste Frontend with FastAPI Backend (http://localhost:8000)

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_BASE_URL = API_BASE;

// Token storage helpers - synchronized for both keys used in the codebase
export const getToken = () =>
  localStorage.getItem("greenlens_token") || localStorage.getItem("glToken");
export const setToken = (token) => {
  localStorage.setItem("greenlens_token", token);
  localStorage.setItem("glToken", token);
};
export const removeToken = () => {
  localStorage.removeItem("greenlens_token");
  localStorage.removeItem("glToken");
};

// Auth Headers Helper
const getHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Generic fetch wrapper with error handling
async function request(endpoint, options = {}) {
  const isMultipart = options.body instanceof FormData;
  const headers = {
    ...getHeaders(isMultipart),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        if (typeof errorData.detail === "string") {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail
            .map((e) => e.msg || e.detail)
            .join(", ");
        }
      }
    } catch {
      // Ignore JSON parse error
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// 🔑 AUTHENTICATION APIs

// Polymorphic: handles object parameter (userData) or individual arguments
export async function registerUser(
  emailOrUserData,
  username,
  password,
  fullName = "",
) {
  let bodyData;
  if (typeof emailOrUserData === "object" && emailOrUserData !== null) {
    bodyData = {
      email: emailOrUserData.email,
      username: emailOrUserData.username,
      password: emailOrUserData.password,
      full_name: emailOrUserData.full_name || emailOrUserData.fullName || "",
    };
  } else {
    bodyData = {
      email: emailOrUserData,
      username,
      password,
      full_name: fullName,
    };
  }
  const data = await request("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(bodyData),
  });
  if (data.access_token) {
    setToken(data.access_token);
  }
  return data;
}

// Polymorphic: handles object parameter (credentials) or individual arguments
export async function loginUser(emailOrCredentials, password) {
  let bodyData;
  if (typeof emailOrCredentials === "object" && emailOrCredentials !== null) {
    bodyData = {
      email: emailOrCredentials.email,
      password: emailOrCredentials.password,
    };
  } else {
    bodyData = {
      email: emailOrCredentials,
      password,
    };
  }
  const data = await request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(bodyData),
  });
  if (data.access_token) {
    setToken(data.access_token);
  }
  return data;
}

export async function getCurrentUser() {
  if (!getToken()) return null;
  try {
    return await request("/api/v1/auth/me");
  } catch (err) {
    removeToken();
    return null;
  }
}

export async function getCurrentUserProfile() {
  return request("/api/v1/auth/me");
}

// 👤 USER MANAGEMENT & LEADERBOARD APIs
export async function getUserProfile() {
  return request("/api/v1/users/profile");
}

export async function updateUserProfile(profileData) {
  return request("/api/v1/users/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}

export async function getUserImpactStats() {
  return request("/api/v1/users/stats");
}

export async function getGlobalLeaderboard(limit = 10) {
  return request(`/api/v1/users/leaderboard?limit=${limit}`);
}

// 📷 AI WASTE SCAN & HISTORY APIs
export async function analyzeWasteScan(
  file,
  latitude = 37.7749,
  longitude = -122.4194,
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("latitude", latitude.toString());
  formData.append("longitude", longitude.toString());

  return request("/api/v1/scans/analyze", {
    method: "POST",
    body: formData,
  });
}

// Falls back to old predict route if analyze fails, to preserve local robustness
export async function predictWaste(imageFile, latitude, longitude) {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);

  try {
    return await request("/api/v1/scans/analyze", {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    // Fallback to predict
    return await request("/predict", {
      method: "POST",
      body: formData,
    });
  }
}

export async function getScanHistory(skip = 0, limit = 20) {
  return request(`/api/v1/scans/history?skip=${skip}&limit=${limit}`);
}

export async function getUserScanHistory() {
  return request("/api/v1/scans/history");
}

export async function getScanById(scanId) {
  return request(`/api/v1/scans/${scanId}`);
}

// 🎁 REWARDS & REDEMPTION APIs
export async function getRewardCatalog() {
  return request("/api/v1/rewards");
}

export async function redeemReward(rewardId) {
  return request("/api/v1/rewards/redeem", {
    method: "POST",
    body: JSON.stringify({ reward_id: rewardId }),
  });
}

export async function getUserRedeemedRewards() {
  return request("/api/v1/rewards/my-rewards");
}

// 📍 RECYCLING CENTERS APIs
export async function getNearbyRecyclingCenters(
  latitude,
  longitude,
  category = null,
  limit = 10,
) {
  let url = `/api/v1/recycling-centers/nearby?latitude=${latitude}&longitude=${longitude}&limit=${limit}`;
  if (category) {
    url += `&category=${encodeURIComponent(category)}`;
  }
  return request(url);
}

export async function getAllRecyclingCenters() {
  return request("/api/v1/recycling-centers");
}

export async function createRecyclingCenter(centerData) {
  return request("/api/v1/recycling-centers", {
    method: "POST",
    body: JSON.stringify(centerData),
  });
}

// 🏛️ MUNICIPALITY & ANALYTICS APIs
export async function getMunicipalityDashboard() {
  return request("/api/v1/municipality/dashboard");
}

export async function getMunicipalityAnalytics(period = "7d") {
  return request(`/api/v1/municipality/analytics?period=${period}`);
}

export async function getGeospatialHeatmap(zoneId = null) {
  let url = "/api/v1/municipality/heatmap";
  if (zoneId) url += `?zone_id=${encodeURIComponent(zoneId)}`;
  return request(url);
}

export async function getWasteForecast(days = 7, zoneId = null) {
  let url = `/api/v1/municipality/forecast?days=${days}`;
  if (zoneId) url += `&zone_id=${encodeURIComponent(zoneId)}`;
  return request(url);
}

export async function getActiveFleetRoutes() {
  return request("/api/v1/municipality/routes");
}

export async function optimizeFleetRoute(truckId, waypoints = null) {
  return request("/api/v1/municipality/routes/optimize", {
    method: "POST",
    body: JSON.stringify({ truck_id: truckId, waypoints }),
  });
}

export async function getFleetStatus() {
  return request("/api/v1/municipality/admin/fleet");
}

export async function getActiveAlerts() {
  return request("/api/v1/municipality/admin/alerts");
}

export async function createMunicipalAlert(title, zoneId, severity, message) {
  return request("/api/v1/municipality/admin/alerts", {
    method: "POST",
    body: JSON.stringify({ title, zone_id: zoneId, severity, message }),
  });
}

export function getExportCsvUrl() {
  return `${API_BASE_URL}/api/v1/municipality/reports/export`;
}

export function getFullMediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function getWasteInfo(item) {
  try {
    return await request(`/waste-info/${encodeURIComponent(item)}`);
  } catch (err) {
    const res = await fetch(
      `${API_BASE_URL}/waste-info/${encodeURIComponent(item)}`,
    );
    if (!res.ok) throw new Error("Item not found");
    return res.json();
  }
}

export async function askWasteAssistant(question) {
  return request("/api/v1/assistant/ask", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

