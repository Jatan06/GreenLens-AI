const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("glToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Register a new user.
 */
export async function registerUser(userData) {
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Registration failed");
  }
  return res.json();
}

/**
 * Login user with email & password.
 */
export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Invalid email or password");
  }
  return res.json();
}

/**
 * Fetch authenticated user profile.
 */
export async function getCurrentUserProfile() {
  const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch profile");
  }
  return res.json();
}

/**
 * Fetch user scan history.
 */
export async function getUserScanHistory() {
  const res = await fetch(`${API_BASE}/api/v1/scans/history`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch scan history");
  }
  return res.json();
}

/**
 * Predict waste from an image file with GPS coordinates.
 */
export async function predictWaste(imageFile, latitude, longitude) {
  const form = new FormData();
  form.append("file", imageFile);
  form.append("latitude", latitude);
  form.append("longitude", longitude);

  let url = `${API_BASE}/api/v1/scans/analyze`;
  let headers = { ...getAuthHeaders() };

  let res = await fetch(url, {
    method: "POST",
    headers,
    body: form,
  });

  if (!res.ok) {
    res = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      body: form,
    });
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Prediction request failed");
  }
  return res.json();
}

/**
 * Fetch all supported waste categories.
 */
export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  return res.json();
}

/**
 * Fetch info for a specific waste item.
 */
export async function getWasteInfo(item) {
  const res = await fetch(`${API_BASE}/waste-info/${encodeURIComponent(item)}`);
  if (!res.ok) throw new Error("Item not found");
  return res.json();
}

export { API_BASE };

