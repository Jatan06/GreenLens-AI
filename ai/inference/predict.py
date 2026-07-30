import sys
import os
from pathlib import Path
# pyrefly: ignore [missing-import]
import cv2
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

from utils.recommend import RecommendationEngine

engine = RecommendationEngine()

model = None
model_error = None
MODEL_PATH = BASE_DIR / "models" / "best.pt"
PRETRAINED_MODEL_PATH = BASE_DIR / "yolov8n.pt"

# COCO labels emitted by the standard YOLOv8 model that can be mapped to the
# project's waste knowledge base. A custom ai/models/best.pt takes precedence.
COCO_WASTE_MAP = {
    "bottle": "plastic bottle", "wine glass": "glass bottle", "cup": "plastic cup",
    "banana": "banana peel", "apple": "food waste", "orange": "food waste",
    "cell phone": "mobile phone", "laptop": "laptop", "keyboard": "keyboard",
    "mouse": "computer mouse", "remote": "electronic device", "tv": "monitor",
    "book": "paper", "backpack": "textile", "scissors": "metal",
}


def get_model():
    """Load the supplied waste model, or a real pretrained YOLOv8 model once."""
    global model, model_error
    if model is not None:
        return model
    if model_error is not None:
        raise RuntimeError(model_error)
    try:
        os.environ["YOLO_VERBOSE"] = "False"
        from ultralytics import YOLO
        # Ultralytics downloads this official pretrained model on first use if
        # it is not cached. Put a custom best.pt in ai/models for waste labels.
        if MODEL_PATH.exists():
            model = YOLO(str(MODEL_PATH))
        elif PRETRAINED_MODEL_PATH.exists():
            model = YOLO(str(PRETRAINED_MODEL_PATH))
        else:
            model = YOLO("yolov8n.pt")
        return model
    except Exception as exc:
        model_error = f"Unable to load YOLO model: {exc}"
        raise RuntimeError(model_error) from exc


def get_bin_color_bgr(bin_name: str):
    bin_lower = bin_name.lower()
    if "blue" in bin_lower:
        return (235, 140, 30)   # Blue
    elif "green" in bin_lower:
        return (50, 180, 50)   # Green
    elif "red" in bin_lower:
        return (40, 40, 220)   # Red
    elif "black" in bin_lower:
        return (60, 60, 60)    # Dark / Black
    return (200, 200, 0)


def predict(image_path):
    global model
    output_dir = BASE_DIR / "outputs"
    output_dir.mkdir(exist_ok=True)
    output_path = output_dir / f"{Path(image_path).stem}_prediction.jpg"

    detections = []
    overall = {
        "total_items": 0,
        "total_reward": 0,
        "total_carbon_saved": 0.0,
        "eco_score": 0
    }
    summary = {}

    img = cv2.imread(str(image_path))
    h, w = (400, 600) if img is None else img.shape[:2]

    if img is None:
        raise ValueError("The uploaded image could not be read.")

    active_model = get_model()
    results = active_model(str(image_path), verbose=False)
    annotated_image = results[0].plot()
    cv2.imwrite(str(output_path), annotated_image)
    for result in results:
        for box in result.boxes:
            raw_name = result.names[int(box.cls)]
            class_name = COCO_WASTE_MAP.get(raw_name.lower(), raw_name.lower())
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            confidence = round(float(box.conf), 2)
            if confidence < 0.5:
                continue
            info = engine.get_info(class_name)
            detections.append({
                "name": class_name,
                "confidence": confidence,
                "bounding_box": {"x1": round(x1, 2), "y1": round(y1, 2), "x2": round(x2, 2), "y2": round(y2, 2)},
                "category": info["category"], "subcategory": info.get("subcategory", ""),
                "material": info.get("material", ""), "bin": info["bin"],
                "reward": info["reward"], "eco_score": info.get("eco_score", 50),
                "carbon_saved": info["carbon_saved"], "description": info["description"],
                "can_become": info.get("can_become", []), "tips": info.get("tips", []),
                "decomposition_time": info.get("decomposition_time", "")
            })

    for det in detections:
        class_name = det["name"]
        reward = det["reward"]
        carbon_str = det.get("carbon_saved", "0.0 kg")
        try:
            carbon = float(carbon_str.replace(" kg", "").strip())
        except ValueError:
            carbon = 0.0
        eco_score = det["eco_score"]
        
        if class_name not in summary:
            summary[class_name] = {
                "count": 0,
                "total_reward": 0,
                "total_carbon_saved": 0.0
            }
        summary[class_name]["count"] += 1
        summary[class_name]["total_reward"] += reward
        summary[class_name]["total_carbon_saved"] = round(summary[class_name]["total_carbon_saved"] + carbon, 3)
        overall["total_items"] += 1
        overall["total_reward"] += reward
        overall["total_carbon_saved"] = round(overall["total_carbon_saved"] + carbon, 3)
        overall["eco_score"] += eco_score

    if overall["total_items"] > 0:
        overall["eco_score"] = round(overall["eco_score"] / overall["total_items"])
        
    return {
        "overall": overall,
        "summary": summary,
        "detections": detections,
        "annotated_image": f"/outputs/{output_path.name}"
    }
