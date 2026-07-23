from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean
from app.database import Base


class RecyclingCenter(Base):
    __tablename__ = "recycling_centers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    address = Column(String(500), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    contact_phone = Column(String(50), nullable=True)
    categories_accepted = Column(JSON, nullable=True)  # List of strings e.g. ["Recyclable", "E-Waste"]
    opening_hours = Column(String(200), default="09:00 - 18:00")
    rating = Column(Float, default=4.5)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
