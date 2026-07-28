from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class RecyclingCenterCreate(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    contact_phone: Optional[str] = None
    categories_accepted: List[str]
    opening_hours: Optional[str] = "09:00 - 18:00"
    rating: Optional[float] = 4.5


class RecyclingCenterResponse(BaseModel):
    id: int
    name: str
    address: str
    latitude: float
    longitude: float
    contact_phone: Optional[str] = None
    categories_accepted: Optional[List[str]] = []
    opening_hours: str
    rating: float
    distance_km: Optional[float] = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
