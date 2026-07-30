import sys
from pathlib import Path
from typing import Dict, Any

from app.config import settings

# Import inference predict pipeline from ai folder
AI_DIR = settings.UPLOAD_DIR.parent
sys.path.append(str(AI_DIR))

try:
    from inference.predict import predict as run_prediction
except ImportError:
    run_prediction = None


def process_image_scan(image_path: Path) -> Dict[str, Any]:
    """
    Run AI inference on an uploaded waste image.
    A scan must be produced by the model; fabricated detections are never returned.
    """
    if run_prediction is None:
        raise RuntimeError("The ML inference module could not be loaded.")
    return run_prediction(image_path)
