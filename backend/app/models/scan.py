from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class ScanHistory(Base):
    __tablename__ = "scan_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)  # Nullable for guest scans
    image_name = Column(String(255), nullable=False)
    image_url = Column(String(500), nullable=False)
    annotated_image_url = Column(String(500), nullable=True)
    
    total_items = Column(Integer, default=0)
    total_reward = Column(Integer, default=0)
    total_carbon_saved = Column(Float, default=0.0)
    eco_score = Column(Integer, default=50)
    
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Store summary dictionary and full detection list as JSON
    summary_json = Column(JSON, nullable=True)
    detections_json = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User", back_populates="scans")
