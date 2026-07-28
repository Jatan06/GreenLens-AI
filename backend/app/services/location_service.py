import math
import sys
from typing import List, Dict, Any
from app.config import settings

AI_DIR = settings.UPLOAD_DIR.parent
sys.path.append(str(AI_DIR))

try:
    from location.service import find_nearest_centers as find_nearest_ai
except ImportError:
    find_nearest_ai = None


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points in kilometers."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


def get_nearby_recycling_centers(lat: float, lon: float, max_items: int = 5) -> List[Dict[str, Any]]:
    """Fetch nearest recycling centers sorted by distance."""
    if find_nearest_ai is not None:
        try:
            return find_nearest_ai(lat, lon)
        except Exception as e:
            print(f"[Location Service Warning]: {e}")

    # Default fallback centers near given latitude and longitude
    default_centers = [
        {
            "id": 1,
            "name": "GreenLife E-Waste & Plastic Recycling Facility",
            "address": "104 Eco Tech Park, Sector 62",
            "latitude": lat + 0.012,
            "longitude": lon + 0.008,
            "contact_phone": "+1-800-555-RECYCLE",
            "categories_accepted": ["Recyclable", "E-Waste", "Plastic"],
            "opening_hours": "08:00 - 20:00",
            "rating": 4.8,
            "distance_km": 1.4,
            "is_active": True
        },
        {
            "id": 2,
            "name": "Municipal Organic Composting & Resource Hub",
            "address": "45 Civic Avenue, Ward 12",
            "latitude": lat - 0.009,
            "longitude": lon + 0.015,
            "contact_phone": "+1-800-555-COMPOST",
            "categories_accepted": ["Compostable", "Organic", "Garden Waste"],
            "opening_hours": "07:00 - 19:00",
            "rating": 4.6,
            "distance_km": 2.1,
            "is_active": True
        },
        {
            "id": 3,
            "name": "Hazardous & Battery Safe Drop-Off Station",
            "address": "78 Industrial Estate Road",
            "latitude": lat + 0.025,
            "longitude": lon - 0.018,
            "contact_phone": "+1-800-555-HAZMAT",
            "categories_accepted": ["Hazardous", "E-Waste", "Batteries"],
            "opening_hours": "09:00 - 17:00",
            "rating": 4.9,
            "distance_km": 3.5,
            "is_active": True
        }
    ]
    return default_centers[:max_items]
