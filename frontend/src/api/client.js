const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Predict waste from an image file with GPS coordinates.
 * @param {File} imageFile
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<object>}
 */
export async function predictWaste(imageFile, latitude, longitude) {
  const form = new FormData();
  form.append("file", imageFile);
  form.append("latitude", latitude);
  form.append("longitude", longitude);

  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    body: form,
  });

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
 * @param {string} item
 */
export async function getWasteInfo(item) {
  const res = await fetch(`${API_BASE}/waste-info/${encodeURIComponent(item)}`);
  if (!res.ok) throw new Error("Item not found");
  return res.json();
}

export { API_BASE };
