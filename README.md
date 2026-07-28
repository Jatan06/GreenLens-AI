<div align="center">

# 🌿 GreenLens AI

### AI-Powered Waste Segregation & Circular Economy Assistant

*Maverick Effect AI Challenge 2026 — Problem Statement #8*

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-FF6B00?style=flat-square)](https://ultralytics.com)

**Scan any waste item with your phone camera → AI identifies and classifies it → Find nearest recycling centers → Earn eco reward points**

</div>

---

## 📌 What is GreenLens AI?

GreenLens AI is a mobile-first web application that uses computer vision (YOLOv8) to help citizens identify and properly dispose of waste. Users point their phone camera at any waste item, and the AI instantly:

- **Identifies** what the item is (plastic bottle, battery, phone, etc.)
- **Classifies** it into one of 4 waste categories
- **Tells you** which bin to use and how to dispose of it
- **Shows** the nearest recycling or drop-off centers on a map
- **Rewards** you with Green Points for every scan

> **Why this matters:** Waste segregation remains a major challenge across Indian cities. Proper segregation at source is the first step toward a circular economy.

---

## 🎯 Problem Statement (Maverick Effect AI Challenge 2026)

**Problem #8 — AI-Powered Waste Segregation & Circular Economy Assistant**

| Requirement | Status |
|---|---|
| Identify waste using a mobile camera | ✅ YOLOv8 custom model |
| Classify into Recyclable / Compostable / Hazardous / E-Waste | ✅ 35+ item knowledge base |
| Suggest nearest collection/recycling points | ✅ Geoapify API integration |
| Generate incentives/reward mechanisms for citizens | ✅ Green Points + Milestone badges |
| *(Bonus)* Predict waste generation patterns | 🔜 Planned |
| *(Bonus)* Help municipalities optimize collection routes | 🔜 Planned |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                 FRONTEND  (React + Vite)                  │
│                  http://localhost:5173                     │
│                                                           │
│  [📷 Scan]  ──→  [🔍 Results]  ──→  [🗺️ Map]  ──→  [🏆 Rewards] │
└──────────────────────┬───────────────────────────────────┘
                       │  REST API  (multipart/form-data)
                       ▼
┌──────────────────────────────────────────────────────────┐
│                  AI ENGINE  (FastAPI)                     │
│                  http://localhost:8000                     │
│                                                           │
│  POST /predict                                            │
│    ├─ 1. Save uploaded image                              │
│    ├─ 2. Run YOLOv8 inference  →  bounding boxes         │
│    ├─ 3. Lookup each item in knowledge base               │
│    ├─ 4. Apply decision rules  (RECYCLE / COMPOST / ...)  │
│    ├─ 5. Calculate rewards & carbon savings               │
│    └─ 6. Find nearest recycling centers (Geoapify API)    │
└──────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
GreenLens-AI/
│
├── ai/                              ← AI Engine (Python / FastAPI)
│   ├── api/
│   │   └── main.py                  ← FastAPI server entry point
│   ├── inference/
│   │   └── predict.py               ← YOLOv8 inference + result builder
│   ├── decision/
│   │   ├── engine.py                ← Rule evaluation logic
│   │   └── rules.py                 ← Disposal rules for all 35 waste items
│   ├── location/
│   │   └── service.py               ← Geoapify API — nearest recycling centers
│   ├── knowledge_base/
│   │   └── waste_info.json          ← 35-item waste database (all 4 categories)
│   ├── models/
│   │   └── best.pt                  ← Custom-trained YOLOv8 waste detection model
│   ├── utils/
│   │   └── recommend.py             ← Knowledge base lookup helper
│   ├── outputs/                     ← Annotated prediction images (served statically)
│   ├── uploads/                     ← Temp storage for user-uploaded images
│   └── requirements.txt
│
├── frontend/                        ← Web App (React + Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js            ← All API calls in one place
│   │   ├── components/
│   │   │   └── BottomNav.jsx        ← Bottom navigation bar
│   │   ├── pages/
│   │   │   ├── Scan.jsx             ← Camera capture / file upload page
│   │   │   ├── Results.jsx          ← Detection results + reward toast
│   │   │   ├── MapPage.jsx          ← Interactive recycling center map
│   │   │   └── Rewards.jsx          ← Points dashboard + milestone ladder
│   │   ├── App.jsx                  ← Router + layout
│   │   ├── main.jsx                 ← React entry point
│   │   └── index.css                ← Full design system (dark glassmorphism)
│   ├── public/
│   │   └── favicon.svg
│   ├── .env                         ← VITE_API_URL=http://localhost:8000
│   └── package.json
│
├── backend/                         ← Persistent backend (SQLite) — Phase 2
├── docs/                            ← Documentation
└── README.md
```

---

## ⚡ Full Feature Flow

### 1. 📷 Scan Waste
- User opens the app on mobile/desktop
- Taps the camera zone → browser requests camera permission
- Live camera viewfinder opens with a scan frame overlay
- User points at a waste item and taps **Capture**
- Alternative: tap **Upload from gallery** to pick an existing photo

### 2. 🤖 AI Analysis (`POST /predict`)
The image is sent to the FastAPI backend with the user's GPS coordinates. The server:

1. **Saves** the image temporarily
2. **Runs YOLOv8** — detects all waste items with bounding boxes and confidence scores
3. **Filters** detections below 50% confidence
4. **Looks up** each detected item in `waste_info.json` to get:
   - Category (Recyclable / Compostable / Hazardous / E-Waste)
   - Bin color (Blue / Green / Red / Black)
   - Reward points
   - Carbon saved (kg CO₂)
   - Eco score (0–100)
   - Tips, decomposition time, what it can become
5. **Applies decision rules** — tells user the correct action (RECYCLE, COMPOST, STORE, SELL, E-WASTE DROP-OFF)
6. **Queries Geoapify API** — finds nearest 5 recycling/collection centers within 10km
7. **Returns** full JSON response + annotated image path

### 3. 🔍 Results Page
- Annotated image shown (with colored bounding boxes)
- **Stats strip**: Total items detected / Points earned / CO₂ saved
- **Reward toast**: "+X Green Points Earned!"
- **Detection cards** for each item:
  - Eco Score ring (animated SVG circle)
  - Category badge (color-coded)
  - Bin color dot
  - Confidence percentage
  - Description, tips, "can become" tags
- **Nearby drop-offs** section (top 3 centers with distance)

### 4. 🗺️ Map Page
- Dark-themed interactive map (CartoDB dark tiles)
- **Green pin** = your current GPS location
- **Blue pins** = recycling centers from the last scan
- Click any pin → popup with name, address, distance, Google Maps link
- Scrollable list of all centers below the map

### 5. 🏆 Rewards Dashboard
- **Milestone badge** with animated progress bar:
  - 🌱 Eco Novice (0 pts)
  - 🍃 Green Explorer (100 pts)
  - ⚡ Eco Warrior (300 pts)
  - 🏆 Green Champion (600 pts)
  - 🌍 Planet Guardian (1000 pts)
- **Environmental impact stats**:
  - Trees-worth of CO₂ absorbed
  - Car travel km equivalent saved
  - LED bulb hours saved
  - Items properly handled
- Points are persisted in browser `localStorage`

---

## 🗃️ Waste Categories & Bin Colors

| Category | Bin Color | Icon | Examples |
|---|---|---|---|
| **Recyclable** | 🔵 Blue | ♻️ | Plastic bottles, glass, cans, cardboard, paper |
| **Compostable** | 🟢 Green | 🌱 | Food waste, banana peel, coffee grounds, leaves |
| **Hazardous** | 🔴 Red | ⚠️ | Batteries, CFL bulbs, paint, medicine, syringes |
| **E-Waste** | ⚫ Black | 💻 | Phones, laptops, keyboards, chargers, monitors |

---

## 🧠 Decision Actions

| Action | Meaning | Example |
|---|---|---|
| `RECYCLE` | Put in recycling bin / drop-off | Cardboard, paper, steel can |
| `REUSE` | Reuse if small quantity, recycle if large | Plastic bottles (< 5 = reuse) |
| `COMPOST` | Add to compost / green bin | All organic waste |
| `STORE` | Collect at home, take to hazardous drop-off | Batteries, medicine, paint |
| `SELL` | Sell or donate if working | Mobile phones, laptops |
| `E-WASTE DROP-OFF` | Take to authorized e-waste center | Keyboards, chargers, monitors |

---

## 🚀 Setup & Running

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm 9+

### 1. Clone the repository
```bash
git clone https://github.com/your-repo/GreenLens-AI.git
cd GreenLens-AI
```

### 2. Start the AI Backend
```bash
cd ai

# Create virtual environment (first time only)
python -m venv venv

# Activate it
.\venv\Scripts\activate        # Windows
source venv/bin/activate       # macOS/Linux

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the server
uvicorn api.main:app --reload --port 8000
```

> ✅ API available at: `http://localhost:8000`  
> ✅ Interactive docs at: `http://localhost:8000/docs`

### 3. Start the Frontend
```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

> ✅ App available at: `http://localhost:5173`

---

## 🔌 API Reference

### `GET /health`
Check if the server and model are loaded.

```json
{ "status": "healthy", "model": "waste_detector_v1", "version": "2.0" }
```

### `GET /categories`
Returns all supported waste categories with bin colors and icons.

### `GET /waste-types`
Returns the full list of 35 waste items in the knowledge base.

### `GET /waste-info/{item}`
Returns detailed info for a specific waste item.

```
GET /waste-info/plastic bottle
```

```json
{
  "item": "plastic bottle",
  "category": "Recyclable",
  "bin": "Blue",
  "reward": 10,
  "carbon_saved": "0.18 kg",
  "eco_score": 90,
  "tips": ["Rinse before recycling", "Remove the cap if possible"],
  "can_become": ["Polyester Fiber", "New Plastic Bottles", "T-Shirts"]
}
```

### `POST /predict`
Main AI prediction endpoint.

**Request:** `multipart/form-data`
| Field | Type | Description |
|---|---|---|
| `file` | image | JPEG, PNG, or WebP photo |
| `latitude` | float | User's GPS latitude |
| `longitude` | float | User's GPS longitude |

**Response:**
```json
{
  "success": true,
  "overall": {
    "total_items": 2,
    "total_reward": 18,
    "total_carbon_saved": 0.43,
    "eco_score": 88
  },
  "detections": [
    {
      "name": "plastic bottle",
      "confidence": 0.92,
      "category": "Recyclable",
      "bin": "Blue",
      "reward": 10,
      "eco_score": 90,
      "carbon_saved": "0.18 kg",
      "bounding_box": { "x1": 10, "y1": 20, "x2": 100, "y2": 200 },
      "tips": ["Rinse before recycling"],
      "can_become": ["Polyester Fiber", "T-Shirts"]
    }
  ],
  "summary": { "plastic bottle": { "count": 1, "total_reward": 10 } },
  "annotated_image": "/outputs/prediction.jpg",
  "recycling_centers": [
    {
      "name": "Green Recycling Centre",
      "address": "123 MG Road, Delhi",
      "distance_m": 850,
      "latitude": 28.62,
      "longitude": 77.21,
      "maps_url": "https://www.google.com/maps?q=28.62,77.21"
    }
  ]
}
```

---

## 🔑 API Keys & Configuration

| Service | Key Location | Purpose |
|---|---|---|
| **Geoapify** | `ai/location/service.py` | Nearest recycling centers lookup |
| **Frontend API URL** | `frontend/.env` → `VITE_API_URL` | Points frontend to AI backend |

---

## 🛠️ Tech Stack

### AI / Backend
| Technology | Purpose |
|---|---|
| **YOLOv8** (Ultralytics) | Real-time waste object detection |
| **FastAPI** | High-performance REST API |
| **OpenCV** | Image processing & annotation |
| **Geoapify Places API** | Nearest recycling centers |
| **Python 3.10+** | Core language |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router** | Client-side routing |
| **Leaflet + react-leaflet** | Interactive maps |
| **Vanilla CSS** | Custom design system (glassmorphism) |
| **Browser `getUserMedia` API** | Mobile camera access |

---

## 🧪 Testing the App

### Quick test via Swagger UI
1. Go to `http://localhost:8000/docs`
2. Click **POST /predict → Try it out**
3. Upload a waste image (plastic bottle, phone, etc.)
4. Set `latitude: 28.6139`, `longitude: 77.2090` (New Delhi)
5. Click **Execute** — you'll see full JSON response

### Frontend flow
1. Open `http://localhost:5173`
2. Tap camera zone or upload a photo
3. Click **Analyze Waste**
4. View results → switch to Map tab → check Rewards tab

### Test with Indian coordinates
| City | Latitude | Longitude |
|---|---|---|
| New Delhi | 28.6139 | 77.2090 |
| Mumbai | 19.0760 | 72.8777 |
| Bangalore | 12.9716 | 77.5946 |
| Chennai | 13.0827 | 80.2707 |
| Kolkata | 22.5726 | 88.3639 |

---

## 🗺️ Roadmap

- [x] YOLOv8 custom waste detection model
- [x] FastAPI REST backend with CORS
- [x] 35-item knowledge base (all 4 categories)
- [x] Decision engine (RECYCLE / COMPOST / STORE / SELL / E-WASTE)
- [x] Geoapify nearest recycling center integration
- [x] React frontend (Scan → Results → Map → Rewards)
- [x] Dark glassmorphism design system
- [x] Eco Score ring animation
- [x] Green Points + Milestone badge system
- [ ] SQLite backend for persistent user data & leaderboard
- [ ] Waste generation pattern analytics (charts)
- [ ] Municipal route optimization
- [ ] PWA manifest (installable on phone)
- [ ] Multi-language support (Hindi, Tamil, etc.)

---

## 👥 Team

Built for **Maverick Effect AI Challenge 2026**  
Problem #8 — Sustainability & Civic Impact

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.