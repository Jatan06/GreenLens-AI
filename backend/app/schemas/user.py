from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    role: str
    is_active: bool
    total_reward_points: int
    eco_score: float
    carbon_saved_kg: float
    total_scans: int
    streak_days: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None
    role: Optional[str] = None


class LeaderboardUser(BaseModel):
    rank: int
    username: str
    full_name: Optional[str] = None
    total_reward_points: int
    carbon_saved_kg: float
    eco_score: float
    total_scans: int
