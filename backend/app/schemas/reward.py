from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class RewardCatalogResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: str
    points_cost: int
    partner_name: Optional[str]
    image_url: Optional[str]
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class RewardRedeemRequest(BaseModel):
    reward_id: int


class RewardRedeemResponse(BaseModel):
    success: bool
    transaction_id: int
    redemption_code: str
    reward_title: str
    points_spent: int
    remaining_points: int
    message: str


class UserRewardTransactionResponse(BaseModel):
    id: int
    reward_id: int
    reward_title: Optional[str] = None
    partner_name: Optional[str] = None
    points_spent: int
    redemption_code: str
    is_used: bool
    redeemed_at: datetime

    model_config = ConfigDict(from_attributes=True)
