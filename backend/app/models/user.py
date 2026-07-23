from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="citizen", nullable=False)  # citizen, admin, recycler
    is_active = Column(Boolean, default=True)
    
    # Sustainability Stats
    total_reward_points = Column(Integer, default=0)
    eco_score = Column(Float, default=100.0)
    carbon_saved_kg = Column(Float, default=0.0)
    total_scans = Column(Integer, default=0)
    streak_days = Column(Integer, default=1)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    scans = relationship("ScanHistory", back_populates="user", cascade="all, delete-orphan")
    rewards_redeemed = relationship("UserRewardTransaction", back_populates="user", cascade="all, delete-orphan")
