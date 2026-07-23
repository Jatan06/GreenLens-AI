from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class RewardCatalog(Base):
    __tablename__ = "reward_catalog"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), default="Eco Discount")
    points_cost = Column(Integer, nullable=False)
    discount_code_prefix = Column(String(50), default="GREEN")
    partner_name = Column(String(150), nullable=True)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    transactions = relationship("UserRewardTransaction", back_populates="reward")


class UserRewardTransaction(Base):
    __tablename__ = "user_reward_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    reward_id = Column(Integer, ForeignKey("reward_catalog.id"), nullable=False, index=True)
    points_spent = Column(Integer, nullable=False)
    redemption_code = Column(String(100), unique=True, nullable=False)
    is_used = Column(Boolean, default=False)
    
    redeemed_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User", back_populates="rewards_redeemed")
    reward = relationship("RewardCatalog", back_populates="transactions")
