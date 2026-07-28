from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


class DetectionItem(BaseModel):
    name: str
    confidence: float
    bounding_box: BoundingBox
    category: str
    subcategory: Optional[str] = ""
    material: Optional[str] = ""
    bin: str
    reward: int
    eco_score: int
    carbon_saved: str
    description: str
    can_become: Optional[List[str]] = []
    tips: Optional[List[str]] = []
    decomposition_time: Optional[str] = ""


class OverallStats(BaseModel):
    total_items: int
    total_reward: int
    total_carbon_saved: float
    eco_score: int


class ScanResponse(BaseModel):
    id: Optional[int] = None
    success: bool = True
    overall: OverallStats
    summary: Dict[str, Any]
    detections: List[DetectionItem]
    annotated_image: str
    recycling_centers: List[Dict[str, Any]] = []
    created_at: Optional[datetime] = None


class ScanHistoryItem(BaseModel):
    id: int
    user_id: Optional[int]
    image_url: str
    annotated_image_url: Optional[str]
    total_items: int
    total_reward: int
    total_carbon_saved: float
    eco_score: int
    latitude: Optional[float]
    longitude: Optional[float]
    summary_json: Optional[Dict[str, Any]]
    detections_json: Optional[List[Dict[str, Any]]]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
