import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

JSON_PATH = BASE_DIR / "knowledge_base" / "waste_info.json"


class RecommendationEngine:

    def __init__(self):
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            self.data = json.load(f)

    def get_info(self, item_name: str):
        return self.data.get(
            item_name.lower(),
            {
                "category": "Unknown",
                "bin": "Unknown",
                "reward": 0,
                "carbon_saved": "0 kg",
                "description": "No information available.",
                "can_become": "Unknown"
            }
        )