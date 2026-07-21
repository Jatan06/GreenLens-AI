import json
import shutil
import sys
from pathlib import Path

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

from inference.predict import predict
from location.service import find_nearest_centers

KNOWLEDGE_BASE_PATH = BASE_DIR / "knowledge_base" / "waste_info.json"

app = FastAPI(
    title="GreenLens AI",
    description="AI-Powered Waste Segregation & Circular Economy Assistant",
    version="2.0",
)

# ── CORS — allow frontend on any port during development ──────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static files for annotated output images ──────────────────────────────────
outputs_dir = BASE_DIR / "outputs"
outputs_dir.mkdir(exist_ok=True)
app.mount("/outputs", StaticFiles(directory=str(outputs_dir)), name="outputs")


# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def load_knowledge_base() -> dict:
    with open(KNOWLEDGE_BASE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


# ─────────────────────────────────────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/", tags=["General"])
def home():
    return {"message": "GreenLens AI API is running", "version": "2.0"}


@app.get("/health", tags=["General"])
def health():
    return {
        "status": "healthy",
        "model": "waste_detector_v1",
        "version": "2.0",
    }


@app.get("/categories", tags=["Knowledge Base"])
def get_categories():
    """Return all supported waste categories and their bin colors."""
    return {
        "categories": [
            {"name": "Recyclable",   "bin": "Blue",  "color": "#3b82f6", "icon": "♻️"},
            {"name": "Compostable",  "bin": "Green", "color": "#22c55e", "icon": "🌱"},
            {"name": "Hazardous",    "bin": "Red",   "color": "#ef4444", "icon": "⚠️"},
            {"name": "E-Waste",      "bin": "Black", "color": "#374151", "icon": "💻"},
            {"name": "General",      "bin": "Grey",  "color": "#6b7280", "icon": "🗑️"},
        ]
    }


@app.get("/waste-types", tags=["Knowledge Base"])
def get_waste_types():
    """Return all waste types supported by the knowledge base."""
    kb = load_knowledge_base()
    return {
        "total": len(kb),
        "items": list(kb.keys()),
    }


@app.get("/waste-info/{item}", tags=["Knowledge Base"])
def get_waste_info(item: str):
    """Return full info for a specific waste item."""
    kb = load_knowledge_base()
    item_lower = item.lower().replace("-", " ")
    info = kb.get(item_lower)
    if not info:
        raise HTTPException(status_code=404, detail=f"Waste item '{item}' not found in knowledge base.")
    return {"item": item_lower, **info}


@app.post("/predict", tags=["AI"])
async def detect(
    file: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
):
    """
    Upload a waste image and get AI-powered classification results
    along with nearest recycling centers.
    """
    # Validate file type
    if file.content_type not in ("image/jpeg", "image/png", "image/webp", "image/jpg"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Only JPEG, PNG, and WebP are supported.",
        )

    upload_dir = BASE_DIR / "uploads"
    upload_dir.mkdir(exist_ok=True)

    # Use a safe filename
    safe_name = Path(file.filename).name
    image_path = upload_dir / safe_name

    try:
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded image: {str(e)}")

    # Run AI inference
    try:
        result = predict(image_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI inference failed: {str(e)}")

    # Fetch nearby recycling centers
    try:
        centers = find_nearest_centers(latitude, longitude)
    except Exception:
        centers = []   # Don't fail the whole request if location lookup fails

    return JSONResponse(content={
        "success": True,
        **result,
        "recycling_centers": centers,
    })