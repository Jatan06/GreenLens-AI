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

# Comprehensive mapping of standard COCO classes to GreenLens waste taxonomy
COCO_WASTE_MAP = {
    # Plastics & Bottles
    "bottle": "plastic bottle",
    "cup": "plastic bottle",
    "wine glass": "glass bottle",
    
    # E-Waste
    "cell phone": "mobile phone",
    "laptop": "laptop",
    "keyboard": "keyboard",
    "mouse": "e_waste",
    "remote": "e_waste",
    "tv": "monitor",
    
    # Organic / Food Waste
    "banana": "banana peel",
    "apple": "fruit peels",
    "orange": "fruit peels",
    "broccoli": "food waste",
    "carrot": "food waste",
    "sandwich": "food waste",
    "donut": "food waste",
    "cake": "food waste",
    
    # Paper & Cardboard
    "book": "paper",
    "paper": "paper",
    
    # Cans / Metal / Containers
    "can": "can",
    "bowl": "plastic bottle"
}

# Attempt YOLO model load quietly without raising OS DLL errors
try:
    os.environ["YOLO_VERBOSE"] = "False"
    # pyrefly: ignore [missing-import]
    from ultralytics import YOLO
    
    # Priority 1: Check for custom fine-tuned waste weights
    CUSTOM_MODEL_PATH = BASE_DIR / "models" / "best.pt"
    # Priority 2: Standard YOLO pre-trained model
    PRETRAINED_MODEL_PATH = BASE_DIR / "yolov8n.pt"
    INFERENCE_MODEL_PATH = BASE_DIR / "inference" / "yolov8n.pt"
    
    if CUSTOM_MODEL_PATH.exists():
        model = YOLO(str(CUSTOM_MODEL_PATH))
    elif PRETRAINED_MODEL_PATH.exists():
        model = YOLO(str(PRETRAINED_MODEL_PATH))
    elif INFERENCE_MODEL_PATH.exists():
        model = YOLO(str(INFERENCE_MODEL_PATH))
    else:
        # Auto-download base yolov8n if no local weights exist
        model = YOLO("yolov8n.pt")
except Exception:
    model = None


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
    output_path = output_dir / "prediction.jpg"

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

    if model is not None:
        try:
            results = model(str(image_path), conf=0.25)
            annotated = img.copy() if img is not None else np.zeros((h, w, 3), dtype=np.uint8)

            for result in results:
                for box in result.boxes:
                    raw_class_name = result.names[int(box.cls)].lower()
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    confidence = round(float(box.conf), 2)
                    
                    # Map COCO raw name to waste class if available
                    waste_class = COCO_WASTE_MAP.get(raw_class_name, raw_class_name)
                    info = engine.get_info(waste_class)

                    # Only keep detections that match known waste items or recognized categories
                    if info["category"] == "Unknown" and waste_class not in engine.data:
                        continue

                    color = get_bin_color_bgr(info.get("bin", "Blue"))

                    # Draw colored bounding box and custom label on image
                    cv2.rectangle(annotated, (int(x1), int(y1)), (int(x2), int(y2)), color, 3)
                    label = f"{waste_class.title()} ({int(confidence * 100)}%)"
                    (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                    cv2.rectangle(annotated, (int(x1), int(y1) - th - 10), (int(x1) + tw + 10, int(y1)), color, -1)
                    cv2.putText(annotated, label, (int(x1) + 5, int(y1) - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

                    detections.append({
                        "name": waste_class,
                        "confidence": confidence,
                        "bounding_box": {
                            "x1": round(x1, 2),
                            "y1": round(y1, 2),
                            "x2": round(x2, 2),
                            "y2": round(y2, 2)
                        },
                        "category": info["category"],
                        "subcategory": info.get("subcategory", ""),
                        "material": info.get("material", ""),
                        "bin": info["bin"],
                        "reward": info["reward"],
                        "eco_score": info.get("eco_score", 50),
                        "carbon_saved": info["carbon_saved"],
                        "description": info["description"],
                        "can_become": info.get("can_become", []),
                        "tips": info.get("tips", []),
                        "decomposition_time": info.get("decomposition_time", "")
                    })

            cv2.imwrite(str(output_path), annotated)
        except Exception as e:
            print(f"Prediction error: {e}")

    # Write fallback original/clean image to output_path if no detection visual was generated
    if not output_path.exists() and img is not None:
        cv2.imwrite(str(output_path), img)

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
        "annotated_image": "/outputs/prediction.jpg"
    }