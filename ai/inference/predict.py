import sys
from pathlib import Path
import cv2
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

from ultralytics import YOLO
from utils.recommend import RecommendationEngine

MODEL_PATH = BASE_DIR / "models" / "best.pt"

model = YOLO(str(MODEL_PATH))
engine = RecommendationEngine()


def predict(image_path):
    results = model(str(image_path))
    annotated_image = results[0].plot()
    output_dir = BASE_DIR / "outputs"
    output_dir.mkdir(exist_ok=True)

    output_path = output_dir / "prediction.jpg"

    cv2.imwrite(str(output_path), annotated_image)
    detections = []
    overall = {
        "total_items": 0,
        "total_reward": 0,
        "total_carbon_saved": 0.0,
        "eco_score": 0
    }
    summary = {}
    for result in results:
        for box in result.boxes:

            class_name = result.names[int(box.cls)]
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            confidence = round(float(box.conf), 2)
            if confidence < 0.5:
                continue
            info = engine.get_info(class_name)

            detections.append({
                "name": class_name,
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

            if class_name not in summary:
                summary[class_name] = {
                    "count": 0,
                    "total_reward": 0,
                    "total_carbon_saved": 0.0
                }

            summary[class_name]["count"] += 1
            summary[class_name]["total_reward"] += info["reward"]
            carbon = float(info["carbon_saved"].replace(" kg", ""))
            summary[class_name]["total_carbon_saved"] += carbon
            overall["total_items"] += 1
            overall["total_reward"] += info["reward"]
            overall["total_carbon_saved"] += carbon
            overall["eco_score"] += info.get("eco_score", 50)
            if overall["total_items"] > 0:
                overall["eco_score"] = round(overall["eco_score"] / overall["total_items"])
    return {
        "overall": overall,
        "summary": summary,
        "detections": detections,
        "annotated_image": "/outputs/prediction.jpg"
    }